import datetime
import random
from bson import ObjectId
from django.core.management.base import BaseCommand
from ...db.mongo_client import MongoClientSingleton

class Command(BaseCommand):
    help = 'Simulates realistic user interaction data to seed MongoDB'

    def handle(self, *args, **options):
        db = MongoClientSingleton.get_db()
        self.stdout.write("Connecting to MongoDB...")

        # 1. Ensure we have products to work with
        products = list(db.products.find({"isActive": True}))
        if not products:
            self.stdout.write("No products found in DB. Seeding initial products...")
            # Let's seed some realistic products if database is empty
            mock_products = [
                # Text Animations
                {
                    "_id": ObjectId(),
                    "name": "Split Text",
                    "category": "Text Animations",
                    "tags": ["text", "framer-motion", "split", "letters"],
                    "description": "Animate text split by letters or words with customized delay.",
                    "price": 12.00,
                    "previewImageUrl": "http://localhost:5000/uploads/previews/split-text.png",
                    "livePreviewUrl": "#",
                    "codeFileUrl": "http://localhost:5000/uploads/code/split-text.zip",
                    "framework": "react",
                    "isActive": True,
                    "createdAt": datetime.datetime.now(),
                    "updatedAt": datetime.datetime.now()
                },
                {
                    "_id": ObjectId(),
                    "name": "Blur Text",
                    "category": "Text Animations",
                    "tags": ["text", "blur", "reveal", "cinematic"],
                    "description": "Cinematic text reveal effect where letters fade in and sharpen.",
                    "price": 15.00,
                    "previewImageUrl": "http://localhost:5000/uploads/previews/blur-text.png",
                    "livePreviewUrl": "#",
                    "codeFileUrl": "http://localhost:5000/uploads/code/blur-text.zip",
                    "framework": "react",
                    "isActive": True,
                    "createdAt": datetime.datetime.now(),
                    "updatedAt": datetime.datetime.now()
                },
                {
                    "_id": ObjectId(),
                    "name": "Shiny Text",
                    "category": "Text Animations",
                    "tags": ["text", "shimmer", "gradient", "css-mask"],
                    "description": "Apply a sweeping shiny metallic gradient overlay to text.",
                    "price": 9.00,
                    "previewImageUrl": "http://localhost:5000/uploads/previews/shiny-text.png",
                    "livePreviewUrl": "#",
                    "codeFileUrl": "http://localhost:5000/uploads/code/shiny-text.zip",
                    "framework": "react",
                    "isActive": True,
                    "createdAt": datetime.datetime.now(),
                    "updatedAt": datetime.datetime.now()
                },
                # Animations
                {
                    "_id": ObjectId(),
                    "name": "Electric Border",
                    "category": "Animations",
                    "tags": ["animation", "border", "glow", "svg"],
                    "description": "Border animation where a laser-like electrical spark circles around.",
                    "price": 24.00,
                    "previewImageUrl": "http://localhost:5000/uploads/previews/electric-border.png",
                    "livePreviewUrl": "#",
                    "codeFileUrl": "http://localhost:5000/uploads/code/electric-border.zip",
                    "framework": "react",
                    "isActive": True,
                    "createdAt": datetime.datetime.now(),
                    "updatedAt": datetime.datetime.now()
                },
                {
                    "_id": ObjectId(),
                    "name": "Orbit Images",
                    "category": "Animations",
                    "tags": ["animation", "orbit", "rotate", "gallery"],
                    "description": "An interactive circular orbit display where multiple images float.",
                    "price": 26.00,
                    "previewImageUrl": "http://localhost:5000/uploads/previews/orbit-images.png",
                    "livePreviewUrl": "#",
                    "codeFileUrl": "http://localhost:5000/uploads/code/orbit-images.zip",
                    "framework": "react",
                    "isActive": True,
                    "createdAt": datetime.datetime.now(),
                    "updatedAt": datetime.datetime.now()
                },
                # Components
                {
                    "_id": ObjectId(),
                    "name": "Magic Bento Grid",
                    "category": "Components",
                    "tags": ["component", "bento", "grid", "layout"],
                    "description": "Fully responsive Bento grid featuring mouse-follow glowing tiles.",
                    "price": 35.00,
                    "previewImageUrl": "http://localhost:5000/uploads/previews/magic-bento.png",
                    "livePreviewUrl": "#",
                    "codeFileUrl": "http://localhost:5000/uploads/code/magic-bento.zip",
                    "framework": "react",
                    "isActive": True,
                    "createdAt": datetime.datetime.now(),
                    "updatedAt": datetime.datetime.now()
                },
                {
                    "_id": ObjectId(),
                    "name": "Spotlight Card",
                    "category": "Components",
                    "tags": ["component", "card", "spotlight", "mouse-glow"],
                    "description": "Card layout that illuminates borders and backgrounds relative to mouse.",
                    "price": 14.00,
                    "previewImageUrl": "http://localhost:5000/uploads/previews/spotlight-card.png",
                    "livePreviewUrl": "#",
                    "codeFileUrl": "http://localhost:5000/uploads/code/spotlight-card.zip",
                    "framework": "react",
                    "isActive": True,
                    "createdAt": datetime.datetime.now(),
                    "updatedAt": datetime.datetime.now()
                },
                {
                    "_id": ObjectId(),
                    "name": "macOS Dock",
                    "category": "Components",
                    "tags": ["component", "dock", "macos", "magnification"],
                    "description": "macOS-inspired navigation bar with interactive magnification scaling.",
                    "price": 19.00,
                    "previewImageUrl": "http://localhost:5000/uploads/previews/macos-dock.png",
                    "livePreviewUrl": "#",
                    "codeFileUrl": "http://localhost:5000/uploads/code/macos-dock.zip",
                    "framework": "react",
                    "isActive": True,
                    "createdAt": datetime.datetime.now(),
                    "updatedAt": datetime.datetime.now()
                }
            ]
            db.products.insert_many(mock_products)
            products = list(db.products.find({"isActive": True}))
            self.stdout.write(self.style.SUCCESS(f"Seeded {len(products)} products successfully."))

        # 2. Ensure we have users to work with
        users = list(db.users.find())
        if not users:
            self.stdout.write("No users found in DB. Seeding initial users...")
            mock_users = [
                {
                    "_id": ObjectId(),
                    "name": "Alice (Text Lover)",
                    "email": "alice@example.com",
                    "passwordHash": "$2b$10$xyz",
                    "role": "customer",
                    "isVerified": True,
                    "createdAt": datetime.datetime.now(),
                    "updatedAt": datetime.datetime.now()
                },
                {
                    "_id": ObjectId(),
                    "name": "Bob (Animation Fan)",
                    "email": "bob@example.com",
                    "passwordHash": "$2b$10$xyz",
                    "role": "customer",
                    "isVerified": True,
                    "createdAt": datetime.datetime.now(),
                    "updatedAt": datetime.datetime.now()
                },
                {
                    "_id": ObjectId(),
                    "name": "Charlie (Bento Geek)",
                    "email": "charlie@example.com",
                    "passwordHash": "$2b$10$xyz",
                    "role": "customer",
                    "isVerified": True,
                    "createdAt": datetime.datetime.now(),
                    "updatedAt": datetime.datetime.now()
                },
                {
                    "_id": ObjectId(),
                    "name": "Diana (Collector)",
                    "email": "diana@example.com",
                    "passwordHash": "$2b$10$xyz",
                    "role": "customer",
                    "isVerified": True,
                    "createdAt": datetime.datetime.now(),
                    "updatedAt": datetime.datetime.now()
                },
                {
                    "_id": ObjectId(),
                    "name": "Evan (Tester)",
                    "email": "evan@example.com",
                    "passwordHash": "$2b$10$xyz",
                    "role": "customer",
                    "isVerified": True,
                    "createdAt": datetime.datetime.now(),
                    "updatedAt": datetime.datetime.now()
                }
            ]
            db.users.insert_many(mock_users)
            users = list(db.users.find())
            self.stdout.write(self.style.SUCCESS(f"Seeded {len(users)} users successfully."))

        # 3. Clear existing interactions to prevent duplication and schema issues
        db.interactions.delete_many({})
        self.stdout.write("Cleared existing user interactions.")

        # 4. Generate interactions based on personas to ensure collaborative filtering is testable
        # Persona preferences mapping: user -> list of target categories/tags
        # Alice loves "Text Animations"
        # Bob loves "Animations"
        # Charlie loves "Components"
        # Diana buys anything
        # Evan randomly browses everything
        
        interactions_to_insert = []
        now = datetime.datetime.now()

        def add_interaction(user_id, prod_id, interaction_type, weight, offset_days):
            interactions_to_insert.append({
                "_id": ObjectId(),
                "userId": user_id,
                "productId": prod_id,
                "type": interaction_type,
                "weight": weight,
                "timestamp": now - datetime.timedelta(days=offset_days, minutes=random.randint(0, 1440))
            })

        for user in users:
            email = user['email']
            user_id = user['_id']

            for prod in products:
                prod_id = prod['_id']
                category = prod['category']
                tags = prod['tags']

                # Probability weights based on user personas
                view_prob = 0.1
                cart_prob = 0.05
                buy_prob = 0.01

                if email == "alice@example.com" and category == "Text Animations":
                    view_prob, cart_prob, buy_prob = 0.9, 0.7, 0.5
                elif email == "bob@example.com" and category == "Animations":
                    view_prob, cart_prob, buy_prob = 0.9, 0.6, 0.4
                elif email == "charlie@example.com" and category == "Components":
                    view_prob, cart_prob, buy_prob = 0.9, 0.7, 0.5
                elif email == "diana@example.com":
                    view_prob, cart_prob, buy_prob = 0.8, 0.5, 0.4
                elif email == "evan@example.com":
                    # Random noise
                    view_prob, cart_prob, buy_prob = 0.4, 0.2, 0.05

                # Generate view
                if random.random() < view_prob:
                    add_interaction(user_id, prod_id, "view", 1, random.randint(1, 10))
                    
                    # Generate cart add
                    if random.random() < cart_prob:
                        add_interaction(user_id, prod_id, "cart", 3, random.randint(1, 7))
                        
                        # Generate purchase
                        if random.random() < buy_prob:
                            add_interaction(user_id, prod_id, "purchase", 5, random.randint(1, 5))

        if interactions_to_insert:
            db.interactions.insert_many(interactions_to_insert)
            self.stdout.write(self.style.SUCCESS(f"Successfully simulated and seeded {len(interactions_to_insert)} interactions."))
        else:
            self.stdout.write(self.style.WARNING("No interactions were generated."))
