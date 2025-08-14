from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, PricingRule
from datetime import datetime
from sqlalchemy import func
from app.forms import PricingRuleForm


pricing_rules_routes = Blueprint("pricing", __name__)

@pricing_rules_routes.route("/", methods=["GET"])
@login_required
def get_pricing_rules():
    course_id = current_user.course_id  
    pricing_rules = PricingRule.query.filter_by(course_id=course_id).all()

    if not pricing_rules:
        return jsonify({"error": "pricing rules not found"})

    return [p.to_dict() for p in pricing_rules], 200


@pricing_rules_routes.route("/", methods=["POST"])
@login_required
def get_pricing_buttons():
    form = PricingRuleForm()
    form['csrf_token'].data = request.cookies.get('csrf_token')

    if form.validate_on_submit():
        pricing_rule = PricingRule(
            course_id = current_user.course_id,
            title=form.title.data,
            day_of_week=form.day_of_week.data,
            time_range=form.time_range.data,
            user_type=form.user_type.data,
            rate=form.rate.data
        )

        db.session.add(pricing_rule)
        db.session.commit()

        return pricing_rule.to_dict(), 201 

    return {"errors": form.errors}, 400


@pricing_rules_routes.route("/<int:pricing_id>", methods=["PUT"])
@login_required
def edit_pricing_buttons(pricing_id):
    form = PricingRuleForm()
    form['csrf_token'].data = request.cookies.get('csrf_token')
    pricing_rule = PricingRule.query.filter_by(id=pricing_id).one_or_none()
    if not pricing_rule:
        return {"error": "Pricing rule not found"}, 404

    if form.validate_on_submit():
        
        pricing_rule.title=form.title.data
        pricing_rule.day_of_week=form.day_of_week.data
        pricing_rule.time_range=form.time_range.data
        pricing_rule.user_type=form.user_type.data
        pricing_rule.rate=form.rate.data
        

        db.session.commit()
        return pricing_rule.to_dict(), 201 

    return {"errors": form.errors}, 400



@pricing_rules_routes.route("/<int:pricing_id>/delete", methods=["DELETE"])
@login_required
def delete_pricing_rule(pricing_id):
    
    pricing_rule = db.session.get(PricingRule, pricing_id)
    
    if not pricing_rule:
        return jsonify({"error": "Pricing rule not found"}), 404
    
    db.session.delete(pricing_rule)
    db.session.commit()
    
    return jsonify({"message": "Successfully deleted pricing rule."}), 200



        