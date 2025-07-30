from datetime import datetime, timedelta
from faker import Faker
from server.extensions import db
from server.models import User, Category, Cause, Event, Donation, DonationRequest, AdminActionLog
from flask_bcrypt import Bcrypt
import random

bcrypt = Bcrypt()
fake = Faker()

def seed():
    print("🌱 Running seed...")

    users_to_add = []

    # Superadmin
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

    # Admin
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

    # NGO
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

    # Donor
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

    # Categories (10)
    category_names = [
        "Health", "Education", "Environment", "Food",
        "Shelter", "Water", "Poverty Relief", "Animals",
        "Women Empowerment", "Animals"
    ]
    for name in category_names:
        if not Category.query.filter_by(name=name).first():
            db.session.add(Category(
                name=name,
                description=fake.sentence(nb_words=6)
            ))
    db.session.commit()
    print("✅ Categories seeded")

    all_categories = Category.query.all()

    # Causes (30)
    causes_to_add = []
    for i in range(20):
        title = fake.sentence(nb_words=4)
        if not Cause.query.filter_by(title=title).first():
            causes_to_add.append(Cause(
                title=title,
                description=fake.paragraph(nb_sentences=3),
                image_url=fake.image_url(),
                ngo_id=ngo.id,
                amount_target=random.randint(5000, 50000),
                amount_raised=random.randint(1000, 4000)
            ))
    db.session.add_all(causes_to_add)
    db.session.commit()
    print("✅ Causes seeded")

    all_causes = Cause.query.all()

    # Events (30)
    events_to_add = []
    for i in range(20):
        title = fake.catch_phrase()
        if not Event.query.filter_by(title=title).first():
            events_to_add.append(Event(
                title=title,
                description=fake.paragraph(nb_sentences=2),
                date=datetime.utcnow() + timedelta(days=random.randint(1, 90)),
                location=fake.city(),
                image_url=fake.image_url(),
                cause_id=random.choice(all_causes).id,
                ngo_id=ngo.id
            ))
    db.session.add_all(events_to_add)
    db.session.commit()
    print("✅ Events seeded")

    # Donation Requests (5)
    donation_requests_to_add = []
    for i in range(5):
        title = fake.bs().capitalize()
        if not DonationRequest.query.filter_by(title=title).first():
            donation_requests_to_add.append(DonationRequest(
                ngo_id=ngo.id,
                title=title,
                description=fake.text(max_nb_chars=200),
                category_id=random.choice(all_categories).id,
                amount_requested=random.randint(3000, 10000),
                is_approved=True
            ))
    db.session.add_all(donation_requests_to_add)
    db.session.commit()
    print("✅ Donation Requests seeded")

    # Admin Action Log
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
    print("✅ Admin actions logged")

    print("🌱 Seeding complete.")
