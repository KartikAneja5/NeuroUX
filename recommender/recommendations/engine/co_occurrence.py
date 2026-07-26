import pandas as pd
from ..db.mongo_client import MongoClientSingleton
from ..db.data_access import get_products

def build_category_co_occurrence_matrix():
    db = MongoClientSingleton.get_db()
    orders = list(db.orders.find({"status": "completed"}, {"items": 1}))
    if not orders:
        return {}

    products_df = get_products()
    if products_df.empty:
        return {}
        
    prod_cat_map = dict(zip(products_df['_id'], products_df['category']))

    co_counts = {}
    cat_counts = {}

    for order in orders:
        items = order.get('items', [])
        cats_in_order = set()
        for it in items:
            pid = str(it.get('productId') or it.get('id') or '')
            cat = prod_cat_map.get(pid)
            if cat:
                cats_in_order.add(cat)

        cats_list = list(cats_in_order)
        for cat in cats_list:
            cat_counts[cat] = cat_counts.get(cat, 0) + 1

        # Pairwise co-occurrences
        for i in range(len(cats_list)):
            for j in range(i + 1, len(cats_list)):
                c1, c2 = cats_list[i], cats_list[j]
                co_counts[(c1, c2)] = co_counts.get((c1, c2), 0) + 1
                co_counts[(c2, c1)] = co_counts.get((c2, c1), 0) + 1

    # Normalize conditional probability: P(C2 | C1)
    co_matrix = {}
    for (c1, c2), count in co_counts.items():
        total_c1 = cat_counts.get(c1, 1)
        prob = round(count / float(total_c1), 3)
        if c1 not in co_matrix:
            co_matrix[c1] = {}
        co_matrix[c1][c2] = prob

    return co_matrix

def get_complementary_categories(target_category):
    # Default domain-rule fallback for UI design components if order count is sparse
    DEFAULT_COMPLEMENTARY = {
        "forms": ["buttons", "modals", "cards"],
        "cards": ["buttons", "navbars", "forms"],
        "navbars": ["cards", "buttons", "hero"],
        "buttons": ["forms", "cards", "modals"],
        "modals": ["buttons", "forms", "cards"]
    }

    target_clean = str(target_category or "").lower().strip()

    matrix = build_category_co_occurrence_matrix()
    matrix_clean = {str(k).lower().strip(): {str(k2).lower().strip(): v2 for k2, v2 in v.items()} for k, v in matrix.items()}

    if target_clean in matrix_clean and matrix_clean[target_clean]:
        sorted_co = sorted(matrix_clean[target_clean].items(), key=lambda x: x[1], reverse=True)
        return {cat: score for cat, score in sorted_co}

    fallbacks = DEFAULT_COMPLEMENTARY.get(target_clean, ["cards", "buttons"])
    return {cat.lower(): 0.75 for cat in fallbacks}
