from flask_jwt_extended import ( create_access_token)
from server.extensions import db


def verify_user(user):
    user.is_verified = True
    user.verification_token = None
    user.verification_code = None
    user.verification_token_expiry = None
    db.session.commit()
    
    access_token = create_access_token(identity=user.id)
    return {
        "message": "Email verified successfully",
        "access_token": access_token,
        "user": user.to_dict()
    }, 200