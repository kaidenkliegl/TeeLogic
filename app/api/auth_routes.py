from flask import Blueprint, request, jsonify
from app.models import User, db
from app.forms import LoginForm, SignUpForm
from flask_login import current_user, login_user, logout_user, login_required

auth_routes = Blueprint('auth', __name__)


@auth_routes.route('/')
def authenticate():
    """
    Authenticates a user.
    """
    if current_user.is_authenticated:
        return current_user.to_dict()
    return {'errors': {'message': 'Unauthorized'}}, 401


@auth_routes.route('/login', methods=['POST'])
def login():
    """
    Logs a user in
    """
    form = LoginForm()
    form['csrf_token'].data = request.cookies.get('csrf_token')

    if form.validate_on_submit():
        user = User.query.filter(User.email == form.data['email']).first()
        if user and user.check_password(form.data['password']):
            login_user(user)
            return user.to_dict()
    return {'errors': {'message': 'Invalid credentials'}}, 401


@auth_routes.route('/logout')
@login_required
def logout():
    """
    Logs a user out
    """
    logout_user()
    return {'message': 'User logged out'}


@auth_routes.route('/signup', methods=['POST'])
def sign_up():
    form = SignUpForm()
    form['csrf_token'].data = request.cookies.get('csrf_token')

    if form.validate_on_submit():
        # Assign course_id from the current user or fallback to default
        course_id = getattr(current_user, 'course_id', 1)

        user = User(
            username=form.data['username'],
            email=form.data['email'],
            password=form.data['password'],
            role=form.data['role'],
            course_id=course_id
        )
        db.session.add(user)
        db.session.commit()
        return user.to_dict()
    
    return form.errors, 400



@auth_routes.route('/unauthorized')
def unauthorized():
    """
    Returns unauthorized JSON when flask-login authentication fails
    """
    return {'errors': {'message': 'Unauthorized'}}, 401
