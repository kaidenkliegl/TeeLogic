from flask import Blueprint, request, jsonify
from flask_login import login_required
from app.models import db, TeeTimeSetting, TeeTime, Reservation, ReservationGolfer
from datetime import datetime
from sqlalchemy import func
from app.utils.tee_time_helper import tee_time_helper 
from app.forms import TeeTimeForm

tee_time_routes = Blueprint("tee_time", __name__)

@tee_time_routes.route("/", methods=['GET'])  
@login_required
def get_tee_times():
    course_id = request.args.get('course_id')
    date_str = request.args.get('date')  

    if not date_str or not course_id:
        return jsonify({"error": "Missing date and course_id"}), 400

    # Convert date string to a date object
    date = datetime.strptime(date_str, "%Y-%m-%d").date()

    # Get existing tee time start_times for that day
    existing_times = {
        tt.start_time for tt in TeeTime.query.filter(
            func.date(TeeTime.start_time) == date,
            TeeTime.course_id == course_id
        ).all()
    }

    # Get settings
    setting = TeeTimeSetting.query.filter_by(course_id=course_id).first()
    if not setting:
        return jsonify({"error": "No tee time settings found for this course"}), 404

    # Generate all potential tee times
    potential_tee_times = tee_time_helper(setting, date)

    # Only create tee times that don't already exist
    new_tee_times = []
    for data in potential_tee_times:
        if data['start_time'] not in existing_times:
            tee_time = TeeTime(
                start_time=data['start_time'],
                course_id=data['course_id'],
                max_players=data['max_players'],
                available_spots=data['available_spots'],
                status=data['status']
            )
            db.session.add(tee_time)
            new_tee_times.append(tee_time)

    # Commit only if there are new tee times
    if new_tee_times:
        db.session.commit()

    # Return all tee times for that day and course
    all_tee_times = TeeTime.query.filter(
        func.date(TeeTime.start_time) == date,
        TeeTime.course_id == course_id
    ).all()

    return jsonify([t.to_dict() for t in all_tee_times]), 200

@tee_time_routes.route("/<int:tee_time_id>/reservations", methods=["GET"])
@login_required
def get_tee_time_reservations(tee_time_id):
    reservations = Reservation.query.filter_by(tee_time_id=tee_time_id).order_by(Reservation.id.asc()).all()
    return jsonify([r.to_dict() for r in reservations]), 200


#create a tee time
@tee_time_routes.route("/", methods=["POST"])
@login_required
def create_tee_time():
    form = TeeTimeForm()
    form['csrf_token'].data = request.cookies.get('csrf_token')

   
    if form.validate_on_submit():
        new_tee_time = TeeTime(
            start_time=form.start_time.data,
            course_id=form.course_id.data,
            holes=form.holes.data or 18,
            max_players=form.max_players.data or 4,
            available_spots=form.available_spots.data or 4,
            status=form.status.data,
            event_name=form.event_name.data
        )

        db.session.add(new_tee_time)
        db.session.commit()

        return new_tee_time.to_dict()
    
    return {"errors": form.errors}, 400
        
# Edit a tee time
@tee_time_routes.route("/edit/<int:tee_time_id>", methods=["PUT"])
@login_required
def edit_tee_time(tee_time_id):
    form = TeeTimeForm()
    form['csrf_token'].data = request.cookies.get('csrf_token')
    tee_time = TeeTime.query.get(tee_time_id)
    tee_time = TeeTime.query.get(tee_time_id)
    if not tee_time:
        return jsonify({"error": "Tee time does not exist."}), 404
    if form.validate_on_submit():
        
        tee_time.start_time = form.start_time.data
        tee_time.course_id = form.course_id.data
        tee_time.holes = form.holes.data or 18
        tee_time.max_players = form.max_players.data or 4
        tee_time.available_spots = form.available_spots.data or 4
        tee_time.status = form.status.data
        tee_time.event_name = form.event_name.data
        
        db.session.commit()

        return tee_time.to_dict(), 201
    
    return {"errors": form.errors}, 400

        
    #Delete a tee time
@tee_time_routes.route("/delete/<int:tee_time_id>", methods=["DELETE"])
@login_required
def delete_tee_time(tee_time_id):
    tee_time = TeeTime.query.get(tee_time_id)
    if not tee_time:
        return jsonify({"error": "Tee time does not exist."}), 404
    deleted_time = tee_time.to_dict()
    db.session.delete(tee_time)
    db.session.commit()

    return {"message": "Tee time deleted successfully", "tee_time": deleted_time}, 200
    
    