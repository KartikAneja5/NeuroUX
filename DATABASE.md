# 🗄️ NeuroUX MongoDB Indexing Strategy & Schema Guide

This document outlines the database indexing strategy, schema organization, and query optimization design implemented in MongoDB for NeuroUX.

---

## 📌 Indexing Strategy Overview

Indexes speed up read queries by allowing MongoDB to locate documents without performing an expensive full collection scan ($O(N) \to O(\log N)$).

| Collection | Indexed Field(s) | Index Type | Business / Viva Rationale |
| :--- | :--- | :--- | :--- |
| **`products`** | `category` | Single Field Ascending (`1`) | Optimizes category filtering on marketplace catalog queries (`/api/products?category=...`). |
| **`products`** | `category`, `price` | Compound Index (`{ category: 1, price: 1 }`) | Optimizes combined category filtering and price range queries (`minPrice`/`maxPrice`). |
| **`products`** | `tags` | Multikey Index (`1`) | Accelerates tag-based candidate generation during Stage 1 recommendation retrieval. |
| **`products`** | `name`, `description`, `tags` | Compound Text Index (`text`) | Powers full-text keyword search on the `/search` marketplace page. |
| **`interactions`** | `userId` | Single Field Ascending (`1`) | Heavily queried by PyMongo in Django recommender to extract user history. |
| **`interactions`** | `productId` | Single Field Ascending (`1`) | Speeds up item co-occurrence matrices and item-based popularity metrics. |
| **`interactions`** | `sessionToken` | Single Field Ascending (`1`) | Supports non-logged-in guest session behavioral tracking. |
| **`interactions`** | `userId`, `timestamp` | Compound Index (`{ userId: 1, timestamp: -1 }`) | Fast retrieval of user's most recent interaction logs in reverse chronological order. |
| **`users`** | `email` | Unique Index (`unique: true`) | Enforces unique email constraint and provides $O(1)$ login lookup by email address. |
| **`orders`** | `userId` | Single Field Ascending (`1`) | Optimizes `/api/orders/myorders` customer order history lookups. |
| **`orders`** | `userId`, `createdAt` | Compound Index (`{ userId: 1, createdAt: -1 }`) | Renders recent customer purchases quickly on customer dashboard. |

---

## 🎯 Compound Index Field Ordering (ESR Rule Rationale)

In MongoDB compound index design, field sequence follows the **ESR (Equality, Sort, Range) Rule**:

1. **Equality Fields First (`category`)**: Exact match filters (`{ category: "Basic UI Components" }`) partition index keys into narrow, contiguous index buckets.
2. **Range Fields Second (`price`)**: Range operators (`$gte`, `$lte`) filter keys within the pre-sorted contiguous category bucket.

**Viva Explanation**: Placing `category` (equality) before `price` (range) allows MongoDB to instantly jump to the exact category sub-tree without scanning index entries for other categories. If `price` were placed first, MongoDB would have to scan all products within the price range across every category, defeating index efficiency.

---

## 🏗️ Reference vs. Embedding Schema Decisions (`Order` vs. `Cart`)

| Entity Model | Design Choice | Implementation Shape | Plain-Language Rationale |
| :--- | :--- | :--- | :--- |
| **`Order.items`** | **Embedded Snapshot + Reference** | `{ productId, name, price, quantity }` | **Historical Immutability**: Orders represent financial transaction contracts. Storing a snapshot of `name` and `price` at purchase time ensures historical invoices remain accurate even if the seller later updates the product price or title in the catalog. |
| **`Cart.items`** | **Dynamic Reference Only** | `{ productId, quantity, source }` | **Live Catalog Pricing**: Shopping carts represent uncommitted intent. Referencing `productId` dynamically ensures the user is billed the current live marketplace price when converting to checkout, automatically reflecting any catalog price updates or seller discounts. |

---

## ⚡ Index Verification Script


To inspect active indexes on a running MongoDB database instance, run the following Node.js script:

```javascript
const mongoose = require('mongoose');
require('dotenv').config();

async function checkIndexes() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/NeuroUX');
  
  const collections = ['users', 'products', 'interactions', 'orders'];
  for (const name of collections) {
    const indexes = await mongoose.connection.db.collection(name).indexes();
    console.log(`\n=== Indexes for ${name} ===`);
    console.dir(indexes, { depth: null });
  }
  
  await mongoose.disconnect();
}

checkIndexes();
```
