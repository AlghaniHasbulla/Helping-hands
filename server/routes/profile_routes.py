from flask import Blueprint, request
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from server.models.user import User
from server.extensions import db
from server.services.cloudinary_service import upload_image

# Blueprint and API setup
profile_bp = Blueprint('profile', __name__)
api = Api(profile_bp)

# profile_routes.py - Update ProfileResource

class ProfileResource(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            return {"error": "User not found"}, 404

        return {
            "id": user.id,
            "full_name": user.full_name,
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

        data = request.form
        
        # Handle file upload
        if 'avatar' in request.files:
            image_file = request.files['avatar']
            upload_result, status_code = upload_image(image_file)
            if status_code != 200:
                return upload_result, status_code
            user.avatar_url = upload_result['url']
        
        # Handle other fields
        if "full_name" in data:
            user.full_name = data["full_name"]
        
        if "password" in data and data["password"]:
            user.set_password(data["password"])
        
        db.session.commit()
        return {"msg": "Profile updated successfully"}, 200

# Register the resource route
api.add_resource(ProfileResource, '/profile')
