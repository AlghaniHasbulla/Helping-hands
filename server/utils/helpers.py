from math import ceil
from datetime import datetime

# Pagination Helper
def paginate(query, page=1, per_page=10):
    total = query.count()
    items = query.offset((page - 1) * per_page).limit(per_page).all()
    return {
        'items': [item.to_dict() for item in items],
        'total': total,
        'page': page,
        'pages': ceil(total / per_page)
    }

# Date Formatter
def format_datetime(dt):
    return dt.strftime('%Y-%m-%d %H:%M:%S') if isinstance(dt, datetime) else dt
