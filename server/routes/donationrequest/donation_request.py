from flask_restful import Api, Resource, reqparse
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import request
from server.models.donation_request import DonationRequest
from server.models.user import User
from server.extensions import db
from server.utils.helpers import paginate
from . import donationrequest_bp



api = Api(donationrequest_bp)

# Parser
parser = reqparse.RequestParser()
parser.add_argument('title', type=str, required=True)
parser.add_argument('description', type=str, required=True, help='Description is required')
parser.add_argument('category_id', type=int, required=True)
parser.add_argument('amount_requested', type=float, required=True)

class DonationRequestListResource(Resource):
    @jwt_required()
    def post(self):
        identity= get_jwt_identity()
        user = db.session.get(User,identity)

        if user.role != "ngo":
            return {"error": "Only NGOs can create donation requests."}, 403

        data = parser.parse_args()
        new_request = DonationRequest(
            title=data['title'],
            description=data['description'],
            category_id=data['category_id'],
            amount_requested=data['amount_requested'],
            ngo_id=user.id
        )
        db.session.add(new_request)
        db.session.commit()

        return new_request.to_dict(), 201

    @jwt_required()
    def get(self):
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))

        query = DonationRequest.query.filter_by(is_approved=True)
        paginated = paginate(query, page, limit)

        return paginated, 200 


class DonationRequestApprovalResource(Resource):
    @jwt_required()
    def patch(self, id):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if user.role != "admin":
            return {"error": "Only admins can approve requests."}, 403

        donation_request = DonationRequest.query.get_or_404(id)
        data = request.get_json()

        donation_request.is_approved = data.get('is_approved', donation_request.is_approved)
        db.session.commit()

        return donation_request.to_dict(), 200


# Register endpoints to API
api.add_resource(DonationRequestListResource, '/requests')
api.add_resource(DonationRequestApprovalResource, '/requests/<int:id>')
