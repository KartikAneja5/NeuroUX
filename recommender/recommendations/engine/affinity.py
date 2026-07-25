import pandas as pd
from ..db.data_access import get_products, get_interactions, get_behavioral_signals

DEFAULT_CATEGORIES = [
    {"category": "Basic UI Components", "score": 0.95},
    {"category": "Navigation Components", "score": 0.85},
    {"category": "Data Display Components", "score": 0.75},
    {"category": "Forms & Controls", "score": 0.65}
]

def calculate_user_affinity(user_id=None, session_token=None):
    products_df = get_products()
    if products_df.empty:
        return {"userId": user_id or session_token or "guest", "topCategories": DEFAULT_CATEGORIES}

    category_scores = {}
    
    # Map productId to category
    prod_cat_map = dict(zip(products_df['_id'], products_df['category']))

    # 1. Process Discrete Interactions
    interactions_df = get_interactions()
    if not interactions_df.empty and 'userId' in interactions_df.columns and user_id:
        user_interactions = interactions_df[interactions_df['userId'] == str(user_id)]
        for _, row in user_interactions.iterrows():
            pid = row.get('productId')
            weight = row.get('weight', 1)
            cat = prod_cat_map.get(pid)
            if cat:
                category_scores[cat] = category_scores.get(cat, 0.0) + float(weight)

    # 2. Process Continuous Behavioral Signals
    signals = get_behavioral_signals(user_id=user_id, session_token=session_token)
    for sig in signals:
        dwell_map = sig.get('categoryDwellTime', {})
        if isinstance(dwell_map, dict):
            for cat, seconds in dwell_map.items():
                if cat in prod_cat_map.values():
                    # 10 seconds of dwell time = 1 point
                    category_scores[cat] = category_scores.get(cat, 0.0) + (float(seconds) * 0.1)

        filter_clicks = sig.get('filterClicks', [])
        if isinstance(filter_clicks, list):
            for fc in filter_clicks:
                if isinstance(fc, dict):
                    filt = fc.get('filter')
                    cnt = fc.get('count', 1)
                    if filt and filt in prod_cat_map.values():
                        category_scores[filt] = category_scores.get(filt, 0.0) + (float(cnt) * 0.5)

    # Cold Start Check
    if not category_scores:
        return {
            "userId": user_id or session_token or "guest",
            "isColdStart": True,
            "topCategories": DEFAULT_CATEGORIES
        }

    # Normalize Scores (max score = 1.0)
    max_score = max(category_scores.values())
    ranked_categories = []
    for cat, score in sorted(category_scores.items(), key=lambda item: item[1], reverse=True):
        norm_score = round(score / max_score, 2) if max_score > 0 else 1.0
        ranked_categories.append({"category": cat, "score": norm_score})

    return {
        "userId": user_id or session_token or "guest",
        "isColdStart": False,
        "topCategories": ranked_categories[:5]
    }
