import pytest
from server.app import create_app
from server.extensions import db
from flask_jwt_extended import create_access_token

@pytest.fixture(scope='session')
def app():
    app = create_app(testing=True)
    with app.app_context():
        db.drop_all()   
        db.create_all()  
        yield app
        db.session.remove()
        db.drop_all()    

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def donor_token():
    return create_access_token(identity=1)

@pytest.fixture
def ngo_token():
    return create_access_token(identity=2)

@pytest.fixture
def admin_token():
    return create_access_token(identity=3)
