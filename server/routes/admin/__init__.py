from flask import Blueprint

admin_bp = Blueprint("admin_bp")

from .admin_approvals import *
from .admin_categories import *