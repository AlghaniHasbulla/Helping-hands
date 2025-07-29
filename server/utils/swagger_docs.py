from flasgger import swag_from

def jwt_required_docs(summary, description, tags, params=None, request_body=None, responses=None):
    """
    Returns a Swagger decorator for JWT-protected endpoints.
    """
    docs = {
        "tags": tags,
        "summary": summary,
        "description": description,
        "security": [{"Bearer": []}],
        "parameters": params or [],
        "responses": responses or {
            "200": {
                "description": "Success"
            },
            "403": {
                "description": "Forbidden"
            },
            "401": {
                "description": "Unauthorized"
            }
        }
    }

    if request_body:
        docs["parameters"].append({
            "name": "body",
            "in": "body",
            "required": True,
            "schema": request_body
        })

    return swag_from(docs)
