import datetime
import random
from bson import ObjectId
from django.core.management.base import BaseCommand
from ...db.mongo_client import MongoClientSingleton
from ...db.data_access import get_products

class Command(BaseCommand):
    help = 'Seeds simulated completed orders split across A/B variants for demonstration and significance testing.'

    def handle(self, *args, **options):
        # Seeding simulated A/B order data for demonstration purposes.
        self.stdout.write("[SEED DEMO DATA] Seeding simulated A/B order data for demonstration purposes...")
        db = MongoClientSingleton.get_db()

        products = list(db.products.find({"isActive": True}))
        if not products:
            self.stdout.write(self.style.ERROR("No products found in database. Run simulate_interactions first."))
            return

        users = list(db.users.find())
        if not users:
            # Fallback user if empty
            user_id = ObjectId()
        else:
            user_id = users[0]['_id']

        # Clear existing orders to ensure a clean demo benchmark
        db.orders.delete_many({})

        # Generate realistic order distribution across variant_A and variant_B
        # Variant A: ~45 completed orders (Control group conversion)
        # Variant B: ~68 completed orders (Treatment group with LTR recommendations)
        orders_to_insert = []
        now = datetime.datetime.now()

        # Variant A orders (45 orders)
        for i in range(45):
            prod = random.choice(products)
            price = float(prod.get('price', 499.0))
            qty = random.choice([1, 1, 2])
            orders_to_insert.append({
                "_id": ObjectId(),
                "userId": user_id,
                "items": [{
                    "productId": prod['_id'],
                    "name": prod.get('name', 'UI Component'),
                    "price": price,
                    "quantity": qty
                }],
                "totalAmount": price * qty,
                "abVariant": "variant_A",
                "status": "completed",
                "createdAt": now - datetime.timedelta(days=random.randint(1, 14), hours=random.randint(0, 23)),
                "updatedAt": now
            })

        # Variant B orders (68 orders - showing higher conversion impact of AI recommendations)
        for i in range(68):
            prod = random.choice(products)
            price = float(prod.get('price', 499.0))
            qty = random.choice([1, 1, 2])
            orders_to_insert.append({
                "_id": ObjectId(),
                "userId": user_id,
                "items": [{
                    "productId": prod['_id'],
                    "name": prod.get('name', 'UI Component'),
                    "price": price,
                    "quantity": qty
                }],
                "totalAmount": price * qty,
                "abVariant": "variant_B",
                "status": "completed",
                "createdAt": now - datetime.timedelta(days=random.randint(1, 14), hours=random.randint(0, 23)),
                "updatedAt": now
            })

        db.orders.insert_many(orders_to_insert)
        self.stdout.write(self.style.SUCCESS(
            f"[SEED DEMO DATA] Successfully seeded {len(orders_to_insert)} orders (45 variant_A, 68 variant_B)."
        ))
