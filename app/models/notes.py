from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Note(db.Model):
    __tablename__ = "notes"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(300), nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    # Foreign key to reservation
    author_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    reservation_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('reservations.id')), nullable=False)

    # Relationships
    reservation = db.relationship("Reservation", back_populates="notes")
    author = db.relationship("User", back_populates="notes")

    def to_dict(self):
        return {
            'id': self.id,
            'content': self.content,
            'author_id': self.author_id,
            'reservation_id': self.reservation_id,
            'created_at': self.created_at
        }
