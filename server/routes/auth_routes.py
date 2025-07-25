from flask_restful import Resource, Api
from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity
)
from server.extensions import db
from server.models import User
from server.utils.validators import validate_register, validate_login
from server.services.email_service import send_verification_email

# Blueprint setup
auth_bp = Blueprint('auth', __name__)
auth_api = Api(auth_bp)

# Register
class Register(Resource):
    def post(self):
        data = request.get_json()

        if not validate_register(data):
            return {"msg": "Invalid input"}, 400

        if User.query.filter_by(email=data['email']).first():
            return {"msg": "Email already taken"}, 400

        new_user = User(
            full_name=data['full_name'],
            email=data['email'],
            role=data.get('role', 'donor')
        )
        new_user.set_password(data['password'])
        db.session.add(new_user)
        db.session.commit()

        # Send verification email
        send_verification_email(new_user)

        return {"msg": "User registered. Check email for verification."}, 201

# Login
class Login(Resource):
    def post(self):
        data = request.get_json()

        if not validate_login(data):
            return {"msg": "Invalid input"}, 400

        user = User.query.filter_by(email=data['email']).first()

        if not user or not user.check_password(data['password']):
            return {"msg": "Invalid credentials"}, 401

        if not user.is_verified:
            return {"msg": "Email is not verified"}, 403

        access_token = create_access_token(identity=user.id)

        return {
            "msg": f"Welcome back, {user.full_name}",
            "access_token": access_token,
            "user": {
                "id": user.id,
                "email": user.email,
                "role": user.role,
                "full_name": user.full_name
            }
        }, 200

# Email verification
class VerifyEmail(Resource):
    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        token = request.json.get('token')

        # (Optional) logic to check if token is valid

        return {"msg": f"Email verified successfully for user {user_id}!"}, 200

# Dashboard
class Dashboard(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user:
            return {"msg": "User not found"}, 404

        return {
            "msg": f"Welcome, {user.full_name}",
            "user": {
                "id": user.id,
                "email": user.email,
                "role": user.role,
                "full_name": user.full_name
            }
        }, 200

# Register auth routes
auth_api.add_resource(Register, '/register')
auth_api.add_resource(Login, '/login')
auth_api.add_resource(VerifyEmail, '/verify-email')
auth_api.add_resource(Dashboard, '/dashboard')
