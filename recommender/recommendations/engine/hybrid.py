from .content_based import get_content_scores
from .collaborative import get_collaborative_scores
from .affinity import calculate_user_affinity
from .co_occurrence import get_complementary_categories
from ..db.data_access import get_products, get_user_purchased_product_ids, get_user_price_preference
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

    # Fetch user's purchased product IDs to exclude owned items and seed recommendations
    purchased_ids = get_user_purchased_product_ids(user_id=user_id, session_token=session_token)
    purchased_categories = set(df_prod[df_prod['_id'].isin(purchased_ids)]['category'].tolist()) if purchased_ids else set()

    # User price preference
    target_price_pref = get_user_price_preference(user_id=user_id, session_token=session_token)

    # Map product ID -> category, rating, price
    prod_cat_map = dict(zip(df_prod['_id'], df_prod['category']))
    prod_price_map = dict(zip(df_prod['_id'], df_prod['price'])) if 'price' in df_prod.columns else {}
    prod_rating_map = dict(zip(df_prod['_id'], df_prod['averageRating'])) if 'averageRating' in df_prod.columns else {}

    # Target product category & complementary categories
    target_cat = prod_cat_map.get(product_id, "")
    complementary_cats = get_complementary_categories(target_cat)

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
        # Exclude current product AND any products the user ALREADY purchased
        if pid == product_id or pid in purchased_ids:
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

        # Purchased Seed Boost: Boost unowned items in categories matching user's past purchases
        if prod_cat and prod_cat in purchased_categories:
            score += 0.35

        # 1. Feature 1: Cross-Category Complementary Boost
        prod_cat_clean = str(prod_cat or "").lower().strip()
        is_complementary = False
        if prod_cat_clean and prod_cat_clean in complementary_cats:
            co_bonus = 0.30 * complementary_cats[prod_cat_clean]
            score += co_bonus
            is_complementary = True

        # 2. Feature 2: Price-Band Sensitivity Alignment
        prod_price = float(prod_price_map.get(pid, 499.0))
        price_diff = abs(prod_price - target_price_pref)
        max_p = max(prod_price, target_price_pref, 100.0)
        price_alignment = max(0.8, 1.15 - (price_diff / max_p) * 0.35)
        score *= price_alignment

        # 3. Feature 3: Product Rating Multiplier
        raw_rating = prod_rating_map.get(pid, 5.0)
        try:
            avg_rating = float(raw_rating) if raw_rating is not None else 5.0
        except (ValueError, TypeError):
            avg_rating = 5.0
        rating_multiplier = 0.8 + 0.2 * (avg_rating / 5.0)
        score = score * rating_multiplier

        # Generate Explainable AI Reason (XAI) Badge String
        if is_complementary and target_cat:
            reason = f"Frequently paired with {target_cat.capitalize()}"
        elif c_score > 0.35:
            reason = "Matches design style & tags"
        elif prod_cat and prod_cat in user_affinity_map:
            reason = "Picked for your design stack"
        elif price_alignment > 1.0:
            reason = "Fits your target budget"
        else:
            reason = "Top-rated component match"

        hybrid_list.append({
            "productId": pid,
            "score": round(score, 4),
            "reason": reason
        })
        
    # Sort descending by score
    hybrid_list.sort(key=lambda x: x['score'], reverse=True)
    
    result = hybrid_list[:top_n]
    if not user_id:
        recommendation_cache.set(cache_key, result)
    
    # Return top N products
    return result
