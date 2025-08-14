from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, IntegerField, SelectField
from wtforms.validators import DataRequired, Length, Email, Optional, NumberRange, Regexp

class GolferForm(FlaskForm):
    fullname = StringField(
        'Fullname',
        validators=[DataRequired(message="Fullname is required."), Length(max=50)]
    )

    
    email = StringField(
        'Email',
        validators=[Optional(), Length(max=100)]
    )

    phone = StringField(
        'Phone',
        validators=[
            Optional(),
            Length(min=10, max=20, message="Phone number must be between 10 and 20 digits."),
            Regexp(r'^\+?[\d\s\-()]+$', message="Invalid phone number format.")
        ]
    )
    member_status = SelectField(
        'Membership Status',
        choices=[('guest', 'Guest'), ('member', 'Member'), ('league', 'League')],
        default='guest',
        validators=[DataRequired()]
    )

    

    submit = SubmitField('Save Golfer')
