from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime, time

class TeeTimeSetting(db.Model):
    __tablename__ = 'tee_time_settings'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA

    id = db.Column(db.Integer, primary_key=True)
    # Store the time of day
    start_time = db.Column(db.Time, nullable=False)  
    # How often tee times go out 
    interval_minutes = db.Column(db.Integer, nullable=False, default=10)
    end_time = db.Column(db.Time, nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('courses.id')), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    ## Relationships
    course = db.relationship("Course", back_populates="tee_time_settings")

    def to_dict(self):
        return {
            'id': self.id,
            'start_time': self.start_time.strftime('%H:%M'),
            'interval_minutes': self.interval_minutes,
            'end_time': self.end_time.strftime('%H:%M'),
            'course_id': self.course_id
        }
