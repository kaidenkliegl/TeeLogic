from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Note(db.Model):
    __tablename__ = "notes"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(300), nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    author_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    tee_time_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('tee_times.id')), nullable=False)

    # Relationships
    tee_time = db.relationship("TeeTime", back_populates="notes")
    author = db.relationship("User", back_populates="notes", primaryjoin='Note.tee_time_id == TeeTime.id')

    def to_dict(self):
        return {
            'id': self.id,
            'content': self.content,
            'author_id': self.author_id,
            'tee_time_id': self.tee_time_id,
            'created_at': self.created_at
        }
