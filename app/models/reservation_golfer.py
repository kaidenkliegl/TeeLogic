from datetime import datetime
from .db import db, environment, SCHEMA, add_prefix_for_prod

class ReservationGolfer(db.Model):
    __tablename__ = 'reservation_golfers'
    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    reservation_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('reservations.id')), nullable=False)
    golfer_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('golfers.id')), nullable=False)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    payment_group = db.Column(db.Integer, nullable=True)  # grouping golfers for split payments
    payment_status = db.Column(db.String(20), default='unpaid', nullable=False)  # 'paid' or 'unpaid'

    reservation = db.relationship('Reservation', back_populates='reservation_golfers')
    golfer = db.relationship('Golfer')

    def to_dict(self):
        return {
            'id': self.id,
            'reservation_id': self.reservation_id,
            'golfer_id': self.golfer_id,
            'price': float(self.price),
            'payment_group': self.payment_group,
            'payment_status': self.payment_status
        }