from app.models import db, TeeTime, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime, timedelta

def seed_tee_times():
    start_time = datetime(2025, 8, 9, 6, 0)
    tee_times = []

    for i in range(10):  # Generate 10 tee times
        tee_times.append(TeeTime(
            start_time=start_time + timedelta(minutes=10 * i),
            course_id=1,
            holes=18,
            max_players=4,
            available_spots=4,
            status='available',
            event_name=None
        ))

    db.session.add_all(tee_times)
    db.session.commit()

def undo_tee_times():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.tee_times RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM tee_times"))

    db.session.commit()