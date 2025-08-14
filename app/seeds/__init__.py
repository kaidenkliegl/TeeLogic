from flask.cli import AppGroup
from .users import seed_users, undo_users
from .courses import seed_courses, undo_courses
from .pricing import seed_pricing_rules, undo_pricing_rules
from .time_settings import seed_tee_time_settings, undo_tee_time_settings
from .tee_times import seed_tee_times, undo_tee_times
from .notes import seed_notes, undo_notes
from .golfers import seed_golfers, undo_golfers
from .reservations import seed_reservations, undo_reservations


from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Undo all data before seeding in production to avoid conflicts  
        undo_notes()  
        undo_golfers()
        undo_reservations()
        undo_tee_times()
        undo_tee_time_settings()
        undo_pricing_rules()
        undo_courses()
        undo_users()
    # Seed all data in dependency order
    seed_users()
    seed_courses()
    seed_pricing_rules()
    seed_tee_time_settings()
    seed_tee_times() 
    seed_golfers()
    seed_reservations()       
    seed_notes()


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():        
    undo_tee_times()
    undo_tee_time_settings()
    undo_pricing_rules()
    undo_courses()
    undo_users()
