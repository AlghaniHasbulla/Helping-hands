from flask import Blueprint, request
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from server.models.category import Category
from server.models.user import User
from server.extensions import db

admin_bp = Blueprint('admin_categories', __name__)
api = Api(admin_bp)

def is_admin(user_id):
    user = User.query.get(user_id)
    return user and user.role == 'admin'

class CategoryListResource(Resource):
    @jwt_required()
    def get(self):
        return [c.to_dict() for c in Category.query.all()], 200

    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        if not is_admin(user_id):
            return {"error": "Only admins can create categories."}, 403

        data = request.get_json()
        category = Category(
            name=data.get('name'),
            description=data.get('description')
        )
        db.session.add(category)
        db.session.commit()
        return category.to_dict(), 201

class CategoryResource(Resource):
    @jwt_required()
    def patch(self, id):
        user_id = get_jwt_identity()
        if not is_admin(user_id):
            return {"error": "Only admins can update categories."}, 403

        category = Category.query.get_or_404(id)
        data = request.get_json()
        category.name = data.get('name', category.name)
        category.description = data.get('description', category.description)
        db.session.commit()
        return category.to_dict(), 200

    @jwt_required()
    def delete(self, id):
        user_id = get_jwt_identity()
        if not is_admin(user_id):
            return {"error": "Only admins can delete categories."}, 403

        category = Category.query.get_or_404(id)
        db.session.delete(category)
        db.session.commit()
        return {"message": "Category deleted"}, 200

# Register routes
api.add_resource(CategoryListResource, '/admin/categories')
api.add_resource(CategoryResource, '/admin/categories/<int:id>')
