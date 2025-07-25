from datetime import datetime
from server.extensions import db
from sqlalchemy_serializer import SerializerMixin

class Cause(db.Model, SerializerMixin):
    __tablename__ = 'causes'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    ngo_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    ngo = db.relationship('User',back_populates='causes')

    events = db.relationship('Event', back_populates='cause', cascade='all, delete-orphan')
    amount_target = db.Column(db.Float, nullable=False, default=0)
    amount_raised = db.Column(db.Float, nullable=False, default=0)

    @property
    def is_fully_funded(self):
        return self.amount_raised >= self.amount_target
  

    serialize_rules = ('-ngo.causes', '-events.cause')

