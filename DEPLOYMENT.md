# NeuroUX — Deployment Guide

## Architecture Summary (Deployed)

```
React (Vercel) → Node.js (Render) → Django (Render) → MongoDB (Atlas)
```

---

## Step 1: MongoDB Atlas Setup

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com) and create a free cluster.
2. Under **Database Access**, create a user with `readWriteAnyDatabase` permissions.
3. Under **Network Access**, add `0.0.0.0/0` (allow all IPs, required for Render).
4. Click **Connect** → **Drivers** → copy the connection string. Replace `<password>` with your DB user password.
   ```
   mongodb+srv://admin:<password>@<cluster>.mongodb.net/NeuroUX?retryWrites=true&w=majority
   ```

---

## Step 2: Deploy Node.js Server to Render

1. Push your repo to GitHub.
2. Go to [https://render.com](https://render.com) → **New Web Service**.
3. Select your repo and set:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
4. Add Environment Variables (from `server/.env.example`):
   | Key | Value |
   |-----|-------|
   | `PORT` | `5000` |
   | `MONGO_URI` | *(your Atlas connection string)* |
   | `JWT_SECRET` | *(generate a 64-char random string)* |
   | `JWT_EXPIRES_IN` | `7d` |
   | `EMAIL_HOST` | `smtp.sendgrid.net` |
   | `EMAIL_USER` | `apikey` |
   | `EMAIL_PASS` | *(SendGrid API key)* |
   | `CLIENT_URL` | *(your Vercel URL)* |
   | `DJANGO_BASE_URL` | *(your recommender Render URL)* |
   | `SERVER_BASE_URL` | *(this Render URL)* |
   | `NODE_ENV` | `production` |
5. Deploy. Copy the Render URL (e.g. `https://neuroux-server.onrender.com`).

---

## Step 3: Deploy Django Recommender to Render

1. Go to Render → **New Web Service**.
2. Set:
   - **Root Directory**: `recommender`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn recommender_project.wsgi:application --bind 0.0.0.0:$PORT`
3. Add Environment Variables (from `recommender/.env.example`):
   | Key | Value |
   |-----|-------|
   | `MONGO_URI` | *(your Atlas connection string)* |
   | `DJANGO_ALLOWED_HOSTS` | `<your-recommender>.onrender.com` |
4. In `recommender_project/settings.py`, update `ALLOWED_HOSTS`:
   ```python
   ALLOWED_HOSTS = os.environ.get('DJANGO_ALLOWED_HOSTS', 'localhost').split(',')
   ```
5. Add `gunicorn` to `requirements.txt`.
6. Deploy. Copy the Render URL.

---

## Step 4: Deploy React Client to Vercel

1. Go to [https://vercel.com](https://vercel.com) → **New Project** → import your repo.
2. Set:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
3. Add Environment Variables:
   | Key | Value |
   |-----|-------|
   | `VITE_API_BASE_URL` | *(your Node Render URL + `/api`)* |
4. Update `client/src/api/axiosInstance.js` to use `import.meta.env.VITE_API_BASE_URL` as the base URL.
5. Deploy.

---

## Step 5: Seed Production Database

SSH into your Render Node service (or run locally with `MONGO_URI` pointed at Atlas):
```bash
node src/seed.js
```

Seed Django interactions:
```bash
python manage.py simulate_interactions
python manage.py generate_site_insights
python manage.py warm_cache
```

---

## Step 6: Update CORS

In `server/src/app.js`, update CORS to allow your Vercel domain:
```js
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
```

---

## 🔄 Retraining Schedule & Automated Pipeline (Planned)

To maintain high recommendation quality as new user interaction logs accrue, the Machine Learning LTR model should be retrained periodically.

### Automated Retraining Workflow

```
+--------------------------------------------------------------------+
| ⏰ Scheduled Trigger (Daily Cron / Celery Beat at 02:00 UTC)        |
+--------------------------------------------------------------------+
                                  |
                                  v
+--------------------------------------------------------------------+
| 📥 1. Extract Interaction Logs & Seed Features from MongoDB        |
+--------------------------------------------------------------------+
                                  |
                                  v
+--------------------------------------------------------------------+
| 📊 2. Train XGBRanker & Compute Held-Out NDCG@5 Evaluation Metric  |
+--------------------------------------------------------------------+
                                  |
                                  v
+--------------------------------------------------------------------+
| 💾 3. Save Timestamped Artifact (xgboost_ltr_YYYYMMDD_HHMMSS.json) |
+--------------------------------------------------------------------+
                                  |
                                  v
+--------------------------------------------------------------------+
| 🧪 4. Run Inference Sanity Check (predict) on Test Sample          |
+--------------------------------------------------------------------+
                                  |
               +------------------+------------------+
               | (Sanity Pass)                       | (Sanity Fail)
               v                                     v
+-----------------------------+       +-----------------------------+
| 🟢 Atomic Promotion to       |       | 🔴 Reject Retrained Artifact|
| xgboost_ltr.json (No Downtime) |       | (Active Model Preserved)    |
+-----------------------------+       +-----------------------------+
```

### Setup Options

#### Option A: Linux Cron Job (Render / VPS)
Add a crontab entry to execute `train_ltr.py` every night at 2:00 AM UTC:
```bash
0 2 * * * cd /app/recommender && /app/recommender/.venv/bin/python recommendations/engine/train_ltr.py >> /var/log/ltr_retrain.log 2>&1
```

#### Option B: Celery Beat Scheduled Task
In `recommender_project/celery.py`:
```python
from celery.schedules import crontab

app.conf.beat_schedule = {
    'retrain-xgboost-ltr-daily': {
        'task': 'recommendations.tasks.retrain_ltr_task',
        'schedule': crontab(hour=2, minute=0),
    },
}
```

---

## What's Stubbed for Demo (Declare at Viva)

| Feature | Demo Stub / Simulated Implementation | Production Path |
|---------|--------------------------------------|-----------------|
| Email verification | Link printed to server console (Ethereal SMTP) | Replace with SendGrid / AWS SES |
| Payment Gateway | Simulated payment verification flow (`paymentController.js`) | Full Razorpay / Stripe Webhook signature verification |
| Recommendation cache | In-memory, 5-min TTL, resets on restart | Redis |
| Site insights | Generated on-demand via management command | Celery beat / cron job |
| A/B Test significance | 50/50 split, no significance test | VWO / Optimizely |
