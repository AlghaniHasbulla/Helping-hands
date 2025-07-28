from flask_restful import Resource, Api
from flask import  request
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)
from server.extensions import db
from server.models import User
from server.services.cloudinary_service import upload_image
from . import auth_bp


api = Api(auth_bp)
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
    
api.add_resource(UploadAvatar, '/upload-avatar')
