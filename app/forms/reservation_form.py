from wtforms import StringField, DecimalField, SubmitField
from wtforms.validators import DataRequired, NumberRange, Optional
from flask_wtf import FlaskForm

class ReservationForm(FlaskForm):
    golfer = StringField('Golfer Fullname', validators=[Optional()])
    total_price = DecimalField('Total Price', validators=[Optional(), NumberRange(min=0)])
    submit = SubmitField('Save Tee Time')