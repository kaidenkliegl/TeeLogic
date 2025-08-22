from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, Note

note_routes = Blueprint("notes", __name__, url_prefix="/api/notes")

# Get the single note for a tee time
@note_routes.route("/tee-time/<int:tee_time_id>", methods=["GET"])
@login_required
def get_note_for_tee_time(tee_time_id):
    note = Note.query.filter_by(tee_time_id=tee_time_id).first()
    if not note:
        return jsonify({"message": "No note yet"}), 200
    return jsonify(note.to_dict()), 200


# Create or Update a note for a tee time
@note_routes.route("/tee-time/<int:tee_time_id>", methods=["POST", "PUT"])
@login_required
def create_or_update_note(tee_time_id):
    data = request.get_json()
    content = data.get("content", "").strip()

    if not content:
        return jsonify({"error": "Content cannot be empty"}), 400

    # Check if note already exists for this tee time
    note = Note.query.filter_by(tee_time_id=tee_time_id).first()

    if note:
        # Update existing
        if note.author_id != current_user.id:
            return jsonify({"error": "Unauthorized"}), 403
        note.content = content
    else:
        # Create new
        note = Note(
            content=content,
            author_id=current_user.id,
            tee_time_id=tee_time_id
        )
        db.session.add(note)

    db.session.commit()
    return jsonify(note.to_dict()), 200


# Delete a note 
@note_routes.route("/tee-time/<int:tee_time_id>", methods=["DELETE"])
@login_required
def delete_note_for_tee_time(tee_time_id):
    note = Note.query.filter_by(tee_time_id=tee_time_id).first()
    if not note:
        return jsonify({"error": "Note not found"}), 404
    if note.author_id != current_user.id:
        return jsonify({"error": "Unauthorized"}), 403

    db.session.delete(note)
    db.session.commit()
    return jsonify({"message": "Note deleted"}), 200
