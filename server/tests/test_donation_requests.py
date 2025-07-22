from flask_jwt_extended import create_access_token
from server.extensions import db
from server.models import User, Category
import uuid

def test_create_donation_request(client, app):
    with app.app_context():
        # Reset database
        db.drop_all()
        db.create_all()

        # Create user and category
        user = User(
            username="test_ngo",
            email=f"ngo_{uuid.uuid4()}@example.com",
            role="ngo",
            password_hash="hashedpassword"
        )
        category = Category(
            name="Food",
            description="Food category"
        )
        db.session.add_all([user, category])
        db.session.commit()

        # Generate token after commit
        ngo_token = create_access_token(identity=user.id)
        category_id = category.id  # assign ID here while session is active

    headers = {
        "Authorization": f"Bearer {ngo_token}",
        "Content-Type": "application/json"
    }

    payload = {
        "title": "Test Request",
        "description": "We need help with food.",
        "category_id": category_id,  # use stored ID
        "amount_requested": 5000.0
    }

    response = client.post("/requests", json=payload, headers=headers)

    assert response.status_code == 201
