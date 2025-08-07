from app.models import db, PricingRule, environment, SCHEMA
from sqlalchemy.sql import text

def seed_pricing_rules():
    rules = [
        PricingRule(
            title='Weekday Morning - Member',
            day_of_week='Monday-Friday',
            time_range='6:00 AM - 11:59 AM',
            user_type='Member',
            rate=30.00,
            course_id=1,
            created_by=1
        ),
        PricingRule(
            title='Weekday Morning - Guest',
            day_of_week='Monday-Friday',
            time_range='6:00 AM - 11:59 AM',
            user_type='Guest',
            rate=45.00,
            course_id=1,
            created_by=1
        ),
        PricingRule(
            title='Weekend - Member',
            day_of_week='Saturday-Sunday',
            time_range='All Day',
            user_type='Member',
            rate=40.00,
            course_id=1,
            created_by=1
        ),
        PricingRule(
            title='Weekend - Guest',
            day_of_week='Saturday-Sunday',
            time_range='All Day',
            user_type='Guest',
            rate=60.00,
            course_id=1,
            created_by=1
        ),
        PricingRule(
            title='Twilight - Member',
            day_of_week='All Days',
            time_range='2:00 PM - Sunset',
            user_type='Member',
            rate=25.00,
            course_id=1,
            created_by=1
        ),
        PricingRule(
            title='Twilight - Guest',
            day_of_week='All Days',
            time_range='2:00 PM - Sunset',
            user_type='Guest',
            rate=35.00,
            course_id=1,
            created_by=1
        )
    ]

    db.session.add_all(rules)
    db.session.commit()

def undo_pricing_rules():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.pricing_rules RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM pricing_rules"))

    db.session.commit()
