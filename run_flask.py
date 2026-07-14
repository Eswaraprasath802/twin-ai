#!/usr/bin/env python3
"""
TWIN AI - Flask Application Runner
Run this to start the Flask application
"""
import sys
import os

# Add flask_app to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'flask_app'))

from app import app

if __name__ == '__main__':
    print("=" * 60)
    print("🌍 TWIN AI - AI-Powered Digital Twin of India's Climate")
    print("=" * 60)
    print("\n🚀 Starting Flask server on http://localhost:5000\n")
    app.run(host='0.0.0.0', port=5000, debug=True)
