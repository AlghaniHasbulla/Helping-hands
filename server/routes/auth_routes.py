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
from server.services.cloudinary_service import upload_image

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
# auth_routes.py - Update VerifyEmail resource
class VerifyEmail(Resource):
    def post(self):
        token = request.json.get('token')
        code = request.json.get('code')
        email = request.json.get('email')

        if not email:
            return {"error": "Email is required"}, 400
        
        user = User.query.filter_by(email=email).first()
        
        if not user:
            return {"error": "User not found"}, 404
        
        # Handle token verification
        if token:
            if (user.verification_token == token and 
                user.verification_token_expiry > datetime.utcnow()):
                return verify_user(user)
            return {"error": "Invalid or expired token"}, 400
        
        # Handle code verification
        if code:
            if (user.verification_code == code and 
                user.verification_token_expiry > datetime.utcnow()):
                return verify_user(user)
            return {"error": "Invalid or expired code"}, 400
        
        return {"error": "Token or code required"}, 400

def verify_user(user):
    user.is_verified = True
    user.verification_token = None
    user.verification_code = None
    user.verification_token_expiry = None
    db.session.commit()
    
    access_token = create_access_token(identity=user.id)
    return {
        "message": "Email verified successfully",
        "access_token": access_token,
        "user": user.to_dict()
    }, 200

# resend verification    
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
                "full_name": user.full_name,
                "avatar_url":user.avatar_url
            }
        }, 200
    

class UploadAvatar(Resource):
    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user:
            return {"msg": "User not found"}, 404

        if 'avatar' not in request.files:
            return {"error": "No file part in the request"}, 400

        file = request.files['avatar']

        if file.filename == '':
            return {"error": "No selected file"}, 400

        result, status_code = upload_image(file)
        if status_code != 200:
            return result, status_code

        # Save avatar URL to user
        user.avatar_url = result['url']
        db.session.commit()

        return {"message": "Avatar uploaded successfully", "avatar_url": user.avatar_url}, 200    

# Register auth routes
auth_api.add_resource(Register, '/register')
auth_api.add_resource(Login, '/login')
auth_api.add_resource(VerifyEmail, '/verify-email')
auth_api.add_resource(Dashboard, '/dashboard')
auth_api.add_resource(ResendVerification, '/resend-verification')
auth_api.add_resource(UploadAvatar, '/upload-avatar')

