from flask import  request
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from server.extensions import db
from server.models.event import Event
from server.models.user import User
from . import events_bp
from flasgger import swag_from

api = Api(events_bp)


class PublicEventList(Resource):
    @swag_from({
        "tags": ["Events"],
        "summary": "List Upcoming Public Events",
        "description": "Fetches all upcoming events whose date is today or later.",
        "responses": {
            "200": {
                "description": "List of upcoming events",
                "schema": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "id": {"type": "integer"},
                            "title": {"type": "string"},
                            "description": {"type": "string"},
                            "location": {"type": "string"},
                            "date": {"type": "string", "format": "date"},
                            "image_url": {"type": "string"},
                            "ngo_id": {"type": "integer"},
                        }
                    }
                }
            }
        }
    })

    def get(self):
        now = datetime.utcnow()
        events = Event.query.filter(Event.date >= now).all()
        return [event.to_dict() for event in events], 200


class EventCreate(Resource):
    @jwt_required()
    @swag_from({
        "tags": ["Events"],
        "summary": "Create Event",
        "description": "Admins or Super Admins can create new events.",
        "security": [{"Bearer": []}],
        "parameters": [
            {
                "name": "body",
                "in": "body",
                "required": True,
                "schema": {
                    "type": "object",
                    "properties": {
                        "title": {"type": "string"},
                        "description": {"type": "string"},
                        "location": {"type": "string"},
                        "date": {"type": "string", "example": "2025-08-15"},
                        "image_url": {"type": "string"}
                    },
                    "required": ["title", "description", "location", "date"]
                }
            }
        ],
        "responses": {
            "201": {
                "description": "Event successfully created",
                "schema": {
                    "type": "object",
                    "properties": {
                        "id": {"type": "integer"},
                        "title": {"type": "string"},
                        "description": {"type": "string"},
                        "location": {"type": "string"},
                        "date": {"type": "string"},
                        "image_url": {"type": "string"},
                        "ngo_id": {"type": "integer"}
                    }
                }
            },
            "403": {"description": "Unauthorized"},
            "400": {"description": "Missing or invalid fields"}
        }
    })
    def post(self):
        user_id = get_jwt_identity()
        user = User.query.get_or_404(user_id)

        if user.role not in ['admin', 'super_admin']:
            return {"error": "Unauthorized"}, 403

        data = request.get_json()

        try:
            event = Event(
                title=data['title'],
                description=data['description'],
                location=data['location'],
                date=datetime.strptime(data['date'], "%Y-%m-%d"),
                image_url=data.get('image_url'),
                ngo_id=user_id
            )
        except KeyError as e:
            return {"error": f"Missing field: {str(e)}"}, 400

        db.session.add(event)
        db.session.commit()
        return event.to_dict(), 201


class EventUpdate(Resource):
    @jwt_required()
    @swag_from({
        "tags": ["Events"],
        "summary": "Edit Event",
        "description": "Allows an event creator (NGO) to update their own event.",
        "security": [{"Bearer": []}],
        "parameters": [
            {
                "name": "id",
                "in": "path",
                "required": True,
                "type": "integer",
                "description": "ID of the event to edit"
            },
            {
                "name": "body",
                "in": "body",
                "required": True,
                "schema": {
                    "type": "object",
                    "properties": {
                        "title": {"type": "string"},
                        "description": {"type": "string"},
                        "location": {"type": "string"},
                        "date": {"type": "string", "example": "2025-08-20"},
                        "image_url": {"type": "string"}
                    }
                }
            }
        ],
        "responses": {
            "200": {
                "description": "Event updated successfully",
                "schema": {
                    "type": "object",
                    "properties": {
                        "id": {"type": "integer"},
                        "title": {"type": "string"},
                        "description": {"type": "string"},
                        "location": {"type": "string"},
                        "date": {"type": "string"},
                        "image_url": {"type": "string"},
                        "ngo_id": {"type": "integer"}
                    }
                }
            },
            "403": {"description": "Unauthorized"},
            "404": {"description": "Event not found"}
        }
    })
    def patch(self, id):
        user_id = get_jwt_identity()
        event = Event.query.get_or_404(id)

        if event.ngo_id != user_id:
            return {"error": "Unauthorized"}, 403

        data = request.get_json()

        if "title" in data:
            event.title = data["title"]
        if "description" in data:
            event.description = data["description"]
        if "location" in data:
            event.location = data["location"]
        if "date" in data:
            event.date = datetime.strptime(data["date"], "%Y-%m-%d")
        if "image_url" in data:
            event.image_url = data["image_url"]

        db.session.commit()
        return event.to_dict(), 200


# Register routes
api.add_resource(PublicEventList, '/events')
api.add_resource(EventCreate, '/events/create')
api.add_resource(EventUpdate, '/events/<int:id>/edit')
