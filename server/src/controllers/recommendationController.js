const axios = require('axios');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
require('dotenv').config();

const RECOMMENDER_URL = process.env.RECOMMENDER_URL || 'http://localhost:8000';

exports.getRecommendations = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.query.user_id || '';
  const limit = parseInt(req.query.limit || 6);

  try {
    const response = await axios.get(`${RECOMMENDER_URL}/api/recommend/${id}/`, {
      params: { user_id: userId, top_n: limit }
    });

    const recommendations = response.data.recommendations || [];
    const recommendedIds = recommendations.map(r => r.productId);

    const products = await Product.find({ _id: { $in: recommendedIds }, isActive: true });

    const sortedProducts = recommendedIds
      .map(recId => products.find(p => p._id.toString() === recId))
      .filter(Boolean);

    res.json(sortedProducts);
  } catch (error) {
    console.error('Error querying Django recommender:', error.message);

    const currentProduct = await Product.findById(id);
    const categoryQuery = currentProduct ? { category: currentProduct.category } : {};

    const fallbackProducts = await Product.find({
      _id: { $ne: id },
      ...categoryQuery,
      isActive: true
    }).limit(limit);

    res.json(fallbackProducts);
  }
});

// Phase 3 Proxy: Homepage Personalized Layout (Layer 1)
exports.getHomepageLayout = asyncHandler(async (req, res) => {
  const userId = req.query.user_id || '';
  const sessionToken = req.query.session_token || '';

  try {
    const endpoint = userId ? `${RECOMMENDER_URL}/api/homepage-layout/${userId}/` : `${RECOMMENDER_URL}/api/homepage-layout/`;
    const response = await axios.get(endpoint, {
      params: { session_token: sessionToken }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error proxying homepage layout:', error.message);
    res.json({
      userId: userId || sessionToken || 'guest',
      isColdStart: true,
      featuredCategory: "Basic UI Components",
      categoryOrder: ["Basic UI Components", "Navigation Components", "Data Display Components"],
      showNewArrivalsBanner: true,
      personalizedBadge: "🔥 Trending UI/UX Components",
      featuredProducts: []
    });
  }
});

// Phase 4 Proxy: Aggregate Site Insights (Layer 2)
exports.getSiteInsights = asyncHandler(async (req, res) => {
  try {
    const response = await axios.get(`${RECOMMENDER_URL}/api/site-insights/`);
    res.json(response.data);
  } catch (error) {
    console.error('Error proxying site insights:', error.message);
    res.json({
      generatedAt: new Date(),
      insights: [
        {
          title: "System Telemetry Active",
          type: "info",
          metric: "Monitoring",
          description: "NeuroUX Layer-2 Business Intelligence engine is active and collecting user interaction signals."
        }
      ]
    });
  }
});
