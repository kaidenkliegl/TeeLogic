from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Golfer(db.Model):
    __tablename__ = 'golfers'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    fullname = db.Column(db.String(100), nullable=False)
    phone_number = db.Column(db.String(20), nullable=True)
    email = db.Column(db.String(255), nullable=True)  # Optional for guests
    member_status = db.Column(db.String(20), nullable=False, default="guest")  
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    # Foreign key to course
    course_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('courses.id')), nullable=False)

    # Relationships
    course = db.relationship("Course", back_populates="golfers")


    reservations = db.relationship(
        'Reservation',
        back_populates='golfer',
        cascade='all, delete-orphan'
    )

    def to_dict(self):
        return {
            'id': self.id,
            'fullname': self.fullname,
            'phone_number': self.phone_number,
            'email': self.email,
            'member_status': self.member_status,
            'created_at': self.created_at.isoformat()
        }


