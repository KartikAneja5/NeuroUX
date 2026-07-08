import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from ..db.data_access import get_products

def get_content_scores(product_id):
    # Fetch all active products
    df = get_products()
    if df.empty:
        return {}
    
    # Verify product_id exists in active catalog
    if product_id not in df['_id'].values:
        return {}
    
    # Process text columns: fill NaNs with empty string
    df['name'] = df['name'].fillna('')
    df['category'] = df['category'].fillna('')
    df['description'] = df['description'].fillna('')
    
    # Clean and join tags
    def process_tags(val):
        if isinstance(val, list):
            return ' '.join(val)
        return str(val) if pd.notna(val) else ''
    df['processed_tags'] = df['tags'].apply(process_tags)
    
    # Create combined text profile
    df['text_profile'] = (
        df['name'] + ' ' + 
        df['category'] + ' ' + 
        df['description'] + ' ' + 
        df['processed_tags']
    )
    
    # Tfidf Vectorization
    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(df['text_profile'])
    
    # Compute Cosine Similarity
    cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
    
    # Get index of target product
    idx = df[df['_id'] == product_id].index[0]
    
    # Build dictionary matching product IDs to their content similarity scores
    scores_dict = {}
    for i, score in enumerate(cosine_sim[idx]):
        prod_id = df.iloc[i]['_id']
        scores_dict[prod_id] = float(score)
        
    return scores_dict
