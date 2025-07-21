from flask import Blueprint, request, jsonify
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
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "avatar_url": user.avatar_url
        }, 200

    @jwt_required()
    def put(self):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            return {"error": "User not found"}, 404

        # Accept JSON or form data
        data = request.form or request.get_json()

        if 'full_name' in data:
            user.full_name = data['full_name']
        if 'password' in data:
            user.set_password(data['password'])

        if 'avatar' in request.files:
            avatar_url = upload_image(request.files['avatar'])
            user.avatar_url = avatar_url

        db.session.commit()
        return {"msg": "Profile updated"}, 200

# Register resource
api.add_resource(ProfileResource, '/profile')
