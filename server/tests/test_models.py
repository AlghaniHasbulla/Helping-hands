# server/tests/test_models.py

from server.models.user import User
from server.models.donation import Donation
from server.models.donation_request import DonationRequest
from server.models.category import Category
from server.extensions import db

def test_model_creation_and_relationships(app):
    with app.app_context():
        # Create category
        category = Category(name="Health", description="Healthcare initiatives")
        db.session.add(category)

        # Create NGO user and Donor user
        ngo = User(id=2, username="ngo_user", email="ngo@example.com", role="ngo")
        donor = User(id=1, username="donor_user", email="donor@example.com", role="donor")
        db.session.add_all([ngo, donor])
        db.session.commit()

        # Create donation request
        request = DonationRequest(
            title="Food Aid",
            description="Need food packages",
            amount_requested=1000.0,
            category_id=category.id,
            ngo_id=ngo.id,
            is_approved=True
        )
        db.session.add(request)
        db.session.commit()

        # Create donation
        donation = Donation(
            donor_id=donor.id,
            donation_request_id=request.id,
            amount=500.0
        )
        db.session.add(donation)
        db.session.commit()

        # Assert relationships
        assert donation.donation_request.title == "Food Aid"
        assert request.donations[0].amount == 500.0
        assert donor.donations[0].amount == 500.0
        assert request.ngo.username == "ngo_user"
        assert request.category.name == "Health"

        # Check serialization
        assert "title" in request.to_dict()
        assert "amount" in donation.to_dict()
