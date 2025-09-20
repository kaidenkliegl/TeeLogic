from app.models import db, TeeTime, TeeTimeSetting, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime, timedelta

def seed_tee_times():
    today = datetime.utcnow().date()
    end_date = today + timedelta(days=90)

    tee_times = []

    settings = TeeTimeSetting.query.all()

    for setting in settings:
        for i in range((end_date - today).days + 1):
            date = today + timedelta(days=i)

            # Combine date with stored start/end times
            start_time = datetime.combine(date, setting.start_time)
            end_time = datetime.combine(date, setting.end_time)

            while start_time <= end_time:
                tee_times.append(TeeTime(
                    start_time=start_time,
                    course_id=setting.course_id,
                    holes=18, 
                    max_players=4, 
                    available_spots=4,
                    status="available",
                    event_name=None
                ))
                start_time += timedelta(minutes=setting.interval_minutes)

    db.session.add_all(tee_times)
    db.session.commit()
    print(f"✅ Seeded {len(tee_times)} tee times through {end_date}")

def undo_tee_times():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.tee_times RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM tee_times"))
    db.session.commit()
