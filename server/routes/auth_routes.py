from flask_restful import Resource, Api
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from server.extensions import db
from server.models import User
from server.utils.validators import validate_register, validate_login
from services.email_service import send_verification_email

# Set up the blueprint and API
auth_bp = Blueprint('auth', __name__)
auth_api = Api(auth_bp)

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

        send_verification_email(new_user)
        return {"msg": "User registered. Check email for verification."}, 201

class Login(Resource):
    def post(self):
        data = request.get_json()

        if not validate_login(data):
            return {"msg": "Invalid input"}, 400

        user = User.query.filter_by(email=data['email']).first()
        if not user or not user.check_password(data['password']):
            return {"msg": "Invalid credentials"}, 401

        access_token = create_access_token(identity=user.id)
        return {
            "access_token": access_token,
            "user": {
                "id": user.id,
                "email": user.email,
                "role": user.role,
                "full_name": user.full_name
            }
        }, 200

class VerifyEmail(Resource):
    def post(self):
        token = request.json.get('token')
        # Implement token decoding and verification logic here
        return {"msg": "Email verified successfully!"}, 200

# Register the routes with the Flask-RESTful API
auth_api.add_resource(Register, '/register')
auth_api.add_resource(Login, '/login')
auth_api.add_resource(VerifyEmail, '/verify-email')
