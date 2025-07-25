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
from datetime import datetime

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
    def post(self):
        token = request.json.get('token')

        if not token:
            return {"error": "Missing token"}, 400

        user = User.query.filter_by(verification_token=token).first()

        if not user:
            return {"error": "Invalid token"}, 404

        if user.verification_token_expiry and user.verification_token_expiry < datetime.utcnow():
            return {"error": "Token has expired"}, 403

        user.is_verified = True
        user.verification_token = None
        user.verification_token_expiry = None
        db.session.commit()

        return {"message": "Email verified successfully"}, 200
# resennd verification    
class ResendVerification(Resource):
    def post(self):
        data = request.get_json()
        email = data.get('email')

        if not email:
            return {"error": "Email is required"}, 400

        user = User.query.filter_by(email=email).first()

        if not user:
            return {"error": "No user found with that email"}, 404

        if user.is_verified:
            return {"message": "Email is already verified"}, 200

        # Send a fresh token
        send_verification_email(user)

        return {"message": "Verification email resent"}, 200


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
auth_api.add_resource(ResendVerification, '/resend-verification')
