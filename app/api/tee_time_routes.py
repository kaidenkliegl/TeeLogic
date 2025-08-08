from flask import Blueprint, request, jsonify
from flask_login import login_required
from app.models import db, TeeTimeSetting, TeeTime
from datetime import datetime
from sqlalchemy import func
from app.utils.tee_time_helper import tee_time_helper 

tee_time_routes = Blueprint("tee_time_routes", __name__)

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
    potential_tee_times = tee_time_generator(setting, date)

    # Only create tee times that don't already exist
    new_tee_times = []
    for data in potential_tee_times:
        if data['start_time'] not in existing_times:
            tee_time = TeeTime(
                start_time=data['start_time'],
                course_id=data['course_id'],
                interval=data['interval'],
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
