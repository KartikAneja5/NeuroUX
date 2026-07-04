# NeuroUX Component Marketplace with Hybrid Recommendation Engine

This repository hosts a multi-service MERN + Django project for buying and selling UI/UX components.

## Project Structure

- `client/`: React + Vite + Tailwind CSS (Customer & admin frontend UI).
- `server/`: Node.js + Express + Mongoose (Auth, catalog CRUD, carts, orders, transactions, and admin APIs).
- `recommender/`: Django + DRF + Pandas + scikit-learn + PyMongo (Content-based, collaborative filtering, and hybrid recommendation engine).

## Quick Start (Development)

Detailed instructions for running each service are in their respective directories.

1. **Database:** Ensure MongoDB is running locally on `mongodb://localhost:27017/NeuroUX` or configure the connection strings in the respective `.env` files.
2. **Server:** Navigate to `server/`, install dependencies with `npm install`, and run `npm run dev`.
3. **Client:** Navigate to `client/`, install dependencies with `npm install`, and run `npm run dev`.
4. **Recommender:** Navigate to `recommender/`, configure python virtual environment, install `requirements.txt`, run migrations, and run `python manage.py runserver`.
