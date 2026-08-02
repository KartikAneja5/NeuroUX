# NeuroUX Component Marketplace with Hybrid Recommendation Engine

This repository hosts a multi-service MERN + Django project for buying and selling UI/UX components.

## Project Structure

- `client/`: React + Vite + Tailwind CSS (Customer & admin frontend UI).
- `server/`: Node.js + Express + Mongoose (Auth, catalog CRUD, carts, orders, transactions, and admin APIs).
- `recommender/`: Django + DRF + Pandas + scikit-learn + PyMongo (Content-based, collaborative filtering, and hybrid recommendation engine).

## Quick Start (Development)

Detailed instructions for running each service are in their respective directories.

## Security Configuration & Environment Setup

Before running in development or production, copy `.env.example` files to `.env` in `server/`, `client/`, and `recommender/`.

### Generating a Secure JWT Secret
Never use plain text or hardcoded values for `JWT_SECRET`. Generate a cryptographically secure 256-bit secret key using either OpenSSL or Node.js:

```bash
# Using OpenSSL (recommended)
openssl rand -base64 32

# Or using Node.js crypto module
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy the generated 64-character output into `JWT_SECRET` in `server/.env`.

