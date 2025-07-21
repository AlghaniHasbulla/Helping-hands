from server.extensions import db
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime

class DonationRequest(db.Model, SerializerMixin):
    __tablename__ = 'donation_requests'


    id = db.Column(db.Integer, primary_key=True)
    ngo_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    amount_requested = db.Column(db.Float, nullable=False)
    is_approved = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    donations = db.relationship(
        'Donation',
        backref='donation_request',
        lazy=True,
        cascade='all, delete'
    )
    serialize_rules = (
        '-ngo.donation_requests',
        '-category.donation_requests',
        '-donations.donation_request'
    )
