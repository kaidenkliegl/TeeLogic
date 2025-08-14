from flask import Blueprint, request, jsonify
from flask_login import login_required
from app.models import db, TeeTimeSetting
from app.forms import TeeTimeSettingForm


tee_time_settings_routes = Blueprint('tee_time_settings', __name__, url_prefix='/settings')

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


@tee_time_settings_routes.route('/<int:setting_id>', methods=['PUT'])
@login_required
def update_setting():
    form = TeeTimeSettingForm(setting_id)
    form['csrf_token'].data = request.cookies.get('csrf_token')

    if form.validate_on_submit():
        settings = TeeTimeSetting.query.get(setting_id)

        setting.start_time = form.start_time.data
        setting.interval_minutes = form.interval_minutes.data
        setting.max_tee_times = form.max_tee_times.data
        setting.course_id = form.course_id.data

        db.session.commit()
        return setting.to_dict(), 201

    return jsonify({"errors": form.errors}), 400

# Not sure if I really want to delete settings but I will keep it there just in case 
@tee_time_settings_routes.route('/<int:setting_id>', methods=['DELETE'])
@login_required
def delete_setting(setting_id):
    settings = TeeTimeSetting.query.get(setting_id)

    if not settings:
        return jsonify({"error: Settings does note exist."})

    db.session.delete(setting)
    db.session.commit()
    return jsonify({"message": "Tee time setting deleted"}), 200
