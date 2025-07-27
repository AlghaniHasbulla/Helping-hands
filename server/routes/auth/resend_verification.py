from flask_restful import Resource, Api
from flask import request
from server.models import User
from server.services.email_service import send_verification_email

from . import auth_bp

api = Api(auth_bp)
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

api.add_resource(ResendVerification, '/resend-verification')