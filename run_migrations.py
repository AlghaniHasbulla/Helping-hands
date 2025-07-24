from flask_migrate import upgrade
from server.app import create_app
from server.extensions import db

app = create_app()

with app.app_context():
    upgrade()
