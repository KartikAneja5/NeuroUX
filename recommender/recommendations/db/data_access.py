import pandas as pd
from bson import ObjectId
from .mongo_client import MongoClientSingleton

def get_products():
    db = MongoClientSingleton.get_db()
    products = list(db.products.find({"isActive": True}))
    if not products:
        return pd.DataFrame()
    df = pd.DataFrame(products)
    df['_id'] = df['_id'].astype(str)
    return df

def get_interactions():
    db = MongoClientSingleton.get_db()
    interactions = list(db.interactions.find())
    if not interactions:
        return pd.DataFrame()
    df = pd.DataFrame(interactions)
    df['_id'] = df['_id'].astype(str)
    df['productId'] = df['productId'].astype(str)
    if 'userId' in df.columns:
        df['userId'] = df['userId'].astype(str)
    return df

def get_behavioral_signals(user_id=None, session_token=None):
    # Guard: if no identity is provided, return empty list immediately.
    # Without this check, an empty query {} would match ALL behavioral signals,
    # causing anonymous guests to appear as warm users (false isColdStart=False).
    if not user_id and not session_token:
        return []

    db = MongoClientSingleton.get_db()
    query = {}
    if user_id:
        try:
            query['$or'] = [{'userId': ObjectId(user_id)}, {'userId': str(user_id)}]
        except Exception:
            query['userId'] = str(user_id)
    elif session_token:
        query['sessionToken'] = str(session_token)

    signals = list(db.behavioralsignals.find(query))
    return signals
