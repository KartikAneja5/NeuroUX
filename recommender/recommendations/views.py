from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RecommendationResponseSerializer

class HybridRecommendationView(APIView):
    def get(self, request, product_id):
        user_id = request.query_params.get('user_id', '')
        top_n = int(request.query_params.get('top_n', 6))
        
        # Stub response
        data = {
            "productId": product_id,
            "recommendations": [
                { "productId": "stub_prod_1", "score": 0.95 },
                { "productId": "stub_prod_2", "score": 0.85 }
            ]
        }
        
        serializer = RecommendationResponseSerializer(data=data)
        if serializer.is_valid():
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
