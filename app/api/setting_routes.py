from flask import Blueprint, request, jsonify
from flask_login import login_required
from app.models import db, TeeTimeSetting
from app.forms import TeeTimeSettingForm


tee_time_settings_routes = Blueprint('tee_time_settings_routes', __name__, url_prefix='/settings')

@tee_time_settings_routes.route('/', methods=['POST'])
@login_required
def create_setting():
    form = TeeTimeSettingForm()
    form['csrf_token'].data = request.cookies.get('csrf_token')

    if form.validate_on_submit():
        setting = TeeTimeSetting(
            start_time=form.start_time.data,
            interval_minutes=form.interval_minutes.data,
            max_tee_times=form.max_tee_times.data,
            course_id=form.course_id.data
        )
        db.session.add(setting)
        db.session.commit()
        return setting.to_dict(), 201

    return jsonify({"errors": form.errors}), 400


@tee_time_settings_routes.route('/<int:course_id>', methods=['GET'])
@login_required
def get_setting(course_id):
    setting = TeeTimeSetting.query.filter_by(course_id=course_id).first()
    if not setting:
        return jsonify({"error": "No setting found"}), 404
    return setting.to_dict(), 200
