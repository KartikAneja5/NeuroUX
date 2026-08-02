import jwt
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RecommendationResponseSerializer
from .engine.hybrid import get_hybrid_recommendations
from .engine.affinity import calculate_user_affinity
from .engine.homepage_layout import generate_homepage_layout
from .db.mongo_client import MongoClientSingleton

def _authenticate_and_resolve_user(request, requested_user_id=None):
    """
    Strictly authenticates user identity for recommendation endpoints:
    1. If an Authorization Bearer JWT is present, verifies signature with settings.JWT_SECRET.
    2. If JWT is valid, extracts auth_user_id. If requested_user_id is also supplied,
       ensures requested_user_id == auth_user_id (otherwise returns 403 Forbidden).
    3. If an unauthenticated requested_user_id is passed without a valid JWT,
       returns 401 Unauthorized (prevents IDOR history/affinity leaks).
    4. If no JWT and no requested_user_id are present, returns (None, None) for guest session.
    
    Returns: (effective_user_id, error_response_or_None)
    """
    auth_header = request.headers.get('Authorization', '')
    jwt_user_id = None

    if auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1].strip()
        try:
            jwt_secret = getattr(settings, 'JWT_SECRET', 'neuroux_jwt_super_secret_key_2026')
            payload = jwt.decode(token, jwt_secret, algorithms=['HS256'])
            jwt_user_id = payload.get('id') or payload.get('_id') or payload.get('sub')
        except jwt.ExpiredSignatureError:
            return None, Response({"error": "JWT token has expired"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return None, Response({"error": "Invalid JWT token signature"}, status=status.HTTP_401_UNAUTHORIZED)

    param_user_id = requested_user_id or request.query_params.get('user_id')

    # Case A: JWT is present and verified
    if jwt_user_id:
        if param_user_id and str(param_user_id) != str(jwt_user_id):
            return None, Response(
                {"error": "Forbidden: Requested user_id does not match authenticated JWT token claim"},
                status=status.HTTP_403_FORBIDDEN
            )
        return str(jwt_user_id), None

    # Case B: Requested user_id supplied without valid JWT -> Reject IDOR attempt
    if param_user_id:
        return None, Response(
            {"error": "Unauthorized: Accessing personalized user data requires a valid Authorization JWT token"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    # Case C: Anonymous / Guest Session
    return None, None


class HybridRecommendationView(APIView):
    """
    Returns Two-Stage XGBoost LTR product recommendations.
    Accepts guest sessions or verified JWT authenticated user identity.
    Rejects unauthenticated user_id IDOR attempts with 401/403.
    """
    def get(self, request, product_id):
        top_n = int(request.query_params.get('top_n', 6))
        session_token = request.query_params.get('session_token', None)
        
        user_id, err_response = _authenticate_and_resolve_user(request)
        if err_response:
            return err_response
        
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
    """
    Returns user category affinity breakdown. Requires verified JWT for user-level lookups.
    """
    def get(self, request, user_id=None):
        session_token = request.query_params.get('session_token')
        
        resolved_user_id, err_response = _authenticate_and_resolve_user(request, requested_user_id=user_id)
        if err_response:
            return err_response

        try:
            affinity_data = calculate_user_affinity(user_id=resolved_user_id, session_token=session_token)
            return Response(affinity_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class HomepageLayoutView(APIView):
    """
    Returns personalized homepage layout carousels. Requires verified JWT for user-level lookups.
    """
    def get(self, request, user_id=None):
        session_token = request.query_params.get('session_token')
        
        resolved_user_id, err_response = _authenticate_and_resolve_user(request, requested_user_id=user_id)
        if err_response:
            return err_response

        try:
            layout_data = generate_homepage_layout(user_id=resolved_user_id, session_token=session_token)
            return Response(layout_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SiteInsightsView(APIView):
    """
    Public site insights summary endpoint.
    """
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

