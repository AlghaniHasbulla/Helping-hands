from flask import Flask, request, jsonify
from dotenv import load_dotenv
from decouple import config
from server.extensions import db, migrate, jwt, bcrypt
from flasgger import Swagger
import os
from flask_cors import CORS
import logging
from server.routes_controller import register_routes
from server.seed import seed
from server.models.user import User

load_dotenv()

def create_app(testing=False):
    app = Flask(__name__)

    # Enhanced CORS configuration
    allowed_origins = [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://helpinghands-umber.vercel.app"
    ]

    CORS(app,
         origins=allowed_origins,
         supports_credentials=True,
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
         allow_headers=[
             "Content-Type",
             "Authorization",
             "Access-Control-Allow-Credentials",
             "Access-Control-Allow-Origin",
             "X-Requested-With",
             "Accept"
         ],
         expose_headers=["Content-Type", "Authorization"]
    )

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
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger(__name__)
    swagger = Swagger(app)

    # with app.app_context():
    #     from flask_migrate import upgrade
    #     upgrade()
    #     seed()

    @app.route('/')
    def home():
        return {"message": "Welcome to helping hands api"}

    register_routes(app)

    return app

app = create_app()
