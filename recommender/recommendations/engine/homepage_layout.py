from .affinity import calculate_user_affinity
from ..db.data_access import get_products

def generate_homepage_layout(user_id=None, session_token=None):
    affinity = calculate_user_affinity(user_id=user_id, session_token=session_token)
    top_categories = affinity.get('topCategories', [])
    is_cold_start = affinity.get('isColdStart', True)

    products_df = get_products()
    all_categories = list(products_df['category'].unique()) if not products_df.empty else []

    if top_categories:
        primary_category = top_categories[0]['category']
    else:
        primary_category = "forms"

    # Order remaining categories according to affinity
    affinity_cat_names = [c['category'] for c in top_categories]
    ordered_categories = affinity_cat_names + [c for c in all_categories if c not in affinity_cat_names]

    # Pick top recommended components for featured category
    featured_products = []
    if not products_df.empty and primary_category in products_df['category'].values:
        cat_prods = products_df[products_df['category'] == primary_category].head(4)
        for _, p in cat_prods.iterrows():
            featured_products.append({
                "_id": str(p['_id']),
                "name": p['name'],
                "price": p['price'],
                "category": p['category'],
                "previewImageUrl": p.get('previewImageUrl', '/images/glow-glass-pricing.png')
            })

    return {
        "userId": user_id or session_token or "guest",
        "isColdStart": is_cold_start,
        "featuredCategory": primary_category,
        "categoryOrder": ordered_categories[:6],
        "showNewArrivalsBanner": is_cold_start,
        "personalizedBadge": "★ Picked for Your Design Profile" if not is_cold_start else "🔥 Trending UI/UX Components",
        "featuredProducts": featured_products
    }
