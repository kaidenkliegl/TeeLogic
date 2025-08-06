from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text


def seed_users():
    # Golf Shop Attendant
    demo = User(
        username='Demo',
        email='demo@aa.io',
        password='password',
        role='Golf Shop Attendant',
        course_id=1
    )

    # Starter
    marnie = User(
        username='marnie',
        email='marnie@aa.io',
        password='password',
        role='Starter',
        course_id=1
    )

    # Only add a Golf Pro if one doesn't already exist
    existing_pro = User.query.filter_by(role='Golf Pro').first()
    if not existing_pro:
        bobbie = User(
            username='bobbie',
            email='bobbie@aa.io',
            password='password',
            role='Golf Pro',
            course_id=1
        )
        db.session.add_all([demo, marnie, bobbie])
    else:
        db.session.add_all([demo, marnie])

    db.session.commit()

# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.

def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))

    db.session.commit()




