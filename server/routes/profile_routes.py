from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from server.models.user import User
from services.cloudinary_service import upload_image
from app import db


profile_bp = Blueprint('profile', __name__)

@profile_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    return jsonify({
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role,
        "avatar_url": user.avatar_url
    }), 200

@profile_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    data = request.get_json()
    user = User.query.get(user_id)

    if 'full_name' in data:
        user.full_name = data['full_name']
    if 'password' in data:
        user.set_password(data['password'])

    if 'avatar' in request.files:
        avatar_url = upload_image(request.files['avatar'])
        user.avatar_url = avatar_url

    db.session.commit()
    return jsonify({"msg": "Profile updated"}), 200
