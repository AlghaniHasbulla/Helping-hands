from flask import Blueprint

superadmin_bp = Blueprint('superadmin_bp',__name__)

from .super_admin import *