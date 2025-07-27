from flask import Blueprint, request
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from server.models import User, DonationRequest, Donation,Category
from server.extensions import db


ngo_bp = Blueprint('ngo', __name__)
ngo_api = Api(ngo_bp)

def is_ngo(user_id):
    user = User.query.get(user_id)
    return user and user.role == 'ngo'

class CreateDonationRequest(Resource):
    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        if not is_ngo(user_id):
            return {"error": "Only NGOs can create donation requests"}, 403

        data = request.get_json()
        title = data.get("title")
        description = data.get("description")
        category_id = data.get("category_id")
        amount_requested = data.get("amount_requested")

        if not all([title, description, category_id, amount_requested]):
            return {"error": "All fields (title, description, category_id, amount_requested) are required"}, 400

        # Optionally validate category exists
        category = Category.query.get(category_id)
        if not category:
            return {"error": "Invalid category ID"}, 404

        donation_request = DonationRequest(
            title=title,
            description=description,
            category_id=category_id,
            amount_requested=amount_requested,
            ngo_id=user_id
        )

        db.session.add(donation_request)
        db.session.commit()

        return donation_request.to_dict(), 201

class MyDonationRequests(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        if not is_ngo(user_id):
            return {"error": "Only NGOs can view their requests"}, 403

        requests = DonationRequest.query.filter_by(ngo_id=user_id).all()
        return [r.to_dict() for r in requests], 200
