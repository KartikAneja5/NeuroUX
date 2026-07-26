# Implementation Plan - Two-Stage E-Commerce XGBoost Learning-to-Rank Engine

Upgrade the NeuroUX Recommendation System to an **industry-grade Two-Stage E-Commerce Recommendation Engine** using **XGBoost `XGBRanker`** trained on real user conversion data (`view`, `cart`, `purchase`).

---

## User Review Required

> [!IMPORTANT]
> **Production E-Commerce Architecture**:
> 1. **Stage 1 (Candidate Retrieval)**: Fast retrieval of top 20 candidate components using 3x Tag-Weighted TF-IDF & Category Affinity.
> 2. **Stage 2 (XGBoost LTR Ranking)**: Uses `XGBRanker` (pairwise gradient-boosted decision trees) to score candidate items based on predicted purchase conversion probability $P(\text{Buy})$.
> 3. **10-Dimensional ML Feature Vector**: Includes tag similarity, user affinity, category co-occurrence, price sensitivity, ratings, interaction recency, and complementary category indicators.

---

## Proposed Changes

### Recommender Service (Django ML Stack)

#### [MODIFY] [requirements.txt](file:///c:/kartik/Clg%20Project%20%20%28Tech%29/python%20sem%204/nuroUx/recommender/requirements.txt)
- Add `xgboost` dependency.

#### [NEW] [feature_extractor.py](file:///c:/kartik/Clg%20Project%20%20%28Tech%29/python%20sem%204/nuroUx/recommender/recommendations/engine/feature_extractor.py)
- Build 10-dimensional feature extraction pipeline for `(User, CandidateItem)` pairs.

#### [NEW] [train_ltr.py](file:///c:/kartik/Clg%20Project%20%20%28Tech%29/python%20sem%204/nuroUx/recommender/recommendations/engine/train_ltr.py)
- Build automated ML training pipeline that trains `XGBRanker` on MongoDB interaction logs and exports `xgboost_ltr.json`.

#### [NEW] [ltr_engine.py](file:///c:/kartik/Clg%20Project%20%20%28Tech%29/python%20sem%204/nuroUx/recommender/recommendations/engine/ltr_engine.py)
- Build Two-Stage Inference engine (Retrieval + XGBoost LTR scoring with fallback).

#### [MODIFY] [hybrid.py](file:///c:/kartik/Clg%20Project%20%20%28Tech%29/python%20sem%204/nuroUx/recommender/recommendations/engine/hybrid.py)
- Integrate Two-Stage XGBoost LTR engine into `get_hybrid_recommendations`.

---

## Verification Plan

### Automated Tests
- Run `train_ltr.py` to train the XGBoost LTR model on MongoDB Atlas data and generate `xgboost_ltr.json`.
- Run `scratch/test_upgraded_recommender.py` to verify Two-Stage LTR predictions and XAI output.
- Run `master_system_audit.py` to verify full-stack system health.

### Manual Verification
- Verify `http://localhost:5173/marketplace` and product details pages to confirm LTR recommendation ranking and XAI badges.
