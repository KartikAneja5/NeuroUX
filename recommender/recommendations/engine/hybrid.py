from .content_based import get_content_scores
from .collaborative import get_collaborative_scores
from ..db.data_access import get_products
from .cache import recommendation_cache

def get_hybrid_recommendations(product_id, top_n=6):
    cache_key = f"hybrid_{product_id}_{top_n}"
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
        
        # Merge formula: 50% content similarity + 50% user behavior similarity
        # If collaborative scores are not available, default completely to content scores
        if pid in collab_scores:
            score = 0.5 * c_score + 0.5 * cf_score
        else:
            score = c_score
            
        hybrid_list.append({
            "productId": pid,
            "score": round(score, 4)
        })
        
    # Sort descending by score
    hybrid_list.sort(key=lambda x: x['score'], reverse=True)
    
    result = hybrid_list[:top_n]
    recommendation_cache.set(cache_key, result)
    
    # Return top N products
    return result
