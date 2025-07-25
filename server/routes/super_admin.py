from flask import Blueprint, request
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from server.models.user import User
from server.extensions import db
from server.utils.role_helpers import is_superadmin, log_admin_action

super_admin_bp = Blueprint('super_admin', __name__)
api = Api(super_admin_bp)

class UserListResource(Resource):
    @jwt_required()
    def get(self):
        admin_id = get_jwt_identity()
        if not is_superadmin(admin_id):
            return {"error": "Access denied"}, 403

        users = User.query.all()
        return [u.to_dict() for u in users], 200

    @jwt_required()
    def post(self):
        admin_id = get_jwt_identity()
        if not is_superadmin(admin_id):
            return {"error": "Access denied"}, 403

        data = request.get_json()
        if not data.get("email") or not data.get("password") or not data.get("role"):
            return {"error": "Email, password, and role are required"}, 400

        if User.query.filter_by(email=data["email"]).first():
            return {"error": "Email already in use"}, 400

        user = User(
            full_name=data.get("full_name", "Unnamed User"),
            email=data["email"],
            role=data["role"],
            is_verified=True
        )
        user.set_password(data["password"])
        db.session.add(user)
        db.session.commit()

        log_admin_action(admin_id, f"Created user with role '{user.role}'", target_user_id=user.id)
        return user.to_dict(), 201

class UserResource(Resource):
    @jwt_required()
    def patch(self, id):
        admin_id = get_jwt_identity()
        if not is_superadmin(admin_id):
            return {"error": "Access denied"}, 403

        user = User.query.get_or_404(id)
        data = request.get_json()

        updated_fields = []

        if "full_name" in data:
            user.full_name = data["full_name"]
            updated_fields.append("full_name")

        if "role" in data:
            user.role = data["role"]
            updated_fields.append("role")

        if "is_verified" in data:
            user.is_verified = data["is_verified"]
            updated_fields.append("is_verified")

        db.session.commit()

        if updated_fields:
            log_admin_action(admin_id, f"Updated fields: {', '.join(updated_fields)}", target_user_id=user.id)

        return user.to_dict(), 200

    @jwt_required()
    def delete(self, id):
        admin_id = get_jwt_identity()
        if not is_superadmin(admin_id):
            return {"error": "Access denied"}, 403

        user = User.query.get_or_404(id)
        db.session.delete(user)
        db.session.commit()

        log_admin_action(admin_id, "Deleted user", target_user_id=user.id)
        return {"message": "User deleted"}, 200

# Register resources
api.add_resource(UserListResource, '/superadmin/users')
api.add_resource(UserResource, '/superadmin/users/<int:id>')
