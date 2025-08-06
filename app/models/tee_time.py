from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime



class TeeTime(db.Model):
    __tablename__ = 'tee_times'

    id = db.Column(db.Integer, primary_key=True)
    start_time = db.Column(db.DateTime, nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('courses.id')), nullable=False)
    interval = db.Column(db.Integer, nullable=False)
    holes = db.Column(db.Integer, nullable=False, default=18)
    max_players = db.Column(db.Integer, nullable=False, default=4)
    available_spots = db.Column(db.Integer, nullable=False, default=4)

    # New status field with 4 possible values
    status = db.Column(
        db.Enum('available', 'blocked', 'split', 'event', name='tee_time_status'),
        nullable=False,
        default='available'
    )
    event_name = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    ##relationships
    reservations = db.relationship("Reservation", back_populates="tee_time", cascade="all, delete-orphan")
    course = db.relationship("Course", back_populates="tee_times")


    def to_dict(self):
        return {
            'id': self.id,
            'start_time': self.start_time.isoformat(),
            'course_id': self.course_id,
            'interval': self.interval,
            'holes': self.holes,
            'max_players': self.max_players,
            'available_spots': self.available_spots,
            'status': self.status,
            'event_name': self.event_name,
            'created_at': self.created_at.isoformat()
        }
