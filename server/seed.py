from datetime import datetime, timedelta
from server.extensions import db
from server.models import User, Category, Cause, Event, Donation, DonationRequest, AdminActionLog
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()

def seed():
    print("🌱 Running seed...")

    users_to_add = []

    # Seed superadmin
    superadmin = User.query.filter_by(email="superadmin@example.com").first()
    if not superadmin:
        superadmin = User(
            full_name="Super Admin",
            email="superadmin@example.com",
            role="superadmin",
            is_verified=True
        )
        superadmin.set_password("supersecurepassword")
        users_to_add.append(superadmin)

    # Seed admin
    admin = User.query.filter_by(email="admin@example.com").first()
    if not admin:
        admin = User(
            full_name="Admin User",
            email="admin@example.com",
            role="admin",
            is_verified=True
        )
        admin.set_password("adminpassword")
        users_to_add.append(admin)

    # Seed NGO
    ngo = User.query.filter_by(email="ngo@example.com").first()
    if not ngo:
        ngo = User(
            full_name="Helping Hands NGO",
            email="ngo@example.com",
            role="ngo",
            is_verified=True
        )
        ngo.set_password("ngopassword")
        users_to_add.append(ngo)

    # Seed Donor
    donor = User.query.filter_by(email="donor@example.com").first()
    if not donor:
        donor = User(
            full_name="John Donor",
            email="donor@example.com",
            role="donor",
            is_verified=True
        )
        donor.set_password("donorpassword")
        users_to_add.append(donor)

    if users_to_add:
        db.session.add_all(users_to_add)
        db.session.commit()

    print("✅ Users seeded")

    # Seed categories
    categories = {
        "Health": "Medical and health-related donations.",
        "Education": "Support for education and learning."
    }

    for name, description in categories.items():
        if not Category.query.filter_by(name=name).first():
            db.session.add(Category(name=name, description=description))

    db.session.commit()
    print("✅ Categories seeded")

    # Get or create Health category
    health = Category.query.filter_by(name="Health").first()

    # Seed cause
    cause = Cause.query.filter_by(title="Medical Aid for Children").first()
    if not cause:
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

    # Seed event
    event = Event.query.filter_by(title="Fundraising Marathon").first()
    if not event:
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

    # Seed donation request
    dr = DonationRequest.query.filter_by(title="Emergency Food Supply").first()
    if not dr:
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

    # Seed donation
    donation = Donation.query.filter_by(donor_id=donor.id, donation_request_id=dr.id).first()
    if not donation:
        donation = Donation(
            donor_id=donor.id,
            donation_request_id=dr.id,
            amount=1000
        )
        db.session.add(donation)

    # Seed admin action log
    action_exists = AdminActionLog.query.filter_by(
        actor_id=admin.id,
        action="Approved donation request",
        target_user_id=ngo.id
    ).first()

    if not action_exists:
        db.session.add(AdminActionLog(
            actor_id=admin.id,
            action="Approved donation request",
            target_user_id=ngo.id
        ))

    db.session.commit()
    print("✅ Seed complete.")
