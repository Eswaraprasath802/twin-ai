"""
TWIN AI - Flask Application
AI-Powered Digital Twin of India's Climate
Main application entry point
"""
import os
from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
from datetime import datetime
import random

from config import Config
from models import db
from data import (
    INDIA_STATES, CROP_LIST, GOVERNMENT_SCHEMES,
    generate_climate_data, generate_predictions, generate_alerts,
    generate_crop_recommendations, run_simulation, get_ai_response, get_state_by_id
)


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
