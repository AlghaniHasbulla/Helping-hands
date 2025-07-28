from flask import  request
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from server.models.donation_request import DonationRequest
from server.models.user import User
from server.extensions import db
from . import admin_bp


api = Api(admin_bp)

def is_admin(user_id):
    user = User.query.get(user_id)
    return user and user.role == 'admin'

class DonationRequestApprovalResource(Resource):
    @jwt_required()
    def patch(self, id):
        user_id = get_jwt_identity()
        if not is_admin(user_id):
            return {"error": "Only admins can approve donation requests."}, 403

        donation_request = DonationRequest.query.get_or_404(id)
        data = request.get_json()

        # Default to True if no input
        is_approved = data.get('is_approved', True)
        donation_request.is_approved = is_approved
        db.session.commit()

        return donation_request.to_dict(), 200

api.add_resource(DonationRequestApprovalResource, '/admin/requests/<int:id>/approve')
