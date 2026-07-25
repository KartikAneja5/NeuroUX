from .content_based import get_content_scores
from .collaborative import get_collaborative_scores
from .affinity import calculate_user_affinity
from ..db.data_access import get_products
from .cache import recommendation_cache

def get_hybrid_recommendations(product_id, top_n=6, user_id=None, session_token=None):
    identity = user_id or session_token
    cache_key = f"hybrid_{product_id}_{identity or 'guest'}_{top_n}"
    # Do not cache for active sessions so live clicks/purchases update recommendations instantly
    if not identity:
        cached_result = recommendation_cache.get(cache_key)
        if cached_result is not None:
            return cached_result

    # Fetch all active products
    df_prod = get_products()
    if df_prod.empty:
        return []
        
    product_ids = df_prod['_id'].tolist()
    if product_id not in product_ids:
        return []

    # Map product ID -> category
    prod_cat_map = dict(zip(df_prod['_id'], df_prod['category']))

    # Compute User Category Affinity if identity exists
    user_affinity_map = {}
    if identity:
        affinity_data = calculate_user_affinity(user_id=user_id, session_token=session_token)
        if not affinity_data.get('isColdStart', True):
            for cat_item in affinity_data.get('topCategories', []):
                user_affinity_map[cat_item['category']] = cat_item['score']
        
    # Get individual score dictionaries
    content_scores = get_content_scores(product_id)
    collab_scores = get_collaborative_scores(product_id)
    
    hybrid_list = []
    
    for pid in product_ids:
        # Exclude the current product from recommendations
        if pid == product_id:
            continue
            
        # If a product has no content or collaborative scores, skip it
        if pid not in content_scores and pid not in collab_scores:
            continue
            
        c_score = content_scores.get(pid, 0.0)
        cf_score = collab_scores.get(pid, 0.0)
        
        # Base hybrid score: 50% content similarity + 50% collaborative behavior
        if pid in collab_scores:
            score = 0.5 * c_score + 0.5 * cf_score
        else:
            score = c_score
            
        # Apply user category affinity boost (+ up to 0.25 bonus for user's favorite categories)
        prod_cat = prod_cat_map.get(pid)
        if prod_cat and prod_cat in user_affinity_map:
            affinity_bonus = 0.25 * user_affinity_map[prod_cat]
            score += affinity_bonus

        hybrid_list.append({
            "productId": pid,
            "score": round(score, 4)
        })
        
    # Sort descending by score
    hybrid_list.sort(key=lambda x: x['score'], reverse=True)
    
    result = hybrid_list[:top_n]
    if not user_id:
        recommendation_cache.set(cache_key, result)
    
    # Return top N products
    return result
