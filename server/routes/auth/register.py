from flask_restful import Resource, Api
from flask import request
from server.extensions import db
from server.models import User
from server.utils.validators import validate_register
from server.services.email_service import send_verification_email

from server.services.cloudinary_service import upload_image
from . import auth_bp

api = Api(auth_bp)
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

api.add_resource(Register, '/register')