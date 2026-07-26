from .ltr_engine import get_ltr_recommendations

def get_hybrid_recommendations(product_id, top_n=6, user_id=None, session_token=None):
    """
    Two-Stage E-Commerce Machine Learning Recommendation Engine.
    Stage 1: Fast Candidate Generation (TF-IDF & Category Affinity).
    Stage 2: XGBoost Pairwise Learning-to-Rank (LTR) scoring model.
    """
    return get_ltr_recommendations(product_id, top_n=top_n, user_id=user_id, session_token=session_token)
