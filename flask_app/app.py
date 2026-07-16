"""
TWIN AI - Flask Application
AI-Powered Digital Twin of India's Climate
Main application entry point
"""
import os
import re
from urllib.parse import urljoin, urlparse

from flask import Flask, render_template, jsonify, request, session, redirect, url_for, g
from flask_cors import CORS
from datetime import datetime
import random
from werkzeug.security import check_password_hash, generate_password_hash

from config import Config
from models import db, User
from data import (
    INDIA_STATES, CROP_LIST, GOVERNMENT_SCHEMES,
    generate_climate_data, generate_predictions, generate_alerts,
    generate_crop_recommendations, run_simulation, get_ai_response, get_state_by_id
)


EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


def create_app():
    """Application factory"""
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions
    CORS(app)
    db.init_app(app)
    
    # Create tables
    with app.app_context():
        db.create_all()

    def is_safe_next(target):
        if not target:
            return False

        reference = urlparse(request.host_url)
        candidate = urlparse(urljoin(request.host_url, target))
        return candidate.scheme in {"http", "https"} and reference.netloc == candidate.netloc

    def get_next_url(default_endpoint="dashboard"):
        target = request.values.get("next")
        default_url = url_for(default_endpoint)
        return target if is_safe_next(target) else default_url

    def render_auth_page(mode, error=None, values=None):
        if mode == "login":
            copy = {
                "eyebrow": "Secure mission access",
                "title": "Welcome back to TWIN AI",
                "subtitle": "Sign in to continue monitoring climate, agriculture, disaster, and governance intelligence.",
                "panel_title": "Sign in to your account",
                "panel_subtitle": "Use your registered email and password to continue where you left off.",
                "cta_label": "Sign In",
                "switch_prompt": "New here?",
                "switch_label": "Create an account",
                "switch_href": url_for("signup", next=get_next_url()),
                "features": [
                    {
                        "icon": "🔐",
                        "title": "HTTP-only sessions",
                        "description": "Your browser session stays protected by Flask cookies.",
                    },
                    {
                        "icon": "🛰",
                        "title": "Fast access",
                        "description": "Jump straight back into dashboards and AI tools.",
                    },
                    {
                        "icon": "🌍",
                        "title": "Platform ready",
                        "description": "The same login can unlock the broader TWIN AI stack.",
                    },
                ],
            }
        else:
            copy = {
                "eyebrow": "Create your mission account",
                "title": "Join the TWIN AI platform",
                "subtitle": "Register once and keep your profile ready for future auth and personalization features.",
                "panel_title": "Create your account",
                "panel_subtitle": "Use a valid email and a strong password to start your session.",
                "cta_label": "Create Account",
                "switch_prompt": "Already have an account?",
                "switch_label": "Sign in instead",
                "switch_href": url_for("login", next=get_next_url()),
                "features": [
                    {
                        "icon": "🛡",
                        "title": "Password hashing",
                        "description": "Passwords are hashed before they are stored in the database.",
                    },
                    {
                        "icon": "🧬",
                        "title": "User profiles",
                        "description": "The account table already supports roles, language, and region data.",
                    },
                    {
                        "icon": "⚡",
                        "title": "Ready for growth",
                        "description": "This auth layer can expand into permissions or admin access later.",
                    },
                ],
            }

        return render_template(
            "auth.html",
            mode=mode,
            copy=copy,
            error=error,
            values=values or {},
            next_url=get_next_url(),
        )

    @app.before_request
    def load_current_user():
        user_id = session.get("user_id")

        if not user_id:
            g.current_user = None
            return

        g.current_user = db.session.get(User, user_id)
        if g.current_user is None:
            session.pop("user_id", None)

    @app.context_processor
    def inject_auth_context():
        return {
            "current_user": getattr(g, "current_user", None),
            "is_authenticated": getattr(g, "current_user", None) is not None,
        }
    
    # ─────────────────────────── PAGE ROUTES ───────────────────────────
    
    @app.route('/')
    def home():
        """Home page with animated Earth"""
        return render_template('home.html')
    
    @app.route('/dashboard')
    def dashboard():
        """Main dashboard page"""
        return render_template('dashboard.html')
    
    @app.route('/climate')
    def climate():
        """Climate monitoring page"""
        return render_template('climate.html', states=INDIA_STATES)

    @app.route('/map')
    def map_explorer():
        """Interactive map linking climate and agriculture intelligence"""
        return render_template('map.html', states=INDIA_STATES)
    
    @app.route('/agriculture')
    def agriculture():
        """Smart agriculture page"""
        return render_template('agriculture.html', states=INDIA_STATES, crops=CROP_LIST)
    
    @app.route('/disaster')
    def disaster():
        """Disaster management page"""
        return render_template('disaster.html')
    
    @app.route('/twin-ai')
    def twin_ai():
        """AI Chat page"""
        return render_template('twin_ai.html')
    
    @app.route('/simulation')
    def simulation():
        """Scenario simulation page"""
        return render_template('simulation.html', states=INDIA_STATES)
    
    @app.route('/government')
    def government():
        """Government dashboard page"""
        return render_template('government.html', states=INDIA_STATES)
    
    @app.route('/analytics')
    def analytics():
        """Analytics page"""
        return render_template('analytics.html', states=INDIA_STATES)
    
    @app.route('/citizen')
    def citizen():
        """Citizen portal page"""
        return render_template('citizen.html', states=INDIA_STATES)

    @app.route('/login', methods=['GET', 'POST'])
    def login():
        """User sign in page"""
        if g.current_user:
            return redirect(url_for("dashboard"))

        error = None
        values = {"email": ""}

        if request.method == "POST":
            values["email"] = request.form.get("email", "").strip()
            password = request.form.get("password", "")
            email = values["email"].lower()

            if not email or not password:
                error = "Email and password are required."
            elif not EMAIL_RE.match(email):
                error = "Enter a valid email address."
            else:
                user = User.query.filter_by(email=email).first()
                if not user or not user.is_active:
                    error = "Invalid email or password."
                elif not check_password_hash(user.password_hash, password):
                    error = "Invalid email or password."
                else:
                    session.clear()
                    session["user_id"] = user.id
                    return redirect(get_next_url())

        return render_auth_page("login", error=error, values=values)

    @app.route('/signup', methods=['GET', 'POST'])
    def signup():
        """User registration page"""
        if g.current_user:
            return redirect(url_for("dashboard"))

        error = None
        values = {"name": "", "email": ""}

        if request.method == "POST":
            values["name"] = request.form.get("name", "").strip()
            values["email"] = request.form.get("email", "").strip()
            password = request.form.get("password", "")
            confirm_password = request.form.get("confirm_password", "")
            name = " ".join(values["name"].split())
            email = values["email"].lower()

            if len(name) < 2:
                error = "Name must be at least 2 characters."
            elif not EMAIL_RE.match(email):
                error = "Enter a valid email address."
            elif len(password) < 8:
                error = "Password must be at least 8 characters."
            elif password != confirm_password:
                error = "Passwords do not match."
            elif User.query.filter_by(email=email).first():
                error = "An account with that email already exists."
            else:
                try:
                    user = User(
                        email=email,
                        name=name,
                        password_hash=generate_password_hash(password),
                        role="citizen",
                    )
                    db.session.add(user)
                    db.session.commit()
                    session.clear()
                    session["user_id"] = user.id
                    return redirect(get_next_url())
                except Exception:
                    db.session.rollback()
                    error = "Unable to create your account right now."

        return render_auth_page("signup", error=error, values=values)

    @app.route('/logout', methods=['POST'])
    def logout():
        """Sign out the active user"""
        session.clear()
        return redirect(url_for("home"))
    
    # ─────────────────────────── API ROUTES ───────────────────────────
    
    @app.route('/api/health')
    def api_health():
        """Health check endpoint"""
        return jsonify({
            "status": "healthy",
            "service": "TWIN AI",
            "timestamp": datetime.utcnow().isoformat() + "Z"
        })
    
    @app.route('/api/states')
    def api_states():
        """Get all states"""
        return jsonify({"states": INDIA_STATES})
    
    @app.route('/api/climate')
    def api_climate():
        """Get climate data for states"""
        state_id = request.args.get('state_id', type=int)
        
        if state_id:
            state = get_state_by_id(state_id)
            if not state:
                return jsonify({"error": "State not found"}), 404
            return jsonify({
                "state": state,
                "climate": generate_climate_data(state_id)
            })
        
        # Return all states climate
        all_data = []
        for state in INDIA_STATES:
            all_data.append({
                "state": state,
                "climate": generate_climate_data(state["id"])
            })
        
        return jsonify({
            "data": all_data,
            "timestamp": datetime.utcnow().isoformat() + "Z"
        })
    
    @app.route('/api/predictions')
    def api_predictions():
        """Get AI predictions"""
        state_id = request.args.get('state_id', 1, type=int)
        state = get_state_by_id(state_id)
        
        if not state:
            return jsonify({"error": "State not found"}), 404
        
        return jsonify({
            "state": state["name"],
            "predictions": generate_predictions(state_id),
            "model_version": "TWIN-AI v3.2.1",
            "last_trained": "2025-12-15T00:00:00Z",
            "timestamp": datetime.utcnow().isoformat() + "Z"
        })
    
    @app.route('/api/alerts')
    def api_alerts():
        """Get active alerts"""
        alerts = generate_alerts()
        return jsonify({
            "alerts": alerts,
            "total_active": len(alerts),
            "timestamp": datetime.utcnow().isoformat() + "Z"
        })
    
    @app.route('/api/agriculture')
    def api_agriculture():
        """Get agriculture data"""
        section = request.args.get('section', 'crops')
        state_id = request.args.get('state_id', 1, type=int)
        state = get_state_by_id(state_id)
        
        if section == 'crops':
            crops = [{"id": i+1, **c} for i, c in enumerate(CROP_LIST)]
            return jsonify({
                "crops": crops,
                "state": state["name"] if state else None
            })
        
        elif section == 'schemes':
            schemes = [{"id": i+1, "is_active": True, **s} for i, s in enumerate(GOVERNMENT_SCHEMES)]
            return jsonify({"schemes": schemes})
        
        elif section == 'recommendation':
            soil_type = request.args.get('soil_type', 'Alluvial')
            recommendations = generate_crop_recommendations(soil_type, state_id)
            return jsonify({
                "state": state["name"] if state else None,
                "soil_type": soil_type,
                "recommendations": recommendations
            })
        
        return jsonify({"error": "Invalid section"}), 400

    @app.route('/api/map-insights')
    def api_map_insights():
        """Return connected climate and agriculture insights for a map selection."""
        state_id = request.args.get('state_id', type=int)
        state = get_state_by_id(state_id) if state_id else None

        if not state:
            return jsonify({"error": "State not found"}), 404

        soil_by_region = {
            "North": "Alluvial",
            "South": "Red",
            "East": "Alluvial",
            "West": "Black Cotton",
            "Central": "Black Cotton",
            "Northeast": "Laterite",
        }
        soil_type = soil_by_region.get(state["region_type"], "Alluvial")
        climate = generate_climate_data(state_id)
        recommendations = generate_crop_recommendations(soil_type, state_id)[:3]

        if climate["rainfall"] >= 35:
            advisory = "Rainfall is elevated. Clear field drainage and postpone fertilizer application until the soil drains."
        elif climate["temperature"] >= 36:
            advisory = "Heat stress is possible. Prioritize irrigation in the early morning and use mulch to retain moisture."
        elif climate["humidity"] >= 75:
            advisory = "High humidity can increase fungal disease pressure. Monitor crops and keep field rows well ventilated."
        else:
            advisory = "Conditions are broadly suitable for routine crop monitoring, irrigation scheduling, and pest scouting."

        return jsonify({
            "state": state,
            "climate": climate,
            "agriculture": {
                "soil_type": soil_type,
                "recommendations": recommendations,
                "advisory": advisory,
            },
            "timestamp": datetime.utcnow().isoformat() + "Z",
        })
    
    @app.route('/api/simulation', methods=['POST'])
    def api_simulation():
        """Run scenario simulation"""
        data = request.get_json()
        sim_type = data.get('type', 'rain_increase')
        state_id = data.get('state_id', 1)
        
        result = run_simulation(sim_type, state_id, data)
        return jsonify(result)
    
    @app.route('/api/chat', methods=['POST'])
    def api_chat():
        """AI Chat endpoint"""
        data = request.get_json()
        message = data.get('message', '')
        language = data.get('language', 'en')
        
        response = get_ai_response(message)
        
        return jsonify({
            "response": response,
            "model": "TWIN-AI Copilot v3.2",
            "confidence": 0.89,
            "sources": ["IMD", "ISRO Bhuvan", "ICAR", "Ministry of Agriculture"],
            "timestamp": datetime.utcnow().isoformat() + "Z"
        })
    
    @app.route('/api/dashboard')
    def api_dashboard():
        """Get dashboard summary data"""
        alerts = generate_alerts()
        
        # Calculate national averages
        temps = []
        humids = []
        aqis = []
        rainfalls = []
        
        for state in INDIA_STATES:
            climate = generate_climate_data(state["id"])
            temps.append(climate["temperature"])
            humids.append(climate["humidity"])
            aqis.append(climate["aqi"])
            rainfalls.append(climate["rainfall"])
        
        return jsonify({
            "national": {
                "avg_temperature": round(sum(temps) / len(temps), 1),
                "avg_humidity": round(sum(humids) / len(humids)),
                "avg_aqi": round(sum(aqis) / len(aqis)),
                "total_rainfall": round(sum(rainfalls), 1),
                "total_states": 28,
                "total_districts": 766,
                "monitoring_stations": 4562,
                "satellites_active": 14,
                "ai_models_running": 23,
                "predictions_today": 12847,
                "alerts_active": len([a for a in alerts if a["severity"] in ["critical", "high"]])
            },
            "recent_alerts": alerts[:4],
            "timestamp": datetime.utcnow().isoformat() + "Z"
        })
    
    return app


# Create application instance
app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 3000))
    app.run(host='0.0.0.0', port=port, debug=True)
