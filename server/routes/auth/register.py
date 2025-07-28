from flask_restful import Resource
from flask import request
from server.extensions import db
from server.models import User
from server.utils.validators import validate_register
from server.services.email_service import send_verification_email
from server.services.cloudinary_service import upload_image
from datetime import datetime, timedelta
import uuid
import re

class Register(Resource):
    def post(self):
        # Handle multipart form data
        form_data = request.form
        avatar_file = request.files.get('avatar')
        
        # Prepare data dictionary
        data = {
            'full_name': form_data.get('full_name'),
            'email': form_data.get('email'),
            'password': form_data.get('password'),
            'role': form_data.get('role', 'donor'),
            'phone': form_data.get('phone'),
            'address': form_data.get('address'),
            'city': form_data.get('city'),
            'state': form_data.get('state'),
            'country': form_data.get('country'),
            'postal_code': form_data.get('postal_code'),
            'bio': form_data.get('bio'),
            'website': form_data.get('website'),
            'twitter': form_data.get('twitter'),
            'facebook': form_data.get('facebook'),
            'linkedin': form_data.get('linkedin'),
            'instagram': form_data.get('instagram')
        }
        
        # Validate input
        validation_result, error_msg = validate_register(data)
        if not validation_result:
            return {"msg": error_msg}, 400

        # Check for duplicate email
        if User.query.filter_by(email=data['email']).first():
            return {"msg": "Email already registered"}, 409

        # Handle avatar upload
        avatar_url = None
        if avatar_file:
            try:
                upload_result = upload_image(avatar_file)
                avatar_url = upload_result.get('url')
            except Exception as e:
                return {"msg": f"Avatar upload failed: {str(e)}"}, 500

        # Create new user
        verification_token = str(uuid.uuid4())
        new_user = User(
            full_name=data['full_name'],
            email=data['email'],
            role=data['role'],
            avatar_url=avatar_url,
            verification_token=verification_token,
            verification_token_expiry=datetime.utcnow() + timedelta(hours=24),
            phone=data['phone'],
            address=data['address'],
            city=data['city'],
            state=data['state'],
            country=data['country'],
            postal_code=data['postal_code'],
            bio=data['bio'],
            website=data['website'],
            twitter=data['twitter'],
            facebook=data['facebook'],
            linkedin=data['linkedin'],
            instagram=data['instagram']
        )
        new_user.set_password(data['password'])
        
        db.session.add(new_user)
        
        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            return {"msg": f"Database error: {str(e)}"}, 500

        # Send verification email
        try:
            send_verification_email(new_user)
        except Exception as e:
            # Log the error but don't fail registration
            current_app.logger.error(f"Failed to send verification email: {str(e)}")

        return {
            "msg": "Registration successful! Please check your email for verification instructions.",
            "email": new_user.email
        }, 201