from flask_wtf import FlaskForm
from wtforms import TimeField, IntegerField
from wtforms.validators import DataRequired, NumberRange

class TeeTimeSettingForm(FlaskForm):
    start_time = TimeField("Start Time", validators=[DataRequired()])
    interval_minutes = IntegerField("Interval (min)", validators=[DataRequired(), NumberRange(min=1)])
    end_time = TimeField("End Time", validators=[DataRequired()])
    course_id = IntegerField("Course ID", validators=[DataRequired()])
