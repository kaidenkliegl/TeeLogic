from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, IntegerField
from wtforms.validators import DataRequired, Length, Email, Optional, NumberRange, Regexp

class GolferForm(FlaskForm):
    first_name = StringField(
        'First Name',
        validators=[DataRequired(message="First name is required."), Length(max=50)]
    )

    last_name = StringField(
        'Last Name',
        validators=[DataRequired(message="Last name is required."), Length(max=50)]
    )

    email = StringField(
        'Email',
        validators=[Optional(), Email(message="Invalid email address."), Length(max=100)]
    )

    phone = StringField(
        'Phone',
        validators=[
            Optional(),
            Length(min=10, max=20, message="Phone number must be between 10 and 20 digits."),
            Regexp(r'^\+?[\d\s\-()]+$', message="Invalid phone number format.")
        ]
    )

    course_id = IntegerField(
        'Course ID',
        validators=[DataRequired(message="Course ID is required."), NumberRange(min=1, message="Invalid course ID.")]
    )

    submit = SubmitField('Save Golfer')
