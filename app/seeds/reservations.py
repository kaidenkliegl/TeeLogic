from app.models import db, Reservation, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime


def seed_reservations():
    # Example reservations with placeholder tee_time_ids and status
    reservation1 = Reservation(
        tee_time_id=1,
        total_price=120.00,
        created_at=datetime.utcnow(),
        status='confirmed'
    )

    reservation2 = Reservation(
        tee_time_id=2,
        total_price=90.50,
        created_at=datetime.utcnow(),
        status='pending'
    )

    db.session.add_all([reservation1, reservation2])
    db.session.commit()


def undo_reservations():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.reservations RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM reservations"))

    db.session.commit()
