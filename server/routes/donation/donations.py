from flask import request
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from server.extensions import db
from server.models.category import Category
from server.models.donation import Donation
from server.models.user import User
from server.models.donation_request import DonationRequest
from server.utils.helpers import paginate
from . import donation_bp
from sqlalchemy import func

api = Api(donation_bp)

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
    
# Add new endpoints
class DonationStatsResource(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            return {"error": "User not found"}, 404
            
        # Calculate donation statistics
        total_donations = db.session.query(func.sum(Donation.amount))\
                            .filter_by(donor_id=user_id)\
                            .scalar() or 0
                            
        donation_count = Donation.query.filter_by(donor_id=user_id).count()
        
        # Get most donated category
        category_stats = db.session.query(
                DonationRequest.category_id,
                func.sum(Donation.amount).label('total')
            )\
            .join(Donation, Donation.donation_request_id == DonationRequest.id)\
            .filter(Donation.donor_id == user_id)\
            .group_by(DonationRequest.category_id)\
            .order_by(db.desc('total'))\
            .first()
            
        top_category = Category.query.get(category_stats[0]).name if category_stats else "None"
        
        return {
            "total_donations": total_donations,
            "donation_count": donation_count,
            "top_category": top_category,
            "top_category_amount": category_stats[1] if category_stats else 0
        }, 200

# register
api.add_resource(DonationCreateResource, '/donate')
api.add_resource(DonationListResource, '/donations')
api.add_resource(DonationStatsResource, '/donations/stats')
