from server.models.user import User

def is_admin(user_id):
    user = User.query.get(user_id)
    return user and user.role in ['admin', 'superadmin']

def is_superadmin(user_id):
    user = User.query.get(user_id)
    return user and user.role == 'superadmin'
