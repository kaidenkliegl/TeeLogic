from app.models import db, TeeTimeSetting, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import time

def seed_tee_time_settings():
    setting = TeeTimeSetting(
        course_id=1,
        start_time=time(6, 0),       
        end_time=time(18, 0),         
        interval_minutes=10,                 
    )

    db.session.add(setting)
    db.session.commit()

def undo_tee_time_settings():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.tee_time_settings RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM tee_time_settings"))

    db.session.commit()
