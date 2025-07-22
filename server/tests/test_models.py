import pytest
from flask_jwt_extended import create_access_token
from server.extensions import db
from server.models import User, Category, DonationRequest, Donation


@pytest.fixture
def setup_app(app):
    with app.app_context():
        db.drop_all()
        db.create_all()
        yield
        db.session.remove()


@pytest.fixture
def create_users():
    ngo = User(
        username="ngo_user",
        email="ngo@example.com",
        role="ngo",
        password_hash="fakehashedpassword"
    )
    donor = User(
        username="donor_user",
        email="donor@example.com",
        role="donor",
        password_hash="fakehashedpassword"
    )
    db.session.add_all([ngo, donor])
    db.session.commit()
    return ngo, donor


@pytest.fixture
def create_category():
    category = Category(name="Health", description="Healthcare initiatives")
    db.session.add(category)
    db.session.commit()
    return category


@pytest.fixture
def create_request(create_users, create_category):
    ngo, _ = create_users
    category = create_category
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
    return request


@pytest.fixture
def create_donation(create_users, create_request):
    _, donor = create_users
    donation = Donation(
        donor_id=donor.id,
        donation_request_id=create_request.id,
        amount=500.0
    )
    db.session.add(donation)
    db.session.commit()
    return donation


def test_model_creation_and_relationships(setup_app, create_users, create_category, create_request, create_donation):
    ngo, donor = create_users
    request = create_request
    donation = create_donation

    assert donation.donation_request.title == "Food Aid"
    assert request.donations[0].amount == 500.0
    assert donor.donations[0].amount == 500.0
    assert request.ngo.username == ngo.username
    assert request.category.name == create_category.name

    # Serialization check
    assert "title" in request.to_dict()
    assert "amount" in donation.to_dict()


def test_create_donation_request_authenticated(client, app, setup_app, create_category, create_users):
    with app.app_context():
        ngo, _ = create_users
        category = create_category
        token = create_access_token(identity=ngo.id)
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        payload = {
            "title": "Test Request",
            "description": "We need help with food.",
            "category_id": category.id,
            "amount_requested": 5000.0
        }

    response = client.post("/requests", json=payload, headers=headers)
    assert response.status_code == 201
    data = response.get_json()
    assert data["title"] == "Test Request"
    assert data["amount_requested"] == 5000.0
