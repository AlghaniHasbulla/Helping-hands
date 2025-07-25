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

    donation_requests = db.relationship('DonationRequest', back_populates='ngo', lazy=True)
  
    # Admin activity relationships
    performed_actions = db.relationship(
        'AdminActionLog',
        foreign_keys='AdminActionLog.actor_id',
        back_populates='actor',
        lazy=True
    )

    targeted_by_actions = db.relationship(
        'AdminActionLog',
        foreign_keys='AdminActionLog.target_user_id',
        back_populates='target',
        lazy=True
    )
    causes = db.relationship('Cause', back_populates='ngo', lazy=True)
    events = db.relationship('Event', back_populates='ngo', lazy=True)

    serialize_rules = ('-causes.ngo', '-events.ngo', '-donation_requests.ngo', '-performed_actions.actor', '-targeted_by_actions.target')


    

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)
