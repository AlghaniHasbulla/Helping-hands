from flask import Blueprint

auth_bp = Blueprint('auth_bp',__name__)

from .dashboard import *
from .login import *
from .register import *
from .resend_verification import *
from .upload_avatar import *
from .verifyEmail import *

