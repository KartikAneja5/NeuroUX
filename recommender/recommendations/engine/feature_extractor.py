import numpy as np

def extract_candidate_features(candidate_pid, product_id, df_prod, content_scores, collab_scores, user_affinity_map, purchased_categories, complementary_cats, target_price_pref):
    cand_row = df_prod[df_prod['_id'] == candidate_pid]
    if cand_row.empty:
        return [0.0] * 10

    row = cand_row.iloc[0]
    prod_cat = str(row.get('category', '')).lower().strip()
    prod_price = float(row.get('price', 499.0))
    raw_rating = row.get('averageRating', 5.0)
    try:
        avg_rating = float(raw_rating) if raw_rating is not None else 5.0
    except (ValueError, TypeError):
        avg_rating = 5.0
    num_reviews = float(row.get('numReviews', 0))

    # Feature 1: Content Similarity
    f1_content = float(content_scores.get(candidate_pid, 0.0))

    # Feature 2: Collaborative Score
    f2_collab = float(collab_scores.get(candidate_pid, 0.0))

    # Feature 3: User Category Affinity
    f3_affinity = float(user_affinity_map.get(prod_cat, 0.0))

    # Feature 4: Category Co-Occurrence Score
    f4_cooccur = float(complementary_cats.get(prod_cat, 0.0))

    # Feature 5: Price Difference Ratio
    price_diff = abs(prod_price - target_price_pref)
    max_p = max(prod_price, target_price_pref, 100.0)
    f5_price_diff = float(price_diff / max_p)

    # Feature 6: Rating
    f6_rating = float(avg_rating / 5.0)

    # Feature 7: Log Review Count
    f7_reviews = float(np.log1p(num_reviews))

    # Feature 8: Is Complementary Category (1.0 or 0.0)
    f8_is_comp = 1.0 if prod_cat in complementary_cats else 0.0

    # Feature 9: Is Seed Purchased Category (1.0 or 0.0)
    f9_is_seed = 1.0 if prod_cat in purchased_categories else 0.0

    # Feature 10: Normalized Price Tier
    f10_price = float(prod_price / 2500.0)

    return [
        f1_content,
        f2_collab,
        f3_affinity,
        f4_cooccur,
        f5_price_diff,
        f6_rating,
        f7_reviews,
        f8_is_comp,
        f9_is_seed,
        f10_price
    ]
