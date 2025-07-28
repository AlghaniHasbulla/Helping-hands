from flask import Blueprint

ngo_bp = Blueprint('ngo_bp',__name__)

from .ngo_routes import *
