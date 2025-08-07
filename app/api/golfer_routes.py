from flask import Blueprint, request, jsonify, abort
from app.models import db, Golfer

golfer_routes = Blueprint('golfers', __name__)

@golfer_routes.route('/', methods=['GET'])
def get_golfers():
    golfers = Golfer.query.all()
    return [g.to_dict() for g in golfers], 200

@golfer_routes.route('/<int:id>', methods=['GET'])
def get_golfer(id):
    golfer = Golfer.query.get_or_404(id)
    return golfer.to_dict(), 200

@golfer_routes.route('/', methods=['POST'])
def create_golfer():




@golfer_routes.route('/<int:id>', methods=['PUT'])
def update_golfer(id):
    golfer = Golfer.query.get_or_404(id)
    data = request.get_json()

    golfer.fullname = data.get('fullname', golfer.fullname)
    golfer.phone_number = data.get('phone_number', golfer.phone_number)
    golfer.email = data.get('email', golfer.email)
    golfer.member_status = data.get('member_status', golfer.member_status)
    golfer.course_id = data.get('course_id', golfer.course_id)

    db.session.commit()

    return golfer.to_dict()), 200

@golfer_routes.route('/<int:id>', methods=['DELETE'])
def delete_golfer(id):
    golfer = Golfer.query.get_or_404(id)
    db.session.delete(golfer)
    db.session.commit()
    return jsonify({"message": "Golfer deleted"}), 200
