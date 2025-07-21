from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from dotenv import load_dotenv
from extensions import db,migrate
import os
from server.routes.donation_request import donation_requests_bp
from server.routes.donations import donations_bp


load_dotenv()

def create_app():
    app = Flask(__name__)

    app.config['SQLALCHEMY_DATABASE_URI']= os.getenv("DATABASE_URL")
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    migrate.init_app(app,db)


    app.register_blueprint(donation_requests_bp)
    app.register_blueprint(donations_bp)
    return app

