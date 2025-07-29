import re
from urllib.parse import urlparse

def validate_register(data):
    # Required fields validation
    if not data.get('full_name') or len(data['full_name'].strip()) < 2:
        return False, "Full name must be at least 2 characters"
    
    # Email validation
    email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    if not re.match(email_regex, data.get('email', '')):
        return False, "Invalid email format"
    
    # Password validation
    password = data.get('password', '')
    if len(password) < 8:
        return False, "Password must be at least 8 characters"
    
    # Role validation
    valid_roles = ['donor', 'charity', 'admin']
    if data.get('role') not in valid_roles:
        return False, "Invalid role selection"
    
    # Phone validation (if provided)
    if data.get('phone'):
        phone_regex = r'^\+?[0-9]{7,15}$'
        if not re.match(phone_regex, data['phone']):
            return False, "Invalid phone number format"
    
    # Website validation (if provided)
    if data.get('website'):
        try:
            result = urlparse(data['website'])
            if not all([result.scheme, result.netloc]):
                return False, "Invalid website URL"
        except:
            return False, "Invalid website URL"
    
    # Social media validation (if provided)
    social_fields = ['twitter', 'facebook', 'linkedin', 'instagram']
    for field in social_fields:
        if data.get(field) and len(data[field]) > 100:
            return False, f"{field.capitalize()} handle is too long"
    
    return True, ""

def validate_login(data):
    if not data.get('email'):
        return False, "Email is required"
    
    if not data.get('password'):
        return False, "Password is required"
    
    return True, ""
