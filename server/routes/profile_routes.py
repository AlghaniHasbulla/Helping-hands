from flask import Blueprint, request, jsonify
from flask_restful import Resource, Api
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User, db
from services.cloudinary_service import upload_image
from app import db

profile_bp = Blueprint('profile', __name__)
api = Api(profile_bp)

class ProfileResource(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user:
            return {"msg": "User not found"}, 404

        return {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role,
            "avatar_url": user.avatar_url,
            "created_at": user.created_at.isoformat()
        }, 200

    @jwt_required()
    def put(self):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user:
            return {"msg": "User not found"}, 404

        data = request.form
        full_name = data.get('full_name')
        password = data.get('password')

        if full_name:
            user.full_name = full_name

        if password:
            user.set_password(password)

        if 'avatar' in request.files:
            file = request.files['avatar']
            avatar_url = upload_image(file, folder="avatars")
            user.avatar_url = avatar_url

        db.session.commit()

        return {
            "msg": "Profile updated",
            "user": {
                "full_name": user.full_name,
                "email": user.email,
                "avatar_url": user.avatar_url
            }
        }, 200

api.add_resource(ProfileResource, '/profile')
