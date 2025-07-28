from server.routes.admin import admin_bp
from server.routes.auth import auth_bp
from server.routes.cause import cause_bp
from server.routes.donation import donation_bp
from server.routes.donationrequest import donationrequest_bp
from server.routes.events import events_bp
from server.routes.ngo import ngo_bp
from server.routes.profile import profile_bp
from server.routes.superadmin import superadmin_bp


def register_routes(app):
    app.register_blueprint(admin_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(cause_bp)
    app.register_blueprint(donation_bp)
    app.register_blueprint(donationrequest_bp)
    app.register_blueprint(events_bp)
    app.register_blueprint(ngo_bp)
    app.register_blueprint(profile_bp)
    app.register_blueprint(superadmin_bp)
  