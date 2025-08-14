from app.models import db, Note, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime


def seed_notes():
    note1 = Note(
        content="Customer prefers a golf cart near the 1st tee.",
        created_at=datetime.utcnow(),
        author_id=1,     # staff user id
        tee_time_id=3    # tee_time linked to a reservation
    )

    note2 = Note(
        content="Special request: extra tees needed.",
        created_at=datetime.utcnow(),
        author_id=2,
        tee_time_id=5
    )

    note3 = Note(
        content="Reservation confirmed; check-in 15 mins early.",
        created_at=datetime.utcnow(),
        author_id=1,
        tee_time_id=7
    )

    db.session.add_all([note1, note2, note3])
    db.session.commit()


def undo_notes():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.notes RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM notes"))

    db.session.commit()
