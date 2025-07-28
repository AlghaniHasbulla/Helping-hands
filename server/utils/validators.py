def validate_register(data):
    return all([
        data.get("email"),
        data.get("password"),
        data.get("full_name")
    ])

def validate_login(data):
    return all([
        data.get("email"),
        data.get("password")
    ])
