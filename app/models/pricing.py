from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class PricingRule(db.Model):
    __tablename__ = 'pricing_rules'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    title = db.Column(db.String, nullable=False)
    day_of_week = db.Column(db.String, nullable=False)
    time_range = db.Column(db.String, nullable=True)
    user_type = db.Column(db.String, nullable=False)
    rate = db.Column(db.Numeric(precision=5, scale=2), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    ## Foreign Keys
    course_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('courses.id')), nullable=False)

    ## created this pricing rule
    created_by = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=True)

    ## Relationships 
    course = db.relationship("Course", back_populates="pricing_rules")
    creator = db.relationship("User", back_populates="created_pricing_rules")

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'day_of_week': self.day_of_week,
            'time_range': self.time_range,
            'user_type': self.user_type,
            'rate': float(self.rate),
            'created_at': self.created_at,
            'created_by': self.creator.username if self.creator else None
        }
