from flask import Blueprint

events_bp = Blueprint('events_bp',__name__)

from .events_routes import *