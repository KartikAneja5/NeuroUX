import base64
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RecommendationResponseSerializer
from .engine.hybrid import get_hybrid_recommendations
from .engine.affinity import calculate_user_affinity
from .engine.homepage_layout import generate_homepage_layout
from .db.mongo_client import MongoClientSingleton

def _extract_user_id_from_request(request):
    """
    Helper function to extract user_id from query parameters or Authorization JWT token.
    The Recommender API is a public read-only service that accepts optional user credentials.
    """
    user_id = request.query_params.get('user_id')
    if user_id:
        return user_id

    auth_header = request.headers.get('Authorization', '')
    if auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
        try:
            parts = token.split('.')
            if len(parts) >= 2:
                payload_b64 = parts[1]
                payload_b64 += '=' * (-len(payload_b64) % 4)
                decoded_bytes = base64.b64decode(payload_b64)
                payload = json.loads(decoded_bytes.decode('utf-8'))
                return payload.get('id') or payload.get('_id') or payload.get('sub')
        except Exception:
            return None
    return None


class HybridRecommendationView(APIView):
    """
    Public read-only endpoint returning Two-Stage XGBoost LTR product recommendations.
    Accepts optional user_id / session_token or Authorization Bearer header.
    """
    def get(self, request, product_id):
        top_n = int(request.query_params.get('top_n', 6))
        user_id = _extract_user_id_from_request(request)
        session_token = request.query_params.get('session_token', None)
        
        try:
            recommendations = get_hybrid_recommendations(product_id, top_n, user_id=user_id, session_token=session_token)
            
            data = {
                "productId": product_id,
                "recommendations": recommendations
            }
            
            serializer = RecommendationResponseSerializer(data=data)
            if serializer.is_valid():
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserAffinityView(APIView):
    def get(self, request, user_id=None):
        session_token = request.query_params.get('session_token')
        try:
            affinity_data = calculate_user_affinity(user_id=user_id, session_token=session_token)
            return Response(affinity_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class HomepageLayoutView(APIView):
    def get(self, request, user_id=None):
        session_token = request.query_params.get('session_token')
        try:
            layout_data = generate_homepage_layout(user_id=user_id, session_token=session_token)
            return Response(layout_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SiteInsightsView(APIView):
    def get(self, request):
        try:
            db = MongoClientSingleton.get_db()
            doc = db.site_insights.find_one({}, sort=[("generatedAt", -1)])
            if not doc:
                return Response({"insights": []}, status=status.HTTP_200_OK)
            return Response({
                "generatedAt": doc.get("generatedAt"),
                "insights": doc.get("insights", [])
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
