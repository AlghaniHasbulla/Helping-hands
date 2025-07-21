from flask import Flask
from dotenv import load_dotenv
from server.extensions import db,migrate
import os
from flasgger import Swagger
from server.routes.donation_request import donation_requests_bp
from server.routes.auth_routes import auth_bp
from server.routes.donations import donations_bp
from server.routes.profile_routes import profile_bp
from server.routes.admin_categories import admin_bp
from server.routes.admin_approvals import admin_approval_bp



load_dotenv()

def create_app():
    app = Flask(__name__)
    swagger = Swagger(app)
    app.config['SQLALCHEMY_DATABASE_URI']= os.getenv("DATABASE_URL")
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    migrate.init_app(app,db)


    app.register_blueprint(donation_requests_bp)
    app.register_blueprint(auth_bp,url_prefix='/auth')
    app.register_blueprint(profile_bp, url_prefix="/api")
    app.register_blueprint(donations_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(admin_approval_bp)
    return app

