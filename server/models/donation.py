from server.extensions import db
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime

class Donation(db.Model, SerializerMixin):
    __tablename__ = 'donations'

   

    id = db.Column(db.Integer, primary_key=True)
    donor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    donation_request_id = db.Column(db.Integer, db.ForeignKey('donation_requests.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    donated_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # rships
    donor = db.relationship('User', back_populates='donations', lazy=True)
    donation_request = db.relationship('DonationRequest', back_populates='donations', lazy=True)

    serialize_rules = (
        '-donor.donations',
        '-donation_request.donations',
    )