from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from server.extensions import db
from sqlalchemy_serializer import SerializerMixin

bcrypt = Bcrypt()

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), default='donor') 
    is_verified = db.Column(db.Boolean, default=False)
    avatar_url = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    verification_token = db.Column(db.String, nullable=True)
    verification_token_expiry = db.Column(db.DateTime, nullable=True)
    verification_code = db.Column(db.String(6), nullable=True)
    phone = db.Column(db.String(20))
    address = db.Column(db.String(200))
    city = db.Column(db.String(100))
    state = db.Column(db.String(100))
    country = db.Column(db.String(100))
    postal_code = db.Column(db.String(20))
    bio = db.Column(db.Text)
    website = db.Column(db.String(200))
    twitter = db.Column(db.String(100))
    facebook = db.Column(db.String(100))
    linkedin = db.Column(db.String(100))
    instagram = db.Column(db.String(100))

    donation_requests = db.relationship('DonationRequest', back_populates='ngo', lazy=True)
  
    # Admin activity relationships
    performed_actions = db.relationship(
        'AdminActionLog',
        foreign_keys='AdminActionLog.actor_id',
        back_populates='actor',
        lazy=True
    )

    # Add soft delete functionality
    is_active = db.Column(db.Boolean, default=True)
    deactivated_at = db.Column(db.DateTime)
    
    # Add donation statistics
    total_donations = db.Column(db.Float, default=0.0)
    last_donation_at = db.Column(db.DateTime)

    targeted_by_actions = db.relationship(
        'AdminActionLog',
        foreign_keys='AdminActionLog.target_user_id',
        back_populates='target',
        lazy=True
    )
    causes = db.relationship('Cause', back_populates='ngo', lazy=True)
    events = db.relationship('Event', back_populates='ngo', lazy=True)

    donations = db.relationship(
        'Donation', 
        back_populates='donor', 
        lazy=True,
        order_by='desc(Donation.donated_at)'
    )

    serialize_rules = (
    '-causes.ngo',
    '-causes.events.cause',
    '-events.ngo',
    '-events.cause',
    '-donation_requests.ngo',
    '-performed_actions.actor',
    '-targeted_by_actions.target'
    '-password_hash',
    '-verification_token',
    '-verification_token_expiry',
    '-is_active',
    '-donations.donor',
    '-donations.donation_request',
    )

    # Add method to calculate total donations
    def calculate_total_donations(self):
        total = sum(donation.amount for donation in self.donations)
        self.total_donations = total
        if self.donations:
            self.last_donation_at = max(donation.donated_at for donation in self.donations)
        return total

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)
