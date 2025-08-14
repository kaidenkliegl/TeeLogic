from app.models import db, Golfer, environment, SCHEMA
from datetime import datetime
from sqlalchemy.sql import text

def seed_golfers():
    # Example golfers
    golfer1 = Golfer(fullname="Alice Montanez", course_id=1, member_status="member", email="alice@example.com")
    golfer2 = Golfer(fullname="Bob Kaido", course_id=1, member_status="guest", email="bob@example.com")
    golfer3 = Golfer(fullname="Charlie Gibbson", course_id=1, member_status="league", email="charlie@example.com")
    golfer4 = Golfer(fullname="Diana Brotman", course_id=1, member_status="guest", email="diana@example.com")

    db.session.add_all([golfer1, golfer2, golfer3, golfer4])
    db.session.commit()

def undo_golfers():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.golfers RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM golfers"))

    db.session.commit()
