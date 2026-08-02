# 🗄️ NeuroUX MongoDB Indexing Strategy & Schema Guide

This document outlines the database indexing strategy, schema organization, and query optimization design implemented in MongoDB for NeuroUX.

---

## 📌 Indexing Strategy Overview

Indexes speed up read queries by allowing MongoDB to locate documents without performing an expensive full collection scan ($O(N) \to O(\log N)$).

| Collection | Indexed Field(s) | Index Type | Business / Viva Rationale |
| :--- | :--- | :--- | :--- |
| **`products`** | `category` | Single Field Ascending (`1`) | Optimizes category filtering on marketplace catalog queries (`/api/products?category=...`). |
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
