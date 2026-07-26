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

def get_user_purchased_product_ids(user_id=None, session_token=None):
    if not user_id and not session_token:
        return set()

    db = MongoClientSingleton.get_db()
    purchased_ids = set()

    # 1. Query orders collection for completed orders
    order_query = {'status': 'completed'}
    if user_id:
        try:
            order_query['$or'] = [{'userId': ObjectId(user_id)}, {'userId': str(user_id)}]
        except Exception:
            order_query['userId'] = str(user_id)

    if order_query:
        orders = list(db.orders.find(order_query, {"items": 1}))
        for order in orders:
            for item in order.get("items", []):
                p_id = item.get("productId") or item.get("id")
                if p_id:
                    purchased_ids.add(str(p_id))

    # 2. Query interactions collection for type=='purchase'
    int_query = {'type': 'purchase'}
    if user_id:
        try:
            int_query['$or'] = [{'userId': ObjectId(user_id)}, {'userId': str(user_id)}]
        except Exception:
            int_query['userId'] = str(user_id)
    elif session_token:
        int_query['sessionToken'] = str(session_token)

    interactions = list(db.interactions.find(int_query, {"productId": 1}))
    for int_doc in interactions:
        p_id = int_doc.get("productId")
        if p_id:
            purchased_ids.add(str(p_id))

    return purchased_ids
