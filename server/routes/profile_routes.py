from flask import Blueprint, request
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from server.models.user import User
from server.extensions import db
from server.services.cloudinary_service import upload_image

# Blueprint and API setup
profile_bp = Blueprint('profile', __name__)
api = Api(profile_bp)

class ProfileResource(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            return {"error": "User not found"}, 404

        return {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
            "avatar_url": user.avatar_url,
            "is_verified": user.is_verified,
            "created_at": user.created_at.isoformat()
        }, 200

    @jwt_required()
    def put(self):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            return {"error": "User not found"}, 404

        data = request.form or request.get_json()

        # Update username if provided
        if 'username' in data:
            user.username = data['username']

        # Update password if provided
        if 'password' in data:
            user.set_password(data['password'])

        # Handle avatar upload via Cloudinary
        if 'avatar' in request.files:
            image_file = request.files['avatar']
            avatar_url = upload_image(image_file)
            user.avatar_url = avatar_url

        db.session.commit()
        return {"msg": "Profile updated successfully"}, 200

# Register the resource route
api.add_resource(ProfileResource, '/profile')
