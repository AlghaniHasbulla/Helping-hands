from server.extensions import db
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime

class Event(db.Model, SerializerMixin):
    __tablename__ = 'events'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    location = db.Column(db.String(100))
    image_url = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    cause_id = db.Column(db.Integer, db.ForeignKey('causes.id'))
    cause = db.relationship('Cause', back_populates='events')

    ngo_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    ngo = db.relationship('User', back_populates=('events'))

    serialize_rules = ('-ngo.events', '-cause.events')
    
    # expiry date check
    @property
    def is_expired(self):
        return self.date < datetime.utcnow()

