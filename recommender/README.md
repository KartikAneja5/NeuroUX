# Recommender Microservice

Django-based recommendation service utilizing PyMongo, Pandas, and scikit-learn.

## Setup Instructions

1. Create and activate a python virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Or venv\Scripts\activate on Windows
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run migrations and start server:
   ```bash
   python manage.py migrate
   python manage.py runserver
   ```
