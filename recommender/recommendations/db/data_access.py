import pandas as pd
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
