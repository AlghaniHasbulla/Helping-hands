from flask import Blueprint


cause_bp = Blueprint('cause_bp',__name__)

from .cause_route import *