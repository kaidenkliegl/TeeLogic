from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, IntegerField
from wtforms.validators import DataRequired, Length, Email, Optional

class GolferForm(FlaskForm):
    first_name = StringField(
        'First Name',
        validators=[DataRequired(), Length(max=50)]
    )

    last_name = StringField(
        'Last Name',
        validators=[DataRequired(), Length(max=50)]
    )

    email = StringField(
        'Email',
        validators=[Optional(), Email(), Length(max=100)]
    )

    phone = StringField(
        'Phone',
        validators=[Optional(), Length(max=20)]
    )

    # Optional: If you're associating a golfer with a course or user
    course_id = IntegerField(
        'Course ID',
        validators=[Optional()]
    )

    submit = SubmitField('Save Golfer')
