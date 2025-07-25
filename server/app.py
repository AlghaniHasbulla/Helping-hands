from flask import Flask
from dotenv import load_dotenv
from decouple import config
from server.extensions import db, migrate, jwt,bcrypt
from flasgger import Swagger
import os

from flask_cors import CORS
from server.routes.donation_request import donation_requests_bp
from server.routes.auth_routes import auth_bp
from server.routes.donations import donations_bp
from server.routes.profile_routes import profile_bp
from server.routes.admin_categories import admin_bp
from server.routes.admin_approvals import admin_approval_bp

load_dotenv()

def create_app(testing=False):
    app = Flask(__name__)
    Swagger(app)
    CORS(app, resources={r"/*": {"origins": "*"}}) 
    app.config['SECRET_KEY'] = config("SECRET_KEY", default="super-secret")
    app.config['JWT_SECRET_KEY'] = config("JWT_SECRET_KEY", default="jwt-secret")
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Set the database URI based on testing mode
    if testing:
        app.config['SQLALCHEMY_DATABASE_URI'] = config("TEST_DATABASE_URL")
        app.config['TESTING'] = True
    else:
        app.config['SQLALCHEMY_DATABASE_URI'] = config("DATABASE_URL")

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    bcrypt.init_app(app)

    @app.route('/')
    def home():
        return {"message":"Welcome to helping hands api "}

    app.register_blueprint(donation_requests_bp)
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(profile_bp, url_prefix="/api")
    app.register_blueprint(donations_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(admin_approval_bp)

    return app
app = create_app()