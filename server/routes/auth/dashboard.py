from flask_restful import Resource, Api
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)
from server.models import User
from . import auth_bp


api = Api(auth_bp)
class Dashboard(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user:
            return {"msg": "User not found"}, 404

        return {
            "msg": f"Welcome, {user.full_name}",
            "user": {
                "id": user.id,
                "email": user.email,
                "role": user.role,
                "full_name": user.full_name,
                "avatar_url":user.avatar_url
            }
        }, 200

api.add_resource(Dashboard, '/dashboard')


