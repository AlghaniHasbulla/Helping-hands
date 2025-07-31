from flask import  request
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from server.models.donation_request import DonationRequest
from server.models.user import User
from server.extensions import db
from . import admin_bp

from server.utils.swagger_docs import jwt_required_docs


api = Api(admin_bp)

def has_admin_privilege(user_id):
    user = User.query.get(user_id)
    return user and user.role in ['admin', 'superadmin']

class DonationRequestApprovalResource(Resource):
    @jwt_required()
    @jwt_required_docs(
         summary="Approve/Disapprove Donation Request",
        description="Allows an admin or superadmin to approve or disapprove a donation request by ID.",
        tags=["Admin"],
        params=[
            {
                "name": "id",
                "in": "path",
                "type": "integer",
                "required": True,
                "description": "Donation Request ID"
            }
        ],
        request_body={
            "type": "object",
            "properties": {
                "is_approved": {
                    "type": "boolean",
                    "example": True
                }
            },
            "required": ["is_approved"]
        },
        responses={
            "200": {
                "description": "Approval status updated",
                "schema": {
                    "type": "object",
                    "properties": {
                        "id": {"type": "integer"},
                        "is_approved": {"type": "boolean"}
                    }
                }
            },
            "403": {"description": "Only admins can approve donation requests"},
            "404": {"description": "Donation request not found"},
        }

    )

    def patch(self, id):

        user_id = get_jwt_identity()
        if not has_admin_privilege(user_id):
            return {"error": "Only admins or superadmins can approve donation requests."}, 403

        donation_request = DonationRequest.query.get_or_404(id)
        data = request.get_json()

        # Default to True if no input
        is_approved = data.get('is_approved', True)
        donation_request.is_approved = is_approved
        db.session.commit()

        return donation_request.to_dict(), 200

api.add_resource(DonationRequestApprovalResource, '/admin/requests/<int:id>/approve')
