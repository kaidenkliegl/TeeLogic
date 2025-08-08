from .db import db, environment, SCHEMA
from datetime import datetime

class Course(db.Model):
    __tablename__ = 'courses'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    total_holes = db.Column(db.Integer, nullable=False, default=18)
    description = db.Column(db.Text, nullable=True)
    address = db.Column(db.String(255), nullable=True)
    phone = db.Column(db.String(20), nullable=True)
    email = db.Column(db.String(100), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    tee_times = db.relationship("TeeTime", back_populates="course", cascade="all, delete-orphan")
    pricing_rules = db.relationship("PricingRule", back_populates="course", cascade="all, delete-orphan")
    users = db.relationship("User", back_populates="course", cascade="all, delete-orphan")
    golfers = db.relationship("Golfer", back_populates="course", cascade="all, delete-orphan")
    tee_time_settings = db.relationship('TeeTimeSetting', back_populates='course')


    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "total_holes": self.total_holes,
            "description": self.description,
            "address": self.address,
            "phone": self.phone,
            "email": self.email,
            "created_at": self.created_at.isoformat()
        }
