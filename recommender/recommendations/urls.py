from django.urls import path
from .views import HybridRecommendationView, UserAffinityView, HomepageLayoutView, SiteInsightsView

urlpatterns = [
    path('recommend/<str:product_id>/', HybridRecommendationView.as_view(), name='hybrid-recommendations'),
    path('user-affinity/', UserAffinityView.as_view(), name='user-affinity-guest'),
    path('user-affinity/<str:user_id>/', UserAffinityView.as_view(), name='user-affinity'),
    path('homepage-layout/', HomepageLayoutView.as_view(), name='homepage-layout-guest'),
    path('homepage-layout/<str:user_id>/', HomepageLayoutView.as_view(), name='homepage-layout'),
    path('site-insights/', SiteInsightsView.as_view(), name='site-insights'),
]
