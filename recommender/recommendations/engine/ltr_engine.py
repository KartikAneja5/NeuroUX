import os
import numpy as np
import xgboost as xgb
from .content_based import get_content_scores
from .collaborative import get_collaborative_scores
from .affinity import calculate_user_affinity
from .co_occurrence import get_complementary_categories
from .feature_extractor import extract_candidate_features
from ..db.data_access import get_products, get_user_purchased_product_ids, get_user_price_preference
from .cache import recommendation_cache

_RANKER_MODEL = None

def get_loaded_ranker():
    global _RANKER_MODEL
    if _RANKER_MODEL is not None:
        return _RANKER_MODEL

    model_path = os.path.join(os.path.dirname(__file__), 'models', 'xgboost_ltr.json')
    if os.path.exists(model_path):
        try:
            ranker = xgb.XGBRanker()
            ranker.load_model(model_path)
            _RANKER_MODEL = ranker
            return _RANKER_MODEL
        except Exception as e:
            print(f"[WARN] Failed to load XGBoost LTR model: {e}")
            return None
    return None

def get_ltr_recommendations(product_id, top_n=6, user_id=None, session_token=None):
    identity = user_id or session_token
    cache_key = f"ltr_{product_id}_{identity or 'guest'}_{top_n}"
    if not identity:
        cached = recommendation_cache.get(cache_key)
        if cached is not None:
            return cached

    df_prod = get_products()
    if df_prod.empty or product_id not in df_prod['_id'].values:
        return []

    purchased_ids = get_user_purchased_product_ids(user_id=user_id, session_token=session_token)
    purchased_categories = set(df_prod[df_prod['_id'].isin(purchased_ids)]['category'].tolist()) if purchased_ids else set()
    target_price_pref = get_user_price_preference(user_id=user_id, session_token=session_token)

    prod_cat_map = dict(zip(df_prod['_id'], df_prod['category']))
    target_cat = prod_cat_map.get(product_id, "")
    complementary_cats = get_complementary_categories(target_cat)

    user_affinity_map = {}
    if identity:
        affinity_data = calculate_user_affinity(user_id=user_id, session_token=session_token)
        if not affinity_data.get('isColdStart', True):
            for cat_item in affinity_data.get('topCategories', []):
                user_affinity_map[cat_item['category']] = cat_item['score']

    content_scores = get_content_scores(product_id)
    collab_scores = get_collaborative_scores(product_id)

    # Stage 1: Candidate Generation / Retrieval (Top 20 candidates)
    candidate_ids = []
    for pid in df_prod['_id'].tolist():
        if pid == product_id or pid in purchased_ids:
            continue
        if pid in content_scores or pid in collab_scores:
            candidate_ids.append(pid)

    if not candidate_ids:
        return []

    ranker = get_loaded_ranker()
    ranked_results = []

    if ranker is not None:
        # Stage 2: XGBoost Learning-to-Rank (LTR) Scoring
        feature_list = []
        for cand_pid in candidate_ids:
            vec = extract_candidate_features(
                cand_pid, product_id, df_prod, content_scores, collab_scores,
                user_affinity_map, purchased_categories, complementary_cats, target_price_pref
            )
            feature_list.append(vec)

        X_cand = np.array(feature_list, dtype=np.float32)
        ltr_scores = ranker.predict(X_cand)

        for idx, cand_pid in enumerate(candidate_ids):
            score = float(ltr_scores[idx])
            c_score = content_scores.get(cand_pid, 0.0)
            cand_cat = str(prod_cat_map.get(cand_pid, "")).lower()

            if cand_cat in complementary_cats and target_cat:
                reason = f"Frequently paired with {target_cat.capitalize()}"
            elif c_score > 0.35:
                reason = "Matches design style & tags"
            elif cand_cat in user_affinity_map:
                reason = "Picked for your design stack"
            else:
                reason = "Top ML predicted conversion match"

            ranked_results.append({
                "productId": cand_pid,
                "score": round(score, 4),
                "reason": reason
            })

        ranked_results.sort(key=lambda x: x['score'], reverse=True)
    else:
        # Fallback to hybrid scoring if ranker model file is absent
        for cand_pid in candidate_ids:
            c_score = content_scores.get(cand_pid, 0.0)
            ranked_results.append({
                "productId": cand_pid,
                "score": round(c_score, 4),
                "reason": "Top-rated component match"
            })
        ranked_results.sort(key=lambda x: x['score'], reverse=True)

    result = ranked_results[:top_n]
    if not user_id:
        recommendation_cache.set(cache_key, result)

    return result
