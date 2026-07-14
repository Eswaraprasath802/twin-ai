"""
TWIN AI - India Reference Data & Data Generators
Comprehensive geospatial and demographic data for all Indian states
"""
import random
from datetime import datetime, timedelta

# ─────────────────────────── INDIA STATES DATA ───────────────────────────

INDIA_STATES = [
    {"id": 1, "name": "Andhra Pradesh", "code": "AP", "capital": "Amaravati", "lat": 15.9129, "lng": 79.74, "population": 49577103, "area": 162968, "region_type": "South"},
    {"id": 2, "name": "Arunachal Pradesh", "code": "AR", "capital": "Itanagar", "lat": 28.218, "lng": 94.7278, "population": 1383727, "area": 83743, "region_type": "Northeast"},
    {"id": 3, "name": "Assam", "code": "AS", "capital": "Dispur", "lat": 26.2006, "lng": 92.9376, "population": 31205576, "area": 78438, "region_type": "Northeast"},
    {"id": 4, "name": "Bihar", "code": "BR", "capital": "Patna", "lat": 25.0961, "lng": 85.3131, "population": 104099452, "area": 94163, "region_type": "East"},
    {"id": 5, "name": "Chhattisgarh", "code": "CG", "capital": "Raipur", "lat": 21.2787, "lng": 81.8661, "population": 25545198, "area": 135192, "region_type": "Central"},
    {"id": 6, "name": "Goa", "code": "GA", "capital": "Panaji", "lat": 15.2993, "lng": 74.124, "population": 1458545, "area": 3702, "region_type": "West"},
    {"id": 7, "name": "Gujarat", "code": "GJ", "capital": "Gandhinagar", "lat": 22.2587, "lng": 71.1924, "population": 60439692, "area": 196024, "region_type": "West"},
    {"id": 8, "name": "Haryana", "code": "HR", "capital": "Chandigarh", "lat": 29.0588, "lng": 76.0856, "population": 25351462, "area": 44212, "region_type": "North"},
    {"id": 9, "name": "Himachal Pradesh", "code": "HP", "capital": "Shimla", "lat": 31.1048, "lng": 77.1734, "population": 6864602, "area": 55673, "region_type": "North"},
    {"id": 10, "name": "Jharkhand", "code": "JH", "capital": "Ranchi", "lat": 23.6102, "lng": 85.2799, "population": 32988134, "area": 79716, "region_type": "East"},
    {"id": 11, "name": "Karnataka", "code": "KA", "capital": "Bengaluru", "lat": 15.3173, "lng": 75.7139, "population": 61095297, "area": 191791, "region_type": "South"},
    {"id": 12, "name": "Kerala", "code": "KL", "capital": "Thiruvananthapuram", "lat": 10.8505, "lng": 76.2711, "population": 33406061, "area": 38863, "region_type": "South"},
    {"id": 13, "name": "Madhya Pradesh", "code": "MP", "capital": "Bhopal", "lat": 22.9734, "lng": 78.6569, "population": 72626809, "area": 308252, "region_type": "Central"},
    {"id": 14, "name": "Maharashtra", "code": "MH", "capital": "Mumbai", "lat": 19.7515, "lng": 75.7139, "population": 112374333, "area": 307713, "region_type": "West"},
    {"id": 15, "name": "Manipur", "code": "MN", "capital": "Imphal", "lat": 24.6637, "lng": 93.9063, "population": 2855794, "area": 22327, "region_type": "Northeast"},
    {"id": 16, "name": "Meghalaya", "code": "ML", "capital": "Shillong", "lat": 25.467, "lng": 91.3662, "population": 2966889, "area": 22429, "region_type": "Northeast"},
    {"id": 17, "name": "Mizoram", "code": "MZ", "capital": "Aizawl", "lat": 23.1645, "lng": 92.9376, "population": 1097206, "area": 21081, "region_type": "Northeast"},
    {"id": 18, "name": "Nagaland", "code": "NL", "capital": "Kohima", "lat": 26.1584, "lng": 94.5624, "population": 1978502, "area": 16579, "region_type": "Northeast"},
    {"id": 19, "name": "Odisha", "code": "OD", "capital": "Bhubaneswar", "lat": 20.9517, "lng": 85.0985, "population": 41974218, "area": 155707, "region_type": "East"},
    {"id": 20, "name": "Punjab", "code": "PB", "capital": "Chandigarh", "lat": 31.1471, "lng": 75.3412, "population": 27743338, "area": 50362, "region_type": "North"},
    {"id": 21, "name": "Rajasthan", "code": "RJ", "capital": "Jaipur", "lat": 27.0238, "lng": 74.2179, "population": 68548437, "area": 342239, "region_type": "West"},
    {"id": 22, "name": "Sikkim", "code": "SK", "capital": "Gangtok", "lat": 27.533, "lng": 88.5122, "population": 610577, "area": 7096, "region_type": "Northeast"},
    {"id": 23, "name": "Tamil Nadu", "code": "TN", "capital": "Chennai", "lat": 11.1271, "lng": 78.6569, "population": 72147030, "area": 130058, "region_type": "South"},
    {"id": 24, "name": "Telangana", "code": "TS", "capital": "Hyderabad", "lat": 18.1124, "lng": 79.0193, "population": 35003674, "area": 112077, "region_type": "South"},
    {"id": 25, "name": "Tripura", "code": "TR", "capital": "Agartala", "lat": 23.9408, "lng": 91.9882, "population": 3673917, "area": 10486, "region_type": "Northeast"},
    {"id": 26, "name": "Uttar Pradesh", "code": "UP", "capital": "Lucknow", "lat": 26.8467, "lng": 80.9462, "population": 199812341, "area": 240928, "region_type": "North"},
    {"id": 27, "name": "Uttarakhand", "code": "UK", "capital": "Dehradun", "lat": 30.0668, "lng": 79.0193, "population": 10086292, "area": 53483, "region_type": "North"},
    {"id": 28, "name": "West Bengal", "code": "WB", "capital": "Kolkata", "lat": 22.9868, "lng": 87.855, "population": 91276115, "area": 88752, "region_type": "East"},
]

CLIMATE_CONDITIONS = [
    "Sunny", "Partly Cloudy", "Cloudy", "Overcast", "Light Rain",
    "Heavy Rain", "Thunderstorm", "Haze", "Fog", "Clear"
]

CROP_LIST = [
    {"name": "Rice", "category": "Cereal", "season": "Kharif", "sowing_month": "June", "harvest_month": "November", "water_requirement": "High", "msp": 2183, "yield_per_hectare": 2.5},
    {"name": "Wheat", "category": "Cereal", "season": "Rabi", "sowing_month": "November", "harvest_month": "April", "water_requirement": "Medium", "msp": 2275, "yield_per_hectare": 3.5},
    {"name": "Cotton", "category": "Cash Crop", "season": "Kharif", "sowing_month": "April", "harvest_month": "December", "water_requirement": "Medium", "msp": 6620, "yield_per_hectare": 0.5},
    {"name": "Sugarcane", "category": "Cash Crop", "season": "Annual", "sowing_month": "February", "harvest_month": "January", "water_requirement": "High", "msp": 315, "yield_per_hectare": 70},
    {"name": "Maize", "category": "Cereal", "season": "Kharif", "sowing_month": "June", "harvest_month": "October", "water_requirement": "Medium", "msp": 2090, "yield_per_hectare": 3.0},
    {"name": "Groundnut", "category": "Oilseed", "season": "Kharif", "sowing_month": "June", "harvest_month": "October", "water_requirement": "Low", "msp": 6377, "yield_per_hectare": 1.8},
    {"name": "Soybean", "category": "Oilseed", "season": "Kharif", "sowing_month": "June", "harvest_month": "October", "water_requirement": "Medium", "msp": 4600, "yield_per_hectare": 1.2},
    {"name": "Mustard", "category": "Oilseed", "season": "Rabi", "sowing_month": "October", "harvest_month": "March", "water_requirement": "Low", "msp": 5650, "yield_per_hectare": 1.3},
    {"name": "Potato", "category": "Vegetable", "season": "Rabi", "sowing_month": "October", "harvest_month": "February", "water_requirement": "Medium", "msp": 0, "yield_per_hectare": 22},
    {"name": "Tomato", "category": "Vegetable", "season": "All", "sowing_month": "Variable", "harvest_month": "Variable", "water_requirement": "Medium", "msp": 0, "yield_per_hectare": 25},
    {"name": "Onion", "category": "Vegetable", "season": "Rabi", "sowing_month": "November", "harvest_month": "April", "water_requirement": "Low", "msp": 0, "yield_per_hectare": 17},
    {"name": "Tea", "category": "Plantation", "season": "Annual", "sowing_month": "Year-round", "harvest_month": "Year-round", "water_requirement": "High", "msp": 0, "yield_per_hectare": 2.0},
]

GOVERNMENT_SCHEMES = [
    {"name": "PM-KISAN", "ministry": "Agriculture", "category": "Income Support", "description": "₹6,000 per year direct income support to farmer families", "eligibility": "All land-holding farmer families", "benefits": "₹6,000/year in 3 installments"},
    {"name": "PMFBY", "ministry": "Agriculture", "category": "Crop Insurance", "description": "Pradhan Mantri Fasal Bima Yojana - Comprehensive crop insurance", "eligibility": "All farmers growing notified crops", "benefits": "Full insured sum on crop loss"},
    {"name": "PM-KUSUM", "ministry": "MNRE", "category": "Solar Energy", "description": "Solar pumps and grid-connected solar for farmers", "eligibility": "Farmers with agricultural land", "benefits": "60% subsidy on solar pumps"},
    {"name": "Soil Health Card", "ministry": "Agriculture", "category": "Soil Testing", "description": "Free soil testing and nutrient recommendations", "eligibility": "All farmers", "benefits": "Free soil analysis report"},
    {"name": "MGNREGA", "ministry": "Rural Development", "category": "Employment", "description": "100 days guaranteed employment in rural areas", "eligibility": "Rural households", "benefits": "100 days employment at minimum wage"},
    {"name": "NDRF", "ministry": "Home Affairs", "category": "Disaster Relief", "description": "National Disaster Response Fund for disaster relief", "eligibility": "Disaster affected individuals", "benefits": "Financial assistance for disaster relief"},
]

ALERT_TEMPLATES = [
    {"type": "heavy_rain", "severity": "high", "title": "Heavy Rainfall Warning", "description": "IMD predicts 150-200mm rainfall in next 48 hours", "recommendations": ["Harvest mature crops immediately", "Stop fertilizer application", "Clear drainage channels", "Move livestock to elevated areas", "Store seeds in waterproof containers", "Avoid travel in flood-prone areas"]},
    {"type": "cyclone", "severity": "critical", "title": "Cyclonic Storm Alert", "description": "Deep depression intensifying into cyclonic storm, expected landfall in 72 hours", "recommendations": ["Evacuate coastal villages", "Secure loose structures", "Stock emergency supplies", "Move boats to safe harbor", "Contact NDRF helpline: 011-26701700", "Follow evacuation routes"]},
    {"type": "heatwave", "severity": "high", "title": "Severe Heatwave Warning", "description": "Temperature expected to reach 45°C+ for next 5 days", "recommendations": ["Avoid outdoor work 12PM-4PM", "Increase water intake", "Use ORS solution", "Keep livestock hydrated", "Apply mulching to crops", "Visit nearest cooling center"]},
    {"type": "flood", "severity": "critical", "title": "Flood Warning - River Basin", "description": "Water levels rising above danger mark, flooding expected in low-lying areas", "recommendations": ["Evacuate low-lying areas", "Move to higher ground", "Keep emergency kit ready", "Do not cross flooded bridges", "Boil drinking water", "Contact district helpline"]},
    {"type": "drought", "severity": "medium", "title": "Drought Advisory", "description": "Below-normal rainfall predicted, water conservation measures recommended", "recommendations": ["Switch to drought-resistant crops", "Implement drip irrigation", "Reduce non-essential water use", "Harvest rainwater", "Apply for drought relief fund", "Contact agriculture officer"]},
    {"type": "forest_fire", "severity": "high", "title": "Forest Fire Risk Alert", "description": "High temperature and low humidity increasing fire risk in forest areas", "recommendations": ["Report any fire sighting to 1800-11-1363", "Create firebreaks around settlements", "Keep water reserves ready", "Avoid burning crop residue", "Stay away from fire-prone forest areas"]},
]

# ─────────────────────────── DATA GENERATORS ───────────────────────────

def get_state_by_id(state_id):
    """Get state data by ID"""
    for state in INDIA_STATES:
        if state["id"] == state_id:
            return state
    return None


def generate_climate_data(state_id):
    """Generate realistic climate data for a state"""
    state = get_state_by_id(state_id)
    if not state:
        return None
    
    lat_factor = (state["lat"] - 8) / 30  # 0 to 1, south to north
    base_temp = 35 - lat_factor * 15 + (random.random() * 6 - 3)
    base_humidity = 50 + (20 if state["region_type"] in ["South", "Northeast"] else 0) + (random.random() * 20 - 10)
    base_rainfall = random.random() * 50 * (3 if state["region_type"] == "Northeast" else 1)
    
    return {
        "temperature": round(base_temp, 1),
        "humidity": min(100, max(20, round(base_humidity))),
        "rainfall": round(base_rainfall, 1),
        "wind_speed": round(5 + random.random() * 25, 1),
        "wind_direction": random.choice(["N", "NE", "E", "SE", "S", "SW", "W", "NW"]),
        "pressure": round(1005 + random.random() * 20, 1),
        "aqi": int(50 + random.random() * 300),
        "uv_index": round(3 + random.random() * 8, 1),
        "visibility": round(5 + random.random() * 10, 1),
        "cloud_cover": int(random.random() * 100),
        "condition": random.choice(CLIMATE_CONDITIONS),
    }


def generate_predictions(state_id):
    """Generate AI predictions for various parameters"""
    types = [
        {"type": "rainfall", "unit": "mm", "base": 50, "variance": 100},
        {"type": "temperature", "unit": "°C", "base": 30, "variance": 10},
        {"type": "humidity", "unit": "%", "base": 60, "variance": 30},
        {"type": "aqi", "unit": "AQI", "base": 150, "variance": 200},
        {"type": "flood_risk", "unit": "%", "base": 20, "variance": 50},
        {"type": "drought_risk", "unit": "%", "base": 15, "variance": 40},
        {"type": "cyclone_risk", "unit": "%", "base": 10, "variance": 30},
        {"type": "heatwave_risk", "unit": "%", "base": 25, "variance": 50},
        {"type": "crop_yield", "unit": "ton/ha", "base": 3, "variance": 2},
        {"type": "groundwater", "unit": "m", "base": 8, "variance": 5},
    ]
    
    predictions = []
    for t in types:
        predictions.append({
            "type": t["type"],
            "value": round(t["base"] + random.random() * t["variance"], 1),
            "confidence": round(70 + random.random() * 25, 1),
            "unit": t["unit"],
            "trend": random.choice(["up", "down", "stable"]),
            "predicted_for": (datetime.utcnow() + timedelta(days=1)).isoformat() + "Z",
        })
    return predictions


def generate_alerts():
    """Generate active alerts with recommendations"""
    alerts = []
    for i, template in enumerate(ALERT_TEMPLATES):
        alert = template.copy()
        alert["id"] = i + 1
        alert["state"] = random.choice(INDIA_STATES)["name"]
        alert["affected_population"] = int(100000 + random.random() * 5000000)
        alert["is_active"] = True
        alert["created_at"] = (datetime.utcnow() - timedelta(days=random.random() * 3)).isoformat() + "Z"
        alerts.append(alert)
    return alerts


def generate_crop_recommendations(soil_type, state_id):
    """Generate AI crop recommendations based on soil and climate"""
    state = get_state_by_id(state_id)
    recommendations = []
    
    for crop in random.sample(CROP_LIST, min(5, len(CROP_LIST))):
        recommendations.append({
            "crop": crop["name"],
            "suitability": round(60 + random.random() * 35),
            "reason": f"Suitable for {soil_type} soil with current climate conditions",
            "expected_yield": round(crop["yield_per_hectare"] * (0.8 + random.random() * 0.4), 1),
            "msp": crop["msp"],
            "season": crop["season"],
        })
    
    # Sort by suitability
    recommendations.sort(key=lambda x: x["suitability"], reverse=True)
    return recommendations


def run_simulation(sim_type, state_id, params):
    """Run climate scenario simulation"""
    state = get_state_by_id(state_id) or INDIA_STATES[0]
    pop = state["population"]
    
    affected_pct = 0
    crop_damage_pct = 0
    economic_loss = 0
    
    if sim_type == "rain_increase":
        rain_change = params.get("rain_change", 20)
        affected_pct = min(0.4, rain_change / 100 * 0.5)
        crop_damage_pct = affected_pct * 0.6
        economic_loss = pop * affected_pct * 500
    elif sim_type == "temperature_increase":
        temp_change = params.get("temp_change", 2)
        affected_pct = min(0.3, temp_change / 5 * 0.3)
        crop_damage_pct = affected_pct * 0.8
        economic_loss = pop * affected_pct * 300
    elif sim_type == "cyclone":
        affected_pct = 0.15 + random.random() * 0.15
        crop_damage_pct = 0.3 + random.random() * 0.2
        economic_loss = pop * 0.1 * 2000
    elif sim_type == "flood":
        affected_pct = 0.1 + random.random() * 0.2
        crop_damage_pct = 0.4 + random.random() * 0.3
        economic_loss = pop * 0.15 * 1500
    elif sim_type == "drought":
        affected_pct = 0.2 + random.random() * 0.3
        crop_damage_pct = 0.5 + random.random() * 0.3
        economic_loss = pop * 0.2 * 800
    else:
        affected_pct = 0.05
        crop_damage_pct = 0.1
        economic_loss = pop * 0.05 * 200
    
    return {
        "id": str(random.randint(100000, 999999)),
        "state": state["name"],
        "type": sim_type,
        "parameters": params,
        "results": {
            "affected_villages": int(200 + random.random() * 2000),
            "affected_population": int(pop * affected_pct),
            "crop_damage": round(crop_damage_pct * 100),
            "economic_loss": round(economic_loss / 10000000),
            "road_closures": int(10 + random.random() * 100),
            "hospital_impact": int(5 + random.random() * 30),
            "recommendations": [
                "Deploy NDRF teams to high-risk zones",
                "Activate emergency shelters in affected districts",
                "Pre-position relief supplies at block level",
                "Issue early warning through Common Alerting Protocol",
                "Coordinate with state disaster management authority",
                "Activate crop insurance assessment teams",
                "Monitor dam and reservoir levels continuously",
                "Establish medical camps in vulnerable areas",
            ][:5 + int(random.random() * 3)],
        },
        "computed_at": datetime.utcnow().isoformat() + "Z",
        "model_version": "SimEngine v2.4.0",
    }


# ─────────────────────────── AI CHAT RESPONSES ───────────────────────────

AI_RESPONSES = {
    "rain": """Based on IMD data and our ML models, I'm analyzing the rainfall patterns for your region. Current monsoon models indicate a 72% probability of above-normal rainfall in the next 7 days. The Western Disturbance and Bay of Bengal Low Pressure system are key drivers.

🌧️ **Rainfall Forecast**: 45-65mm expected in next 48 hours
📊 **Confidence**: 85% (LSTM + GFS ensemble)
🌾 **Agriculture Advisory**: Complete harvesting of mature crops
💧 **Water Management**: Clear drainage channels
⚠️ **Precaution**: Avoid low-lying areas""",

    "cotton": """Based on soil analysis, climate data, and market trends, here's my assessment for cotton cultivation in your region:

🌿 **Suitability Score**: 78/100
🌡️ **Temperature**: Current 32°C is within optimal range (25-35°C)
💧 **Water**: Medium requirement - ensure drip irrigation
🌍 **Soil**: Black cotton soil is ideal
📅 **Sowing Window**: April-May (Kharif)
💰 **MSP 2024-25**: ₹6,620/quintal
📈 **Market Trend**: Prices expected to rise 8% by harvest

**Recommendation**: ✅ Suitable for cultivation with proper irrigation management""",

    "flood": """Running flood risk assessment using our hydrological model:

🌊 **Flood Probability**: 34% (next 7 days)
📊 **Risk Level**: Moderate
🏞️ **Key Rivers**: Monitoring water levels at 12 gauging stations
📡 **Satellite Data**: INSAT-3D showing cloud mass movement

**If flood occurs:**
1. Move to higher ground immediately
2. Contact NDRF: 011-26701700
3. Nearest shelter: District Collectorate
4. Emergency kit: Water, food, documents, medicines
5. Follow district administration alerts

**Current Dam Levels**: 78% capacity - being monitored""",

    "crop": """Based on your location's soil type, climate zone, and current weather patterns, here are my top crop recommendations:

🥇 **Rice** - Suitability: 92% | Expected Yield: 2.8 ton/ha
🥈 **Maize** - Suitability: 87% | Expected Yield: 3.2 ton/ha
🥉 **Groundnut** - Suitability: 81% | Expected Yield: 1.9 ton/ha

📊 **Analysis Factors**: Soil pH, moisture, temperature, humidity, historical yield data
🤖 **Model**: XGBoost + Random Forest ensemble (89% accuracy)

**Market Intelligence**: Rice demand expected to increase 5% this quarter
**Government Support**: PM-KISAN, PMFBY crop insurance available""",

    "fertilizer": """Based on soil health analysis and crop requirements:

🧪 **Soil Status**: pH 6.8, Organic Carbon: Medium

**Recommended Fertilizer Schedule:**
1. **Basal Dose**: DAP 100kg/ha + MOP 60kg/ha
2. **Top Dressing 1** (30 days): Urea 50kg/ha
3. **Top Dressing 2** (60 days): Urea 30kg/ha

🌱 **Organic Alternative**: Vermicompost 5 ton/ha + Neem cake 250kg/ha
💰 **Subsidy**: Available under Soil Health Card scheme
🏪 **Nearest dealer**: Krishi Seva Kendra, 2.3km away

⚠️ **Important**: Get soil tested every 2 years at nearest Soil Testing Lab""",

    "default": """I'm TWIN AI, your intelligent climate and agriculture copilot. I can help you with:

🌤️ **Weather**: Real-time forecasts and predictions
🌾 **Agriculture**: Crop recommendations, fertilizer advice
🌊 **Disasters**: Flood, cyclone, drought risk assessment
📊 **Analytics**: Climate trends and data analysis
🏛️ **Government**: Schemes, MSP, insurance information
🗺️ **Location**: District-level insights and advisories

Try asking me:
• "Will it rain tomorrow?"
• "What crop should I grow?"
• "Flood probability in my area?"
• "What fertilizer should I use?"
• "Government schemes for farmers" """
}


def get_ai_response(message):
    """Get AI response based on user message"""
    message_lower = message.lower()
    
    if any(word in message_lower for word in ["rain", "weather", "forecast"]):
        return AI_RESPONSES["rain"]
    elif any(word in message_lower for word in ["cotton", "grow"]):
        return AI_RESPONSES["cotton"]
    elif any(word in message_lower for word in ["flood", "water level"]):
        return AI_RESPONSES["flood"]
    elif any(word in message_lower for word in ["crop", "what should"]):
        return AI_RESPONSES["crop"]
    elif any(word in message_lower for word in ["fertilizer", "soil"]):
        return AI_RESPONSES["fertilizer"]
    else:
        return AI_RESPONSES["default"]
