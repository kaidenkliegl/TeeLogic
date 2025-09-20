from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime



class TeeTime(db.Model):
    __tablename__ = 'tee_times'

    if environment == "production":
        __table_args__ = (
            UniqueConstraint('course_id', 'start_time', name='uq_course_start_time'),
            Index('idx_course_start_time', 'course_id', 'start_time'),
            {'schema': SCHEMA}
        )

    id = db.Column(db.Integer, primary_key=True)
    start_time = db.Column(db.DateTime, nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('courses.id')), nullable=False)
    holes = db.Column(db.Integer, nullable=False, default=18)
    max_players = db.Column(db.Integer, nullable=False, default=4)
    available_spots = db.Column(db.Integer, nullable=False, default=4)


    # status field with 4 possible values
    status = db.Column(
        db.Enum('available', 'blocked', 'split', 'event', name='tee_time_status'),
        nullable=False,
        default='available'
    )
    event_name = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    

    ##relationships
    reservations = db.relationship('Reservation', back_populates='tee_time')
    course = db.relationship("Course", back_populates="tee_times")
    notes = db.relationship('Note', back_populates='tee_time', cascade='all, delete-orphan')


    def get_players(self):
        players = []
        for res in self.reservations:
            if res.golfer:
                players.append({
                    "id": res.golfer.id,
                    "fullname": res.golfer.fullname,
                    "member_status": res.golfer.member_status
                })
            else:
                players.append({
                    "id": None,
                    "fullname": "Unknown",
                    "member_status": "guest"
                })
        return players

    def to_dict(self):
        return {
            'id': self.id,
            'start_time': self.start_time.isoformat(),
            'course_id': self.course_id,
            'holes': self.holes,
            'max_players': self.max_players,
            'available_spots': self.available_spots,
            'status': self.status,
            'event_name': self.event_name,
            'players': self.get_players(),
            'created_at': self.created_at.isoformat()
        }
