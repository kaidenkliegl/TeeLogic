from flask_wtf import FlaskForm
from wtforms import IntegerField, DecimalField, SubmitField
from wtforms.validators import DataRequired, NumberRange

class ReservationForm(FlaskForm):
    tee_time_id = IntegerField('Tee Time ID', validators=[DataRequired()])
    total_price = DecimalField('Total Price', validators=[DataRequired(), NumberRange(min=0)])
    submit = SubmitField('Save Tee Time')