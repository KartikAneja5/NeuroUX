import os
import sys

# Ensure recommender directory is in sys.path before package imports
recommender_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
if recommender_dir not in sys.path:
    sys.path.insert(0, recommender_dir)

import json
import numpy as np
import pandas as pd
import xgboost as xgb

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "recommender_project.settings")
try:
    import django
    django.setup()
except Exception:
    pass

from recommendations.db.data_access import get_products, get_interactions, get_user_purchased_product_ids, get_user_price_preference
from recommendations.engine.content_based import get_content_scores
from recommendations.engine.collaborative import get_collaborative_scores
from recommendations.engine.affinity import calculate_user_affinity
from recommendations.engine.co_occurrence import get_complementary_categories
from recommendations.engine.feature_extractor import extract_candidate_features

def train_xgboost_ltr_model():
    print("=" * 60)
    print("  TRAINING TWO-STAGE XGBOOST LEARNING-TO-RANK (LTR) MODEL")
    print("=" * 60)

    df_prod = get_products()
    if df_prod.empty:
        print("[ERROR] Catalog is empty. Cannot train XGBRanker.")
        return False

    interactions_df = get_interactions()

    X = []
    y = []
    groups = []

    # Map interaction types to relevance label values
    RELEVANCE_MAP = {
        'view': 1,
        'wishlist': 2,
        'cart': 4,
        'purchase': 5
    }

    # Group interactions by session/user
    if not interactions_df.empty and 'productId' in interactions_df.columns:
        user_col = 'userId' if 'userId' in interactions_df.columns else ('sessionToken' if 'sessionToken' in interactions_df.columns else None)
        if user_col:
            grouped = interactions_df.groupby(user_col)
            for uid, group in grouped:
                user_id = str(uid)
                purchased_ids = get_user_purchased_product_ids(user_id=user_id)
                purchased_categories = set(df_prod[df_prod['_id'].isin(purchased_ids)]['category'].tolist()) if purchased_ids else set()
                target_price_pref = get_user_price_preference(user_id=user_id)

                affinity_data = calculate_user_affinity(user_id=user_id)
                user_affinity_map = {}
                if not affinity_data.get('isColdStart', True):
                    for cat_item in affinity_data.get('topCategories', []):
                        user_affinity_map[cat_item['category']] = cat_item['score']

                group_items = 0
                for _, row in group.iterrows():
                    pid = str(row['productId'])
                    if pid not in df_prod['_id'].values:
                        continue

                    # Select candidate items for ranking
                    cand_ids = df_prod['_id'].tolist()
                    target_cat = str(df_prod[df_prod['_id'] == pid].iloc[0].get('category', '')).lower()
                    complementary_cats = get_complementary_categories(target_cat)
                    content_scores = get_content_scores(pid)
                    collab_scores = get_collaborative_scores(pid)

                    for cand_pid in cand_ids[:8]:
                        if cand_pid == pid:
                            rel = RELEVANCE_MAP.get(row.get('type', 'view'), 1)
                        else:
                            rel = 0

                        feat_vec = extract_candidate_features(
                            cand_pid, pid, df_prod, content_scores, collab_scores,
                            user_affinity_map, purchased_categories, complementary_cats, target_price_pref
                        )
                        X.append(feat_vec)
                        y.append(rel)
                        group_items += 1

                if group_items > 0:
                    groups.append(group_items)

    # Fallback synthetic training dataset if interactions are sparse
    if len(X) < 10 or not groups:
        print("[INFO] Generating synthetic LTR training dataset from catalog similarity...")
        X = []
        y = []
        groups = []
        for i, row in df_prod.iterrows():
            pid = row['_id']
            target_cat = str(row.get('category', '')).lower()
            complementary_cats = get_complementary_categories(target_cat)
            content_scores = get_content_scores(pid)
            collab_scores = get_collaborative_scores(pid)

            group_count = 0
            for j, cand_row in df_prod.iterrows():
                cand_pid = cand_row['_id']
                c_score = content_scores.get(cand_pid, 0.0)
                rel = int(c_score * 5) if cand_pid != pid else 5

                feat_vec = extract_candidate_features(
                    cand_pid, pid, df_prod, content_scores, collab_scores,
                    {}, set(), complementary_cats, 499.0
                )
                X.append(feat_vec)
                y.append(rel)
                group_count += 1

            if group_count > 0:
                groups.append(group_count)

    X_np = np.array(X, dtype=np.float32)
    y_np = np.array(y, dtype=np.int32)
    groups_np = np.array(groups, dtype=np.int32)

    print(f"  Extracted {len(X_np)} samples across {len(groups_np)} query groups.")

    # Train XGBRanker model
    ranker = xgb.XGBRanker(
        objective='rank:pairwise',
        n_estimators=50,
        max_depth=4,
        learning_rate=0.08,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42
    )

    ranker.fit(X_np, y_np, group=groups_np)

    # Save trained model to disk
    models_dir = os.path.join(os.path.dirname(__file__), 'models')
    os.makedirs(models_dir, exist_ok=True)
    model_path = os.path.join(models_dir, 'xgboost_ltr.json')

    ranker.save_model(model_path)
    print(f"  Successfully saved XGBoost LTR model to: {model_path}")
    print("=" * 60)
    return True

if __name__ == '__main__':
    train_xgboost_ltr_model()
