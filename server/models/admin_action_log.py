from server.extensions import db
from datetime import datetime
from sqlalchemy_serializer import SerializerMixin

class AdminActionLog(db.Model,SerializerMixin):
    __tablename__ = 'admin_action_logs'

    id = db.Column(db.Integer, primary_key=True)
    actor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    action = db.Column(db.String(255), nullable=False)
    target_user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    actor = db.relationship('User', foreign_keys=[actor_id], back_populates='performed_actions')
    target = db.relationship('User', foreign_keys=[target_user_id], back_populates='targeted_by_actions')

    serialize_rules = (
        '-actor.performed_actions',  
        '-target.targeted_by_actions',
    )


