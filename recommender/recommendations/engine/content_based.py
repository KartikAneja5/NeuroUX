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
    
    # Clean and join tags with 3x weighting
    def process_tags(val):
        if isinstance(val, list):
            return ' '.join(val)
        return str(val) if pd.notna(val) else ''
    df['processed_tags'] = df['tags'].apply(process_tags)
    
    # Create combined text profile with 3x Tag Weighting
    df['text_profile'] = (
        df['name'] + ' ' + 
        df['category'] + ' ' + 
        df['description'] + ' ' + 
        ((df['processed_tags'] + ' ') * 3)
    )
    
    # Tfidf Vectorization
    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(df['text_profile'])
    
    # Compute Cosine Similarity
    cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
    
    # Get index of target product
    idx = df[df['_id'] == product_id].index[0]
    target_tags = df.iloc[idx].get('tags', [])
    if isinstance(target_tags, str):
        target_tags = target_tags.split()

    # Build dictionary matching product IDs to their content similarity scores
    scores_dict = {}
    for i, score in enumerate(cosine_sim[idx]):
        prod_id = df.iloc[i]['_id']
        comp_tags = df.iloc[i].get('tags', [])
        if isinstance(comp_tags, str):
            comp_tags = comp_tags.split()

        # Compute Tag Jaccard Similarity
        s1 = set(target_tags) if target_tags else set()
        s2 = set(comp_tags) if comp_tags else set()
        jaccard = (len(s1.intersection(s2)) / float(len(s1.union(s2)))) if (s1 and s2 and len(s1.union(s2)) > 0) else 0.0

        # Weighted blend: 65% Tag-Boosted TFIDF + 35% Jaccard Tag Overlap
        combined_score = 0.65 * float(score) + 0.35 * jaccard
        scores_dict[prod_id] = round(combined_score, 4)
        
    return scores_dict
