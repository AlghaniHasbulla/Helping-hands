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

# Deprecate this endpoint in favor of /profile PUT for avatar upload
class UploadAvatar(Resource):
    @jwt_required()
    def post(self):
        return {"error": "This endpoint is deprecated. Please use PUT /profile to upload avatar."}, 410
    
api.add_resource(UploadAvatar, '/upload-avatar')
