import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from ..db.data_access import get_products

def _clean_tags_set(val):
    if not val:
        return set()
    if isinstance(val, list):
        return {str(t).lower().strip() for t in val if t and str(t).strip()}
    if isinstance(val, str):
        return {t.lower().strip() for t in val.split() if t.strip()}
    return set()

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
        tags_set = _clean_tags_set(val)
        return ' '.join(tags_set)
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
    target_tags = _clean_tags_set(df.iloc[idx].get('tags'))

    # Build dictionary matching product IDs to their content similarity scores
    scores_dict = {}
    for i, score in enumerate(cosine_sim[idx]):
        prod_id = df.iloc[i]['_id']
        comp_tags = _clean_tags_set(df.iloc[i].get('tags'))

        # Compute Tag Jaccard Similarity
        jaccard = (len(target_tags.intersection(comp_tags)) / float(len(target_tags.union(comp_tags)))) if (target_tags and comp_tags and len(target_tags.union(comp_tags)) > 0) else 0.0

        # Weighted blend: 65% Tag-Boosted TFIDF + 35% Jaccard Tag Overlap
        combined_score = 0.65 * float(score) + 0.35 * jaccard
        scores_dict[prod_id] = round(combined_score, 4)
        
    return scores_dict
