from flask import Blueprint, request, jsonify
from flask_login import login_required
from app.models import db, Reservation, ReservationGolfer, TeeTime
from app.forms import ReservationForm  

reservation_routes = Blueprint("reservations", __name__)

# GET reservations for a tee time
@reservation_routes.route("/<int:tee_time_id>", methods=["GET"])
@login_required
def get_tee_time_reservation(tee_time_id):
    reservations = Reservation.query.filter_by(tee_time_id=tee_time_id).order_by(Reservation.id.asc()).all()
    result = []
    for r in reservations:
        golfers = ReservationGolfer.query.filter_by(reservation_id=r.id).all()
        result.append({
            "reservation": r.to_dict(),
            "golfers": [g.to_dict() for g in golfers]
        })
    return jsonify(result), 200


# PATCH mark reservation as deleted
@reservation_routes.route("/delete/<int:reservation_id>", methods=["PATCH"])
@login_required
def mark_deleted_reservation(reservation_id):
    reservation = Reservation.query.filter_by(id=reservation_id).one_or_none()
    if not reservation:
        return {"error": "Reservation not found"}, 404

    tee_time = TeeTime.query.filter_by(id=reservation.tee_time_id).one()

    num_golfers = len(reservation.reservation_golfers)
    reservation.status = "deleted"
    tee_time.available_spots += num_golfers

    if tee_time.available_spots > tee_time.max_players:
        tee_time.available_spots = tee_time.max_players

    db.session.commit()
    return {"message": "Reservation marked as deleted"}


# POST create a new reservation
@reservation_routes.route("/create/<int:tee_time_id>", methods=["POST"])
@login_required
def create_reservation(tee_time_id):
    form = ReservationForm()
    form['csrf_token'].data = request.cookies.get('csrf_token')

    tee_time = TeeTime.query.filter_by(id=tee_time_id).one_or_none()
    if not tee_time:
        return {"error": "Tee time not found"}, 404

    if tee_time.available_spots < 1:
        return {"error": "No spots available for this tee time"}, 400

    if form.validate_on_submit():
        reservation = Reservation(
            tee_time_id=tee_time_id,
            total_price=form.total_price.data,
            status="booked"
        )
        tee_time.available_spots -= 1
        db.session.add(reservation)
        db.session.commit()
        return jsonify(reservation.to_dict()), 201

    return {"error": "Invalid form submission"}, 400


@reservation_routes.route("/<int:reservation_id>", methods=["PATCH"])
@login_required
def update_reservation(reservation_id):
    form = ReservationForm()
    form['csrf_token'].data = request.cookies.get('csrf_token')

    reservation = Reservation.query.filter_by(id=reservation_id).one_or_none()
    if not reservation:
        return {"error": "Reservation not found"}, 404

    if form.validate_on_submit():
        reservation.total_price = form.total_price.data
        reservation.status = form.status.data

        db.session.commit()
        return reservation.to_dict(), 200

    return {"error": "Invalid form submission"}, 400
