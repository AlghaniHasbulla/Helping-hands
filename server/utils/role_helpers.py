from server.models.user import User
from server.models.admin_action_log import AdminActionLog
from server.extensions import db
from datetime import datetime

def is_admin(user_id):
    user = User.query.get(user_id)
    return user and user.role in ['admin', 'superadmin']

def is_superadmin(user_id):
    user = User.query.get(user_id)
    return user and user.role == 'superadmin'
def log_admin_action(admin_id, action_description, target_user_id=None):
    admin = User.query.get(admin_id)

    if not admin:
        return  

    log = AdminActionLog(
        actor_id=admin.id,
        action=action_description,
        target_user_id=target_user_id,
        timestamp=datetime.utcnow()
    )

    db.session.add(log)
    db.session.commit()