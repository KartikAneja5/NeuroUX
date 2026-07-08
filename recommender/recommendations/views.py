from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RecommendationResponseSerializer
from .engine.hybrid import get_hybrid_recommendations

class HybridRecommendationView(APIView):
    def get(self, request, product_id):
        top_n = int(request.query_params.get('top_n', 6))
        
        try:
            recommendations = get_hybrid_recommendations(product_id, top_n)
            
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
