from flask_restful import Resource, Api
from flask import  request
from server.models import User
from datetime import datetime
from server.utils.verify_user import verify_user
from . import auth_bp


api = Api(auth_bp)
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
    

api.add_resource(VerifyEmail, '/verify-email')    