from flask import Blueprint, request, jsonify
from server.models import User
from server.extensions import db
from flask_jwt_extended import create_access_token
from utils.validators import validate_register, validate_login
from services.email_service import send_verification_email

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not validate_register(data):
        return jsonify({"msg": "Invalid input"}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({"msg": "Email already taken"}), 400

    new_user = User(
        full_name=data['full_name'],
        email=data['email'],
        role=data.get('role', 'donor')
    )
    new_user.set_password(data['password'])
    db.session.add(new_user)
    db.session.commit()

    send_verification_email(new_user)
    return jsonify({"msg": "User registered. Check email for verification."}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not validate_login(data):
        return jsonify({"msg": "Invalid input"}), 400

    user = User.query.filter_by(email=data['email']).first()
    if not user or not user.check_password(data['password']):
        return jsonify({"msg": "Invalid credentials"}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify(access_token=access_token, user={
        "id": user.id,
        "email": user.email,
        "role": user.role,
        "full_name": user.full_name
    }), 200

@auth_bp.route('/verify-email', methods=['POST'])
def verify_email():
    token = request.json.get('token')
    # Implement token decoding and verification logic here
    return jsonify({"msg": "Email verified successfully!"}), 200
