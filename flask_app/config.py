"""
TWIN AI - Flask Configuration
"""
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'twin-ai-secret-key-2024')
    # Default to a local SQLite database so the Flask app can run without
    # requiring a separate PostgreSQL service during development.
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'sqlite:///twin_ai.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_size': 5,
        'pool_recycle': 300,
    }
