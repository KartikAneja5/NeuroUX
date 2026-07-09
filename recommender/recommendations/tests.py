from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from unittest.mock import patch
import pandas as pd

from .engine.content_based import get_content_scores
from .engine.collaborative import get_collaborative_scores
from .engine.hybrid import get_hybrid_recommendations
from .engine.cache import recommendation_cache

class RecommendationEngineTestCase(TestCase):
    def setUp(self):
        # Set up a generic DataFrame of mock products
        self.mock_products_data = [
            {"_id": "p1", "name": "Split Text Animation", "category": "Text Animations", "tags": ["text", "framer-motion", "split"], "description": "Animate letters of a text widget", "isActive": True},
            {"_id": "p2", "name": "Blur Text Animation", "category": "Text Animations", "tags": ["text", "blur", "reveal"], "description": "Reveal text cinematic blur", "isActive": True},
            {"_id": "p3", "name": "Magic Bento Grid", "category": "Components", "tags": ["component", "bento", "grid"], "description": "Beautiful bento grid cards", "isActive": True},
            {"_id": "p4", "name": "Electric Border Animation", "category": "Animations", "tags": ["animation", "border", "glow"], "description": "Glow lines around border", "isActive": True}
        ]
        self.df_products = pd.DataFrame(self.mock_products_data)

        # Set up a generic DataFrame of mock interactions
        self.mock_interactions_data = [
            {"_id": "i1", "userId": "u1", "productId": "p1", "type": "view", "weight": 1},
            {"_id": "i2", "userId": "u1", "productId": "p2", "type": "cart", "weight": 3},
            {"_id": "i3", "userId": "u2", "productId": "p1", "type": "purchase", "weight": 5},
            {"_id": "i4", "userId": "u2", "productId": "p2", "type": "view", "weight": 1},
            {"_id": "i5", "userId": "u3", "productId": "p3", "type": "view", "weight": 1}
        ]
        self.df_interactions = pd.DataFrame(self.mock_interactions_data)

    @patch('recommendations.engine.content_based.get_products')
    def test_content_based_recommendations(self, mock_get_products):
        mock_get_products.return_value = self.df_products

        # Get scores for 'p1' (Split Text Animation)
        scores = get_content_scores("p1")

        # Verify output types and sanity checks
        self.assertIsInstance(scores, dict)
        self.assertIn("p1", scores)
        self.assertIn("p2", scores)
        
        # 'p2' (Blur Text Animation) is also in 'Text Animations' category and shares 'text' tag
        # 'p3' (Magic Bento Grid) has no overlap in tags or category
        # Therefore, similarity score of 'p2' should be greater than 'p3'
        self.assertGreater(scores["p2"], scores["p3"])

    @patch('recommendations.engine.collaborative.get_interactions')
    @patch('recommendations.engine.collaborative.get_products')
    def test_collaborative_recommendations(self, mock_get_products, mock_get_interactions):
        mock_get_products.return_value = self.df_products
        mock_get_interactions.return_value = self.df_interactions

        # Get collaborative scores for 'p1'
        scores = get_collaborative_scores("p1")

        self.assertIsInstance(scores, dict)
        # 'p1' and 'p2' are co-interacted by users 'u1' and 'u2'
        self.assertIn("p2", scores)
        self.assertGreater(scores["p2"], 0.0)

        # 'p3' has only been interacted by 'u3', who did not interact with 'p1'
        # So 'p3' similarity should not be computed, or be 0
        self.assertEqual(scores.get("p3", 0.0), 0.0)

    @patch('recommendations.engine.collaborative.get_interactions')
    @patch('recommendations.engine.collaborative.get_products')
    def test_collaborative_recommendations_cold_start(self, mock_get_products, mock_get_interactions):
        mock_get_products.return_value = self.df_products
        # Return empty interactions to simulate new environment/cold start
        mock_get_interactions.return_value = pd.DataFrame()

        scores = get_collaborative_scores("p1")
        self.assertEqual(scores, {})

    @patch('recommendations.engine.hybrid.get_products')
    @patch('recommendations.engine.hybrid.get_collaborative_scores')
    @patch('recommendations.engine.hybrid.get_content_scores')
    def test_hybrid_recommendations(self, mock_content_scores, mock_collab_scores, mock_get_products):
        mock_get_products.return_value = self.df_products
        
        # Define deterministic mock scores
        mock_content_scores.return_value = {"p1": 1.0, "p2": 0.8, "p3": 0.1, "p4": 0.3}
        mock_collab_scores.return_value = {"p1": 1.0, "p2": 0.6, "p3": 0.0, "p4": 0.0}

        # Request hybrid recommendation for 'p1', expecting top 2 recommendations
        recommendations = get_hybrid_recommendations("p1", top_n=2)

        # Output shape check: list of dicts with productId and score
        self.assertEqual(len(recommendations), 2)
        
        # Current item 'p1' should be excluded from recommendation candidates
        recommended_ids = [item['productId'] for item in recommendations]
        self.assertNotIn("p1", recommended_ids)

        # Check hybrid score math for p2: 0.5 * 0.8 + 0.5 * 0.6 = 0.70
        p2_rec = next(item for item in recommendations if item['productId'] == "p2")
        self.assertAlmostEqual(p2_rec['score'], 0.70, places=4)

    @patch('recommendations.views.get_hybrid_recommendations')
    def test_api_view_success(self, mock_hybrid):
        # Setup mock recommendations list
        mock_hybrid.return_value = [
            {"productId": "p2", "score": 0.75},
            {"productId": "p4", "score": 0.15}
        ]

        # Call DRF View through routing
        url = reverse('hybrid-recommendations', kwargs={'product_id': 'p1'})
        response = self.client.get(url, {'top_n': 2})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['productId'], 'p1')
        self.assertEqual(len(response.data['recommendations']), 2)
        self.assertEqual(response.data['recommendations'][0]['productId'], 'p2')
        self.assertEqual(response.data['recommendations'][0]['score'], 0.75)

    @patch('recommendations.engine.hybrid.get_products')
    @patch('recommendations.engine.hybrid.get_collaborative_scores')
    @patch('recommendations.engine.hybrid.get_content_scores')
    def test_recommendation_caching(self, mock_content_scores, mock_collab_scores, mock_get_products):
        mock_get_products.return_value = self.df_products
        recommendation_cache.clear()

        # Define initial deterministic mock scores
        mock_content_scores.return_value = {"p1": 1.0, "p2": 0.8}
        mock_collab_scores.return_value = {"p1": 1.0, "p2": 0.6}

        # First call: calculates and stores in cache
        first_call = get_hybrid_recommendations("p1", top_n=2)
        self.assertEqual(len(first_call), 1)  # only p2 remains after filtering p1
        self.assertEqual(first_call[0]['productId'], "p2")
        self.assertAlmostEqual(first_call[0]['score'], 0.70, places=4)

        # Change mock return values to prove the next call doesn't run the score calculations
        mock_content_scores.return_value = {"p1": 1.0, "p2": 0.1}
        mock_collab_scores.return_value = {"p1": 1.0, "p2": 0.1}

        # Second call: should retrieve cached results (score = 0.70, not 0.10)
        second_call = get_hybrid_recommendations("p1", top_n=2)
        self.assertEqual(second_call[0]['productId'], "p2")
        self.assertAlmostEqual(second_call[0]['score'], 0.70, places=4)

        # Clear cache: now it should compute new values (score = 0.10)
        recommendation_cache.clear()
        third_call = get_hybrid_recommendations("p1", top_n=2)
        self.assertEqual(third_call[0]['productId'], "p2")
        self.assertAlmostEqual(third_call[0]['score'], 0.10, places=4)
