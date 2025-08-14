from app.models import db, Course, environment, SCHEMA
from sqlalchemy.sql import text

def seed_courses():
    windsor = Course(
        name='Windsor Golf Course',
        total_holes=18,
        description='Public course in Sonoma County, CA. Used for tournaments and daily play. Includes pro shop, range, and practice facilities.',
        address='1340 19th Hole Drive, Windsor, CA 95492',
        phone='707-838-7888',
        email='info@windsorgolf.com'
    )

    db.session.add(windsor)
    db.session.commit()

def undo_courses():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.courses RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM courses"))

    db.session.commit()
