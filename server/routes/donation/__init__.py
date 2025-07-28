from flask import Blueprint

donation_bp = Blueprint('donation_bp',__name__)

from .donations import *
