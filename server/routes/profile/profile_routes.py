from flask import request
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from server.extensions import db
from server.services.cloudinary_service import upload_image
from . import profile_bp
from server.models import User, Donation, DonationRequest
from datetime import datetime
from flask_cors import cross_origin



api = Api(profile_bp)

# profile_routes.py - Update ProfileResource

class ProfileResource(Resource):
    @jwt_required()
    # @cross_origin(origins="https://helpinghands-umber.vercel.app", supports_credentials=True)
    
    def get(self):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            return {"error": "User not found"}, 404
        
        # Calculate statistics
        user.calculate_total_donations()
        
        # Get last 5 donations with donation request details
        donations = Donation.query.filter_by(donor_id=user_id)\
                        .join(DonationRequest)\
                        .add_columns(
                            DonationRequest.title,
                            DonationRequest.description,
                            DonationRequest.image_url
                        )\
                        .order_by(Donation.donated_at.desc())\
                        .limit(5)\
                        .all()
        
        donation_history = []
        for donation, title, description, image_url in donations:
            donation_history.append({
                "id": donation.id,
                "amount": donation.amount,
                "donated_at": donation.donated_at.isoformat(),
                "title": title,
                "description": description,
                "image_url": image_url
            })
        import sys
        print("User object fields:", file=sys.stderr)
        print(user.__dict__, file=sys.stderr)

        
        return {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role,
            "avatar_url": user.avatar_url,
            "is_verified": user.is_verified,
            "created_at": user.created_at.isoformat() if user.created_at else None,
            "phone": user.phone,
            "address": user.address,
            "city": user.city,
            "state": user.state,
            "country": user.country,
            "postal_code": user.postal_code,
            "bio": user.bio,
            "website": user.website,
            "twitter": user.twitter,
            "facebook": user.facebook,
            "linkedin": user.linkedin,
            "instagram": user.instagram,
            "total_donations": user.total_donations,
            "last_donation_at": user.last_donation_at.isoformat() if user.last_donation_at else None,
            "donation_history": donation_history
        }, 200

    @jwt_required()
    def put(self):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            return {"error": "User not found"}, 404

        data = request.form
        files = request.files
        
        # Update personal info
        fields = [
            'full_name', 'phone', 'address', 'city', 
            'state', 'country', 'postal_code', 'bio',
            'website', 'twitter', 'facebook', 'linkedin', 'instagram'
        ]
        
        for field in fields:
            if field in data:
                setattr(user, field, data[field])
        
        # Handle password change
        if 'password' in data and data['password']:
            if 'current_password' not in data or not user.check_password(data['current_password']):
                return {"error": "Current password is incorrect"}, 400
            user.set_password(data['password'])
        
        # Handle avatar upload
        if 'avatar' in files:
            image_file = files['avatar']
            upload_result, status_code = upload_image(image_file)
            if status_code != 200:
                return upload_result, status_code
            user.avatar_url = upload_result['url']
        
        db.session.commit()
        return {"msg": "Profile updated successfully"}, 200

class ProfileDeleteResource(Resource):
    @jwt_required()
    def delete(self):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            return {"error": "User not found"}, 404
            
        # Soft delete user
        user.is_active = False
        user.deactivated_at = datetime.utcnow()
        db.session.commit()
        
        return {"message": "Account deactivated successfully"}, 200

# Register routes
api.add_resource(ProfileResource, '/profile')
api.add_resource(ProfileDeleteResource, '/profile/delete')
