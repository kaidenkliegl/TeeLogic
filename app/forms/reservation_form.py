from flask_wtf import FlaskForm
from wtforms import IntegerField, DecimalField, SubmitField, StringField, HiddenField
from wtforms.validators import DataRequired, NumberRange, AnyOf

class ReservationForm(FlaskForm):
    golfer = StringField('Golfers Fullname', validators=[DataRequired()])
    total_price = DecimalField('Total Price', validators=[DataRequired(), NumberRange(min=0)])
    submit = SubmitField('Save Tee Time')