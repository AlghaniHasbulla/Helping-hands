from server.extensions import db
from sqlalchemy_serializer import SerializerMixin

class Category(db.Model,SerializerMixin):
    __tablename__ = "categories"

    id = db.Column(db.Integer,primary_key =True)
    name= db.Column(db.String(100),nullable=False)
    description = db.Column(db.Text,nullable=False)
    # rships
    donation_requests = db.relationship(
        'DonationRequest',
        backref='category',
        lazy=True,cascade='all,delete'
        )
    serialize_rules = ('-donation_requests.category')
    
    @property
    def donations(self):
        return [donation for dr in self.donation_requests for donation in dr.donations]