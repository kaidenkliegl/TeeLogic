from datetime import datetime
from .db import db, environment, SCHEMA, add_prefix_for_prod

class Reservation(db.Model):
    __tablename__ = 'reservations'
    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    tee_time_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('tee_times.id')), nullable=False)
    golfer_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('golfers.id')), nullable=False)  # new FK
    total_price = db.Column(db.Numeric(10, 2), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    status = db.Column(db.String(20), nullable=False, default="available" )

    tee_time = db.relationship('TeeTime', back_populates='reservations')
    reservation_golfers = db.relationship('ReservationGolfer', back_populates='reservation', cascade='all, delete-orphan')

    golfer = db.relationship('Golfer', back_populates='reservations')  # single golfer

    def to_dict(self):
        return {
            'id': self.id,
            'tee_time_id': self.tee_time_id,
            'golfer': self.golfer.to_dict(),  # single golfer
            'total_price': float(self.total_price),
            'created_at': self.created_at.isoformat(),
            'status': self.status
        }
