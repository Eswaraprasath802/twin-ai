"""
TWIN AI - Database Models (SQLAlchemy)
Complete schema for Digital Twin platform
"""
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import uuid

db = SQLAlchemy()

# ─────────────────────────── USERS & AUTH ───────────────────────────

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.Text, nullable=False)
    name = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), default='citizen')  # farmer, citizen, officer, researcher, admin
    language = db.Column(db.String(20), default='en')
    state = db.Column(db.String(100))
    district = db.Column(db.String(100))
    avatar_url = db.Column(db.Text)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class AuditLog(db.Model):
    __tablename__ = 'audit_logs'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'))
    action = db.Column(db.String(100), nullable=False)
    resource = db.Column(db.String(100))
    details = db.Column(db.JSON)
    ip_address = db.Column(db.String(45))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


# ─────────────────────────── GEOGRAPHY ───────────────────────────

class State(db.Model):
    __tablename__ = 'states'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    code = db.Column(db.String(10), unique=True, nullable=False)
    capital = db.Column(db.String(100))
    population = db.Column(db.Integer)
    area = db.Column(db.Float)
    lat = db.Column(db.Float)
    lng = db.Column(db.Float)
    region_type = db.Column(db.String(50))


class District(db.Model):
    __tablename__ = 'districts'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    state_id = db.Column(db.Integer, db.ForeignKey('states.id'))
    population = db.Column(db.Integer)
    area = db.Column(db.Float)
    lat = db.Column(db.Float)
    lng = db.Column(db.Float)
    soil_type = db.Column(db.String(100))
    climate_zone = db.Column(db.String(100))
    
    state = db.relationship('State', backref='districts')


# ─────────────────────────── CLIMATE ───────────────────────────

class ClimateData(db.Model):
    __tablename__ = 'climate_data'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    state_id = db.Column(db.Integer, db.ForeignKey('states.id'))
    district_id = db.Column(db.Integer, db.ForeignKey('districts.id'))
    temperature = db.Column(db.Float)
    humidity = db.Column(db.Float)
    rainfall = db.Column(db.Float)
    wind_speed = db.Column(db.Float)
    wind_direction = db.Column(db.String(10))
    pressure = db.Column(db.Float)
    aqi = db.Column(db.Integer)
    uv_index = db.Column(db.Float)
    visibility = db.Column(db.Float)
    cloud_cover = db.Column(db.Integer)
    condition = db.Column(db.String(50))
    recorded_at = db.Column(db.DateTime, default=datetime.utcnow)


# ─────────────────────────── ALERTS ───────────────────────────

class Alert(db.Model):
    __tablename__ = 'alerts'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    type = db.Column(db.String(50), nullable=False)
    severity = db.Column(db.String(20), nullable=False)  # critical, high, medium, low
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    state_id = db.Column(db.Integer, db.ForeignKey('states.id'))
    district_id = db.Column(db.Integer, db.ForeignKey('districts.id'))
    recommendations = db.Column(db.JSON)
    affected_population = db.Column(db.Integer)
    is_active = db.Column(db.Boolean, default=True)
    expires_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


# ─────────────────────────── AGRICULTURE ───────────────────────────

class Crop(db.Model):
    __tablename__ = 'crops'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50))
    season = db.Column(db.String(50))
    sowing_month = db.Column(db.String(20))
    harvest_month = db.Column(db.String(20))
    water_requirement = db.Column(db.String(50))
    soil_types = db.Column(db.JSON)
    ideal_temp = db.Column(db.JSON)
    msp = db.Column(db.Float)
    yield_per_hectare = db.Column(db.Float)


class GovernmentScheme(db.Model):
    __tablename__ = 'government_schemes'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    ministry = db.Column(db.String(255))
    category = db.Column(db.String(50))
    description = db.Column(db.Text)
    eligibility = db.Column(db.Text)
    benefits = db.Column(db.Text)
    link = db.Column(db.Text)
    is_active = db.Column(db.Boolean, default=True)


# ─────────────────────────── PREDICTIONS ───────────────────────────

class Prediction(db.Model):
    __tablename__ = 'predictions'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    type = db.Column(db.String(50), nullable=False)
    state_id = db.Column(db.Integer, db.ForeignKey('states.id'))
    district_id = db.Column(db.Integer, db.ForeignKey('districts.id'))
    value = db.Column(db.Float)
    confidence = db.Column(db.Float)
    unit = db.Column(db.String(30))
    extra_data = db.Column(db.JSON)
    predicted_for = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


# ─────────────────────────── SIMULATIONS ───────────────────────────

class Simulation(db.Model):
    __tablename__ = 'simulations'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'))
    name = db.Column(db.String(255), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    parameters = db.Column(db.JSON)
    results = db.Column(db.JSON)
    status = db.Column(db.String(20), default='pending')
    state_id = db.Column(db.Integer, db.ForeignKey('states.id'))
    district_id = db.Column(db.Integer, db.ForeignKey('districts.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


# ─────────────────────────── CHAT ───────────────────────────

class ChatMessage(db.Model):
    __tablename__ = 'chat_messages'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'))
    role = db.Column(db.String(20), nullable=False)
    content = db.Column(db.Text, nullable=False)
    language = db.Column(db.String(20))
    extra_data = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


# ─────────────────────────── DISASTERS ───────────────────────────

class DisasterEvent(db.Model):
    __tablename__ = 'disaster_events'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    type = db.Column(db.String(50), nullable=False)
    severity = db.Column(db.String(20), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    state_id = db.Column(db.Integer, db.ForeignKey('states.id'))
    district_id = db.Column(db.Integer, db.ForeignKey('districts.id'))
    lat = db.Column(db.Float)
    lng = db.Column(db.Float)
    affected_area = db.Column(db.Float)
    affected_population = db.Column(db.Integer)
    economic_loss = db.Column(db.Float)
    status = db.Column(db.String(20), default='active')
    started_at = db.Column(db.DateTime)
    ended_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
