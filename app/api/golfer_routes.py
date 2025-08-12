from flask import Blueprint, request, jsonify
from flask_login import login_required
from app.models import db, Golfer
from app.forms import GolferForm


golfer_routes = Blueprint('golfers', __name__)

@golfer_routes.route('/', methods=['GET'])
@login_required
def get_golfers():
    golfers = Golfer.query.all()
    return [g.to_dict() for g in golfers], 200

@golfer_routes.route('/<int:id>', methods=['GET'])
@login_required
def get_golfer(id):
    golfer = Golfer.query.get_or_404(id)
    return golfer.to_dict(), 200

@golfer_routes.route('/', methods=['POST'])
@login_required
def create_golfer():
    form = GolferForm()
    form['csrf_token'].data = request.cookies.get('csrf_token')

    form.first_name.data = request.json.get('first_name')
    form.last_name.data = request.json.get('last_name')
    form.email.data = request.json.get('email')
    form.phone.data = request.json.get('phone')
    form.course_id.data = request.json.get('course_id')

    if form.validate():
        new_golfer = Golfer(
            first_name=form.first_name.data,
            last_name=form.last_name.data,
            email=form.email.data,
            phone_number=form.phone.data,
            course_id=form.course_id.data
        )
        db.session.add(new_golfer)
        db.session.commit()
        return new_golfer.to_dict(), 201

    return {"errors": form.errors}, 400


@golfer_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_golfer(id):
    form = GolferForm()
    form['csrf_token'].data = request.cookies.get('csrf_token')

    form.first_name.data = request.json.get('first_name')
    form.last_name.data = request.json.get('last_name')
    form.email.data = request.json.get('email')
    form.phone.data = request.json.get('phone')
    form.course_id.data = request.json.get('course_id')

    golfer = Golfer.query.get(id)
    if not golfer:
        return {"error": "Golfer not found"}, 404

    if form.validate():
        golfer.first_name = form.first_name.data
        golfer.last_name = form.last_name.data
        golfer.email = form.email.data
        golfer.phone = form.phone.data
        golfer.course_id = form.course_id.data

        db.session.commit()
        return golfer.to_dict(), 200

    return {"errors": form.errors}, 400

@golfer_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_golfer(id):
    golfer = Golfer.query.get_or_404(id)
    db.session.delete(golfer)
    db.session.commit()
    return jsonify({"message": "Golfer deleted"}), 200
