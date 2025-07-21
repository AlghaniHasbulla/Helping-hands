from flask import Blueprint, request
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from server.extensions import db
from server.models.donation import Donation
from server.models.user import User
from server.models.donation_request import DonationRequest
from server.utils.helpers import paginate

donations_bp = Blueprint('donations', __name__)
api = Api(donations_bp)

class DonationCreateResource(Resource):
    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user or user.role != 'donor':
            return {"error": "Only donors can make donations"}, 403

        data = request.get_json()
        donation_request_id = data.get('donation_request_id')
        amount = data.get('amount')

        donation_request = DonationRequest.query.get(donation_request_id)
        if not donation_request or not donation_request.is_approved:
            return {"error": "Invalid or unapproved donation request"}, 400

        donation = Donation(
            donor_id=user.id,
            donation_request_id=donation_request_id,
            amount=amount
        )
        db.session.add(donation)
        db.session.commit()

        return donation.to_dict(), 201

# get donations
class DonationListResource(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user or user.role != 'donor':
            return {"error": "Only donors can view donations"}, 403

        # Pagination params
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))

        query = Donation.query.filter_by(donor_id=user.id)
        paginated = paginate(query, page, limit)

        return paginated, 200


# register
api.add_resource(DonationCreateResource, '/donate')
api.add_resource(DonationListResource, '/donations')
