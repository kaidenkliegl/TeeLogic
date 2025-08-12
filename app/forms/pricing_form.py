from flask_wtf import FlaskForm
from wtforms import DateField, TimeField, IntegerField, SelectField, SubmitField, StringField, DecimalField
from wtforms.validators import DataRequired, NumberRange, Optional

class PricingRuleForm(FlaskForm):
    title = StringField("Title", validators=[DataRequired()])
    day_of_week = StringField("Day of the Week", validators=[DataRequired()])
    time_range = StringField("Time Range", validators=[Optional()]) 
    user_type = StringField("User Type", validators=[DataRequired()]) 
    rate = DecimalField("Rate", places=2, validators=[DataRequired(), NumberRange(min=0)])
    submit = SubmitField("Save Pricing Rule")
