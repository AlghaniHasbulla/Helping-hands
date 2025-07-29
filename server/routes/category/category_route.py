from flask_restful import Api, Resource
from server.models.category import Category
from . import category_bp

api = Api(category_bp)

class CategoryListResource(Resource):
    def get(self):
        categories = Category.query.all()
        return [category.to_dict() for category in categories], 200

api.add_resource(CategoryListResource, '/categories')
