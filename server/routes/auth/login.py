from flask_restful import Resource, Api
from flask import request
from flask_jwt_extended import create_access_token
from server.models import User
from server.utils.validators import validate_login
from . import auth_bp

api = Api(auth_bp)

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
                "full_name": user.full_name,
                "avatar_url": user.avatar_url,  # Make sure this is included
                "is_verified": user.is_verified,
                "phone": user.phone,
                "bio": user.bio,
                "address": user.address,
                "city": user.city,
                "state": user.state,
                "country": user.country,
                "postal_code": user.postal_code,
                "website": user.website,
                "twitter": user.twitter,
                "facebook": user.facebook,
                "linkedin": user.linkedin,
                "instagram": user.instagram,
                "created_at": user.created_at.isoformat() if user.created_at else None,
                "total_donations": user.total_donations or 0
            }
        }, 200
    
api.add_resource(Login, '/login') 
