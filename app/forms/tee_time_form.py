from flask_wtf import FlaskForm
from wtforms import IntegerField, SelectField, StringField, SubmitField
from wtforms.fields import DateTimeField
from wtforms.validators import DataRequired, Optional, AnyOf

class TeeTimeForm(FlaskForm):
    start_time = DateTimeField(
        "Start Time",
        validators=[DataRequired()],
        format='%Y-%m-%d %H:%M:%S'  # this will produce a Python datetime object
    )
    course_id = IntegerField("Course ID", validators=[DataRequired()])
    holes = IntegerField("Holes", validators=[Optional()])
    max_players = IntegerField("Max Players", validators=[Optional()])
    available_spots = IntegerField("Available Spots", validators=[Optional()])
    status = SelectField(
        "Status",
        choices=[('available', 'Available'), ('blocked', 'Blocked'), ('split', 'Split'), ('event', 'Event')],
        validators=[DataRequired(), AnyOf(['available', 'blocked', 'split', 'event'])]
    )
    event_name = StringField("Event Name", validators=[Optional()])
    submit = SubmitField('Save Tee Time')
