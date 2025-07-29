from datetime import datetime, timedelta
from server.extensions import db
from server.models import User, Category, Cause, Event, Donation, DonationRequest, AdminActionLog
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()

def seed():
    print("🌱 Running seed...")

    users_to_add = []

    # Seed superadmin if not already in DB
    if not User.query.filter_by(email="superadmin@example.com").first():
        superadmin = User(
            full_name="Super Admin",
            email="superadmin@example.com",
            role="superadmin",
            is_verified=True
        )
        superadmin.set_password("supersecurepassword")
        users_to_add.append(superadmin)
    else:
        superadmin = User.query.filter_by(email="superadmin@example.com").first()

    # Seed admin if not already in DB
    if not User.query.filter_by(email="admin@example.com").first():
        admin = User(
            full_name="Admin User",
            email="admin@example.com",
            role="admin",
            is_verified=True
        )
        admin.set_password("adminpassword")
        users_to_add.append(admin)
    else:
        admin = User.query.filter_by(email="admin@example.com").first()

    # Add NGO and donor fresh each time
    ngo = User(
        full_name="Helping Hands NGO",
        email="ngo@example.com",
        role="ngo",
        is_verified=True
    )
    ngo.set_password("ngopassword")

    donor = User(
        full_name="John Donor",
        email="donor@example.com",
        role="donor",
        is_verified=True
    )
    donor.set_password("donorpassword")

    users_to_add.extend([ngo, donor])

    if users_to_add:
        db.session.add_all(users_to_add)
        db.session.commit()

    print("✅ Admin and superadmin seed complete")

    # Create categories
    health = Category(name="Health", description="Medical and health-related donations.")
    education = Category(name="Education", description="Support for education and learning.")
    db.session.add_all([health, education])
    db.session.commit()

    # Create causes
    cause = Cause(
        title="Medical Aid for Children",
        description="Raising funds for children's hospital treatment.",
        image_url="https://example.com/image.jpg",
        ngo_id=ngo.id,
        amount_target=10000,
        amount_raised=2500
    )
    db.session.add(cause)
    db.session.commit()

    # Create events
    event = Event(
        title="Fundraising Marathon",
        description="Join us for a marathon to raise funds.",
        date=datetime.utcnow() + timedelta(days=10),
        location="Nairobi City Park",
        image_url="https://example.com/marathon.jpg",
        cause_id=cause.id,
        ngo_id=ngo.id
    )
    db.session.add(event)
    db.session.commit()

    # Create donation request
    dr = DonationRequest(
        ngo_id=ngo.id,
        title="Emergency Food Supply",
        description="We need emergency food supplies for drought-hit regions.",
        category_id=health.id,
        amount_requested=5000,
        is_approved=True
    )
    db.session.add(dr)
    db.session.commit()

    # Create donation
    donation = Donation(
        donor_id=donor.id,
        donation_request_id=dr.id,
        amount=1000
    )
    db.session.add(donation)

    # Create admin action log
    db.session.add(AdminActionLog(
        actor_id=admin.id,
        action="Approved donation request",
        target_user_id=ngo.id
    ))

    db.session.commit()
    print("✅ Seed complete.")
