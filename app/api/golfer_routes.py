from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, Golfer, Reservation
from app.forms import GolferForm



golfer_routes = Blueprint('golfers', __name__)

@golfer_routes.route('/', methods=['GET'])
@login_required
def get_golfers():
    course_id = current_user.course_id
    golfers = Golfer.query.filter_by(course_id=course_id).all()
    if not golfers:
        return jsonify({"message": "No golfers found for this course."}), 404
    return jsonify({"golfers": [g.to_dict() for g in golfers]}), 200

@golfer_routes.route('/<int:id>/one', methods=['GET'])
@login_required
def get_golfer(id):
    golfer = Golfer.query.get_or_404(id)
    return golfer.to_dict(), 200

@golfer_routes.route('/', methods=['POST'])
@login_required
def create_golfer():
    form = GolferForm()
    form['csrf_token'].data = request.cookies.get('csrf_token')

    if form.validate():
        new_golfer = Golfer(
            fullname=form.fullname.data,
            email=form.email.data,
            member_status=form.member_status.data,
            phone_number=form.phone.data,
            course_id=current_user.course_id
            
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



    golfer = Golfer.query.get(id)
    if not golfer:
        return {"error": "Golfer not found"}, 404

    if form.validate():
        golfer.fullname = form.fullname.data
        golfer.member_status = form.member_status.data
        golfer.email = form.email.data
        golfer.phone = form.phone.data
        golfer.course_id = current_user.course_id

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



@golfer_routes.route("/<int:golfer_id>/reservations")
@login_required
def get_golfer_reservations(golfer_id):
    reservations = Reservation.query.filter_by(golfer_id=golfer_id).all()
    return jsonify([r.to_dict() for r in reservations])