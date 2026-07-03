# Implementation Plan — UI/UX Component Marketplace with Hybrid Recommendation Engine

**Project Type:** End-Semester Full Stack Development (MERN) + Python (Django) Capstone
**Team Size:** 3
**Package Manager:** npm
**Styling:** Tailwind CSS

---

## 1. Project Overview

An e-commerce platform that sells original UI/UX components (buttons, cards, forms, navbars, modals, etc.) with live previews and downloadable code. A hybrid recommendation engine (content-based + collaborative filtering) suggests related components to shoppers based on tags/category similarity and behavioral data (views, cart adds, purchases).

The system is split into three independently gradable pieces:

| Folder | Owns | Stack |
|---|---|---|
| `client/` | Customer & admin UI | React + Tailwind CSS |
| `server/` | Auth, catalog, cart, checkout, orders, event tracking, admin APIs | Node.js + Express + Mongoose + Nodemailer |
| `recommender/` | Content-based + collaborative + hybrid recommendations | Django + DRF + pandas + scikit-learn + pymongo |

**Golden rule of the architecture:** Node is the only service that **writes** to MongoDB. Django **only reads** from MongoDB (via `pymongo`, read-only credentials if possible). React never calls Django directly — it always goes through Node, which proxies the recommendation request. This keeps one API surface for the frontend and avoids schema-ownership conflicts between Mongoose and pymongo.

```
┌─────────────┐        ┌──────────────────┐        ┌──────────────────────┐
│   client/   │ HTTPS  │     server/      │ HTTPS  │     recommender/     │
│   React     │───────▶│  Node + Express  │───────▶│   Django + DRF       │
│  (Tailwind) │◀───────│  (writes to DB)  │◀───────│  (reads from DB)     │
└─────────────┘        └──────────────────┘        └──────────────────────┘
                                │                              │
                                ▼                              ▼
                         ┌─────────────────────────────────────────┐
                         │              MongoDB                    │
                         │  users | products | orders | interactions│
                         └─────────────────────────────────────────┘
```

---

## 2. Team Role Split (suggested, 3 people)

Since the folder structure maps cleanly to skill areas:

- **Person A — Frontend (`client/`)**: React app, Tailwind UI, all customer + admin panels, API integration.
- **Person B — Backend Core (`server/`)**: Auth (JWT + Nodemailer), catalog CRUD, cart/checkout/orders, event tracking, admin APIs.
- **Person C — Recommender (`recommender/`)**: Django project, content-based + collaborative + hybrid logic, DRF endpoints, data seeding/simulation scripts.

All three should agree on the MongoDB schema (Section 4) **before** writing code — this is the contract between all three subsystems. Keep it in this file so everyone works off the same source of truth.

---

## 3. Full Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), React Router, Tailwind CSS, Axios |
| Core Backend | Node.js, Express, Mongoose, JWT (jsonwebtoken), bcrypt, Nodemailer |
| Recommender Backend | Python, Django, Django REST Framework, pymongo, pandas, scikit-learn |
| Database | MongoDB (single shared instance/Atlas cluster) |
| Dev Tools | npm, dotenv, nodemon, concurrently (optional, to run all 3 at once), Postman/Thunder Client |

---

## 4. MongoDB Data Model (shared contract — read this before coding)

Database name suggestion: `component_marketplace`

### 4.1 `users`
```js
{
  _id: ObjectId,
  name: String,
  email: String,            // unique, indexed
  passwordHash: String,
  role: String,              // "customer" | "admin"
  isVerified: Boolean,       // email verification status
  verificationToken: String, // temp, cleared after verify
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 4.2 `products` (the UI/UX components you sell)
```js
{
  _id: ObjectId,
  name: String,               // e.g. "Glassmorphic Pricing Card"
  category: String,           // "buttons" | "cards" | "forms" | "navbars" | "modals" | ...
  tags: [String],             // e.g. ["glassmorphism", "pricing", "dark-mode"]
  description: String,
  price: Number,
  previewImageUrl: String,
  livePreviewUrl: String,     // link/embed to interactive preview
  codeFileUrl: String,        // downloadable code (zip or file link)
  framework: String,          // "react" | "html-css" | "vue" (optional filter)
  createdBy: ObjectId,        // admin user id
  isActive: Boolean,          // soft delete flag
  createdAt: Date,
  updatedAt: Date
}
```

### 4.3 `orders`
```js
{
  _id: ObjectId,
  userId: ObjectId,
  items: [
    { productId: ObjectId, name: String, price: Number, quantity: Number }
  ],
  totalAmount: Number,
  status: String,             // "pending" | "completed" | "failed"
  createdAt: Date
}
```

### 4.4 `interactions` (the collection the recommender reads — append-only, Node writes, Django reads)
```js
{
  _id: ObjectId,
  userId: ObjectId,
  productId: ObjectId,
  type: String,                // "view" | "cart" | "purchase"
  weight: Number,               // 1 = view, 3 = cart, 5 = purchase (set at write time)
  timestamp: Date
}
```
> Keep this collection append-only. Never update/delete a row — always insert a new event. This makes the collaborative filtering pipeline reproducible and simple to debug.

### 4.5 `carts` (optional — could also be embedded in session/localStorage, but a DB-backed cart is more robust for a graded demo)
```js
{
  _id: ObjectId,
  userId: ObjectId,
  items: [ { productId: ObjectId, quantity: Number } ],
  updatedAt: Date
}
```

---

## 5. `client/` — React Frontend (Tailwind CSS)

### 5.1 Folder Structure
```
client/
├── public/
│   └── favicon.svg
├── src/
│   ├── main.jsx                     # React entry point, mounts <App/>
│   ├── App.jsx                      # Route definitions
│   ├── index.css                    # Tailwind directives + global styles
│   ├── api/
│   │   ├── axiosInstance.js         # Axios base config, attaches JWT header
│   │   ├── authApi.js               # login, register, verifyEmail, resetPassword calls
│   │   ├── productApi.js            # fetch products, search/filter, product detail
│   │   ├── cartApi.js               # add/remove/update cart
│   │   ├── orderApi.js              # checkout, order history
│   │   ├── recommendationApi.js     # GET /api/products/:id/recommendations (via Node proxy)
│   │   └── adminApi.js              # admin CRUD + analytics calls
│   ├── context/
│   │   ├── AuthContext.jsx          # logged-in user, token, login/logout methods
│   │   └── CartContext.jsx          # cart state shared across app
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── ProtectedRoute.jsx   # route guard using AuthContext
│   │   │   └── AdminRoute.jsx       # route guard for role === "admin"
│   │   ├── product/
│   │   │   ├── ProductCard.jsx      # grid item: preview image, name, price
│   │   │   ├── ProductFilterBar.jsx # category/tag/price filters
│   │   │   ├── LivePreviewFrame.jsx # iframe/sandbox rendering live component preview
│   │   │   └── RecommendationCarousel.jsx # "You may also like" strip
│   │   ├── cart/
│   │   │   ├── CartItem.jsx
│   │   │   └── CartSummary.jsx
│   │   └── admin/
│   │       ├── ProductForm.jsx      # create/edit component listing
│   │       ├── ProductTable.jsx
│   │       ├── UserTable.jsx
│   │       └── AnalyticsCards.jsx   # basic revenue/order stat widgets
│   ├── pages/
│   │   ├── HomePage.jsx             # catalog grid + featured/trending
│   │   ├── ProductDetailPage.jsx    # full detail + live preview + recommendations
│   │   ├── SearchResultsPage.jsx
│   │   ├── CartPage.jsx
│   │   ├── CheckoutPage.jsx
│   │   ├── OrderHistoryPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── VerifyEmailPage.jsx      # handles /verify/:token link from email
│   │   ├── ForgotPasswordPage.jsx
│   │   ├── ResetPasswordPage.jsx    # handles /reset-password/:token
│   │   └── admin/
│   │       ├── AdminDashboardPage.jsx
│   │       ├── AdminProductsPage.jsx
│   │       ├── AdminUsersPage.jsx
│   │       └── AdminOrdersPage.jsx
│   ├── hooks/
│   │   ├── useAuth.js               # convenience wrapper over AuthContext
│   │   ├── useCart.js
│   │   └── useTrackInteraction.js   # fires view/cart events to Node on mount/click
│   └── utils/
│       ├── formatCurrency.js
│       └── validators.js            # email/password format checks
├── .env                             # VITE_API_BASE_URL=http://localhost:5000/api
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── vite.config.js
```

### 5.2 Key Frontend Notes
- `useTrackInteraction.js` is important: call it on `ProductDetailPage` mount (type `"view"`), on "Add to Cart" click (type `"cart"`), and on successful checkout per item (type `"purchase"`). This is what feeds the collaborative filter.
- `RecommendationCarousel.jsx` calls Node's `/api/products/:id/recommendations`, **not** Django directly.
- Keep `ProtectedRoute` / `AdminRoute` simple: check `AuthContext` for token + role, redirect to `/login` if missing.

---

## 6. `server/` — Node.js + Express Core Backend

### 6.1 Folder Structure
```
server/
├── src/
│   ├── server.js                    # entry point: connects DB, starts Express app
│   ├── app.js                       # Express app config, middleware, route mounting
│   ├── config/
│   │   ├── db.js                    # Mongoose connection setup
│   │   └── mailer.js                # Nodemailer transporter config
│   ├── models/
│   │   ├── User.js                  # Mongoose schema matching Section 4.1
│   │   ├── Product.js                # Section 4.2
│   │   ├── Order.js                  # Section 4.3
│   │   ├── Interaction.js            # Section 4.4
│   │   └── Cart.js                   # Section 4.5
│   ├── controllers/
│   │   ├── authController.js        # register, login, verifyEmail, forgotPassword, resetPassword
│   │   ├── productController.js     # CRUD, search/filter/pagination
│   │   ├── cartController.js        # add/update/remove items
│   │   ├── orderController.js       # checkout, order history
│   │   ├── interactionController.js # log view/cart/purchase events
│   │   ├── recommendationController.js # proxies to Django, formats response
│   │   └── adminController.js       # user management, revenue/analytics aggregation
│   ├── routes/
│   │   ├── authRoutes.js            # /api/auth/*
│   │   ├── productRoutes.js         # /api/products/*
│   │   ├── cartRoutes.js            # /api/cart/*
│   │   ├── orderRoutes.js           # /api/orders/*
│   │   ├── interactionRoutes.js     # /api/interactions/*
│   │   ├── recommendationRoutes.js  # /api/products/:id/recommendations
│   │   └── adminRoutes.js           # /api/admin/*
│   ├── middleware/
│   │   ├── authMiddleware.js        # verifies JWT, attaches req.user
│   │   ├── adminMiddleware.js       # checks req.user.role === "admin"
│   │   ├── errorHandler.js          # centralized error formatting
│   │   ├── validateRequest.js       # request body validation (e.g. using express-validator)
│   │   └── uploadMiddleware.js      # multer config: disk storage, file type/size limits (Section 6.2)
│   ├── services/
│   │   ├── emailService.js          # builds verification/reset email templates, sends via mailer
│   │   ├── recommenderClient.js     # axios wrapper to call Django DRF endpoints
│   │   └── analyticsService.js      # aggregation pipelines for admin dashboard
│   └── utils/
│       ├── generateToken.js         # JWT sign/verify helpers
│       └── asyncHandler.js          # wraps async route handlers for error catching
├── uploads/                           # Option A file storage — served statically by Express
│   ├── previews/                      # component preview images (png/jpg/webp)
│   └── code/                          # downloadable code bundles (.zip)
├── .env                              # PORT, MONGO_URI, JWT_SECRET, EMAIL_USER, EMAIL_PASS, DJANGO_BASE_URL
├── package.json
└── nodemon.json
```

### 6.2 File Storage Strategy — Option A (Local Disk via Multer)

Product **metadata** (name, price, tags, category) lives in the `products` collection in MongoDB. The **actual files** (preview images, downloadable code zips) are stored on the Node server's local disk, not embedded in MongoDB. MongoDB only stores the URL/path pointing to them.

**How it works end-to-end:**
1. Admin submits `ProductForm.jsx` (React) as `multipart/form-data` — fields (name, category, tags, price) + two files (preview image, code zip).
2. Node route `POST /api/products` is wrapped with `multer` middleware, which saves the incoming files to `server/uploads/previews/` and `server/uploads/code/` with a generated unique filename (e.g. `${Date.now()}-${originalname}`).
3. `app.js` serves that folder statically: `app.use('/uploads', express.static(path.join(__dirname, '../uploads')))`.
4. `productController.js` saves the resulting public paths into the `products` document:
   ```js
   previewImageUrl: `${SERVER_BASE_URL}/uploads/previews/${req.files.preview[0].filename}`,
   codeFileUrl: `${SERVER_BASE_URL}/uploads/code/${req.files.code[0].filename}`
   ```
5. React just uses these URLs directly as `<img src={previewImageUrl} />` and as the `href` on a "Download Code" button.

**New folder (added to `server/` structure below):**
```
server/uploads/
├── previews/     # component screenshot/preview images
└── code/         # downloadable code bundles (.zip)
```

**New dependency:** add `multer` to `server/package.json`.

**New middleware file:** `server/src/middleware/uploadMiddleware.js` — configures `multer.diskStorage()` with destination + filename logic, and file-type/size limits (e.g. images ≤ 5MB, zips ≤ 20MB).

**Git note:** add `server/uploads/` to `.gitignore` (or keep a `.gitkeep` in each subfolder) — uploaded files shouldn't be committed to the repo; only the folder structure should exist so `multer` has somewhere to write on a fresh clone.

**Known limitation (accepted for this project):** this storage is local to the Node server's filesystem. If you later deploy to a host with an ephemeral filesystem (e.g. free-tier Render/Railway), uploaded files can be wiped on redeploy/restart. This is fine for local development and the graded demo; if deployment becomes a real stretch goal, swap `multer`'s disk storage for a Cloudinary/S3 upload in `uploadMiddleware.js` — the rest of the app (schema, controllers, frontend) doesn't need to change since it already just deals with URLs.

### 6.3 Key Backend Notes
- `recommenderClient.js` is the **only** place Node talks to Django. Keep the call simple:
  `GET {DJANGO_BASE_URL}/api/recommend/{productId}/?user_id={userId}`
- `interactionController.js` writes to the `interactions` collection with the weight table from Section 4.4 (view=1, cart=3, purchase=5) baked in at creation time — don't recompute weights later, store them once.
- Email verification flow: on register, generate a token (crypto random or short-lived JWT), store in `verificationToken`, email a link `client/verify/:token` → frontend calls `POST /api/auth/verify/:token` → Node marks `isVerified: true`.
- Password reset: same pattern with `resetPasswordToken` + `resetPasswordExpires` (e.g. 1 hour TTL).

### 6.3 Node REST API Summary

| Method | Route | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Create user, send verification email |
| POST | `/api/auth/verify/:token` | Verify email |
| POST | `/api/auth/login` | Login, return JWT |
| POST | `/api/auth/forgot-password` | Send reset email |
| POST | `/api/auth/reset-password/:token` | Set new password |
| GET | `/api/products` | List with search/filter/pagination |
| GET | `/api/products/:id` | Product detail |
| POST | `/api/products` | (admin) create |
| PUT | `/api/products/:id` | (admin) update |
| DELETE | `/api/products/:id` | (admin) soft delete |
| GET | `/api/products/:id/recommendations` | Proxy to Django hybrid endpoint |
| POST | `/api/interactions` | Log a view/cart/purchase event |
| GET/POST/PUT | `/api/cart` | Cart operations |
| POST | `/api/orders/checkout` | Create order, log purchase interactions |
| GET | `/api/orders/mine` | Order history for logged-in user |
| GET | `/api/admin/users` | List/manage users |
| GET | `/api/admin/orders` | All orders |
| GET | `/api/admin/analytics` | Revenue, top products, order counts |

---

## 7. `recommender/` — Django + DRF Recommendation Microservice

### 7.1 Folder Structure
```
recommender/
├── manage.py
├── requirements.txt                  # django, djangorestframework, pymongo, pandas, scikit-learn, python-dotenv
├── .env                               # MONGO_URI, MONGO_DB_NAME
├── recommender_project/               # Django project config
│   ├── __init__.py
│   ├── settings.py                    # DRF config, CORS (django-cors-headers), env loading
│   ├── urls.py                        # includes recommendations app urls
│   └── wsgi.py / asgi.py
├── recommendations/                   # Django app — the actual logic lives here
│   ├── __init__.py
│   ├── apps.py
│   ├── urls.py                        # /api/recommend/<product_id>/
│   ├── views.py                       # DRF APIView: HybridRecommendationView
│   ├── serializers.py                 # shape of the recommendation response
│   ├── db/
│   │   ├── mongo_client.py            # pymongo connection singleton
│   │   └── data_access.py             # read-only query functions (get_products, get_interactions)
│   ├── engine/
│   │   ├── __init__.py
│   │   ├── content_based.py           # tag/category similarity scoring
│   │   ├── collaborative.py           # builds interaction matrix, cosine similarity
│   │   ├── hybrid.py                  # merges content + collaborative scores
│   │   └── cache.py                   # (optional) simple in-memory cache of similarity matrices, refreshed periodically
│   ├── management/
│   │   └── commands/
│   │       └── simulate_interactions.py  # script to seed synthetic view/cart/purchase events for demo
│   └── tests.py                       # unit tests for content_based/collaborative scoring
└── README.md
```

### 7.2 Recommendation Engine Design (Hybrid)

**Step 1 — Content-based scoring (`content_based.py`)**
- Pull all `products` from MongoDB into a pandas DataFrame via `data_access.get_products()`.
- Build a text feature per product: `category + " " + " ".join(tags)`.
- Vectorize with `TfidfVectorizer` (scikit-learn) across all products.
- Compute cosine similarity between the target product's vector and all others.
- Output: `{ productId: content_score }` for all other products, sorted descending.
- **Works with zero interaction data — this is your day-one fallback.**

**Step 2 — Collaborative filtering (`collaborative.py`)**
- Pull all `interactions` into a DataFrame via `data_access.get_interactions()`.
- Pivot into a user-item matrix: rows = `userId`, columns = `productId`, values = summed `weight` (view=1/cart=3/purchase=5).
- Compute **item-item** cosine similarity: transpose the matrix so rows = products, then `cosine_similarity(item_matrix)`.
- For a given target product, return the most similar products by this item-item similarity — this is your "users who interacted with X also interacted with Y" signal.
- If the target product has no interactions yet (cold start), return an empty dict — the hybrid layer will fall back to pure content-based.

**Step 3 — Hybrid merge (`hybrid.py`)**
```python
def get_hybrid_recommendations(product_id, top_n=6):
    content_scores = get_content_scores(product_id)        # dict productId -> score, normalized 0-1
    collab_scores = get_collaborative_scores(product_id)    # dict productId -> score, normalized 0-1

    if not collab_scores:
        # cold start: no interaction data yet for this product
        final_scores = content_scores
    else:
        final_scores = {}
        all_ids = set(content_scores) | set(collab_scores)
        for pid in all_ids:
            c = content_scores.get(pid, 0)
            col = collab_scores.get(pid, 0)
            final_scores[pid] = 0.5 * c + 0.5 * col   # weighted sum, tune later if time permits

    ranked = sorted(final_scores.items(), key=lambda x: x[1], reverse=True)
    return ranked[:top_n]
```
- Keep both score dicts **normalized to 0–1** before merging (e.g. min-max normalize) so the 0.5/0.5 weighting is meaningful.
- Document this formula explicitly in your report/viva — examiners will ask "why 0.5/0.5" — answer: "simple, explainable weighted hybrid; content-based ensures no cold-start failure, collaborative adds behavioral personalization once data exists."

**Step 4 — API exposure (`views.py`)**
```
GET /api/recommend/<product_id>/?user_id=<optional>&top_n=6
```
Response shape:
```json
{
  "productId": "abc123",
  "recommendations": [
    { "productId": "xyz456", "score": 0.87 },
    { "productId": "def789", "score": 0.75 }
  ]
}
```
Node's `recommendationController.js` takes this list of IDs+scores, fetches full product details from its own `products` collection (name/image/price), and returns the enriched list to React. **Django never needs to return full product objects — just IDs and scores.** This keeps Django's responsibility narrow and avoids duplicating product-formatting logic in two places.

### 7.3 Cold-Start & Demo Data Strategy
- With only 3 real people testing, you will **not** get enough organic interaction data for collaborative filtering to look good in a live demo.
- Use `management/commands/simulate_interactions.py` to generate a few hundred synthetic interaction rows across the 20–40 products, based on plausible personas (e.g. "user who likes dark-mode components," "user who likes forms"). Run this once after seeding products, before your demo/viva.
- This is a completely normal and expected thing to do in an academic ML project — document it in your report as "synthetic interaction data used to bootstrap the collaborative filtering demo due to limited real user volume in a classroom setting."

---

## 8. Environment Variables Summary

**`client/.env`**
```
VITE_API_BASE_URL=http://localhost:5000/api
```

**`server/.env`**
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/component_marketplace
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
EMAIL_USER=your_ethereal_or_mailtrap_user
EMAIL_PASS=your_ethereal_or_mailtrap_pass
CLIENT_URL=http://localhost:5173
DJANGO_BASE_URL=http://localhost:8000
SERVER_BASE_URL=http://localhost:5000
```

**`recommender/.env`**
```
MONGO_URI=mongodb://localhost:27017/component_marketplace
MONGO_DB_NAME=component_marketplace
DJANGO_SECRET_KEY=your_django_secret
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5000
```

---

## 9. Development Workflow

1. **Week 1:** Finalize schema (Section 4) as a team, scaffold all three folders, get Node auth working end-to-end (register → verify email → login).
2. **Week 2:** Catalog CRUD + admin upload (Node + React), seed 20–40 real components.
3. **Week 3:** Cart, checkout, orders, event tracking wired into React (view/cart/purchase → `/api/interactions`).
4. **Week 4:** Django project scaffold, content-based recommender working and returning results via DRF.
5. **Week 5:** Run `simulate_interactions.py`, build collaborative filtering, build hybrid merge, wire Node's `recommendationController.js` proxy, integrate `RecommendationCarousel.jsx` in React.
6. **Week 6:** Admin analytics dashboard, polish UI with Tailwind, bug fixes, prepare demo script and report.
7. **Buffer:** Keep the last few days free for integration bugs (CORS, env mismatches, schema drift between Mongoose and pymongo) — these always take longer than expected.

**Git strategy:** one repo, three top-level folders (`client/`, `server/`, `recommender/`), feature branches per person, PR review before merging to `main`. Add a root `README.md` with setup instructions for all three services.

---

## 10. Must-Have vs Stretch Checklist

**Must-have**
- [ ] JWT auth + email verification + password reset (Node + Nodemailer)
- [ ] Product catalog CRUD + admin upload (20–40 components)
- [ ] Customer browse/search/filter/product detail
- [ ] Cart + checkout + order history
- [ ] Interaction event tracking (view/cart/purchase → MongoDB)
- [ ] Content-based recommendations (Django)
- [ ] Collaborative filtering (Django)
- [ ] Hybrid merge + DRF endpoint
- [ ] Node proxy to Django + React recommendation display
- [ ] Admin dashboard: manage users, view orders/revenue

**Stretch (only after must-haves are solid)**
- [ ] Product reviews/ratings
- [ ] Wishlist
- [ ] Weighted interactions tuning (already partially covered by Section 4.4's weight field — can extend with time-decay)
- [ ] Email notifications on order status change
- [ ] Analytics charts (e.g. Chart.js/Recharts on admin dashboard)
- [ ] Deployment (Vercel/Netlify for client, Render/Railway for server + recommender, MongoDB Atlas)

---

## 11. Open Items / Questions to Resolve as a Team

- Confirm MongoDB hosting: local instance for dev, or shared Atlas cluster from day one so all 3 people/services connect to the same data without syncing dumps?
- Decide on the exact hybrid weighting (0.5/0.5 is the starting default in Section 7.2) — worth a small experiment once collaborative filtering has real+synthetic data.
- Decide how many demo/test user accounts to pre-create for the viva walkthrough (recommend at least 3 personas with distinct interaction histories to show collaborative filtering visibly differs per user).
