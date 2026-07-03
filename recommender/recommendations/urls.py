from django.urls import path
from .views import HybridRecommendationView

urlpatterns = [
    path('recommend/<str:product_id>/', HybridRecommendationView.as_view(), name='hybrid-recommendations'),
]
