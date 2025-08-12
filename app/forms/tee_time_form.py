from flask_wtf import FlaskForm
from wtforms import DateField, TimeField, IntegerField, SelectField, SubmitField
from wtforms.validators import DataRequired, NumberRange

class TeeTimeForm(FlaskForm):
    date = DateField("Date", validators=[DataRequired()])
    time = TimeField("Time", validators=[DataRequired()])
    group_size = IntegerField("Group Size", validators=[DataRequired(), NumberRange(min=1, max=4)])
    course_id = SelectField("Course", coerce=int, validators=[DataRequired()])
    status = SelectField(
        "Status",
        choices=[
            ('available', 'Available'),
            ('blocked', 'Blocked'),
            ('split', 'Split'),
            ('event', 'Event')
        ],
        validators=[DataRequired()]
    )
    submit = SubmitField('Save Tee Time')
