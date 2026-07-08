import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from ..db.data_access import get_products, get_interactions

def get_collaborative_scores(product_id):
    # Fetch interactions and products
    df_inter = get_interactions()
    df_prod = get_products()
    
    if df_inter.empty or df_prod.empty:
        return {}
        
    if product_id not in df_prod['_id'].values:
        return {}
        
    if 'userId' not in df_inter.columns or 'productId' not in df_inter.columns or 'weight' not in df_inter.columns:
        return {}
        
    # Aggregate weights for duplicate User-Item interactions
    df_grouped = df_inter.groupby(['userId', 'productId'])['weight'].sum().reset_index()
    
    # Pivot to create User-Item weight matrix
    try:
        user_item_matrix = df_grouped.pivot(index='userId', columns='productId', values='weight').fillna(0)
    except Exception:
        return {}
        
    # If no user has interacted with the target product yet, return empty
    if product_id not in user_item_matrix.columns:
        return {}
        
    # item_user_matrix has products as rows, users as columns
    item_user_matrix = user_item_matrix.T
    
    # Compute Cosine Similarity between items (based on user interaction vectors)
    cosine_sim = cosine_similarity(item_user_matrix)
    
    # Map index to product IDs
    items_list = list(item_user_matrix.index)
    idx = items_list.index(product_id)
    
    scores_dict = {}
    for i, score in enumerate(cosine_sim[idx]):
        prod_id = items_list[i]
        scores_dict[prod_id] = float(score)
        
    return scores_dict
