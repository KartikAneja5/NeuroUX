from rest_framework import serializers

class RecommendationItemSerializer(serializers.Serializer):
    productId = serializers.CharField()
    score = serializers.FloatField()

class RecommendationResponseSerializer(serializers.Serializer):
    productId = serializers.CharField()
    recommendations = RecommendationItemSerializer(many=True)
