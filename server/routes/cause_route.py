from flask import Blueprint, request
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from server.extensions import db
from server.models.cause import Cause
from server.models.user import User

cause_bp = Blueprint('cause', __name__)
api = Api(cause_bp)


class PublicCauseList(Resource):
    def get(self):
        causes = Cause.query.filter(Cause.current_amount < Cause.target_amount).all()
        return [cause.to_dict() for cause in causes], 200


class CauseCreate(Resource):
    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        user = User.query.get_or_404(user_id)

        if user.role not in ['admin', 'super_admin']:
            return {"error": "Unauthorized"}, 403

        data = request.get_json()

        try:
            cause = Cause(
                title=data['title'],
                description=data['description'],
                image_url=data.get('image_url'),
                target_amount=data['target_amount'],
                current_amount=data.get('current_amount', 0),
                ngo_id=user_id
            )
        except KeyError as e:
            return {"error": f"Missing field: {str(e)}"}, 400

        db.session.add(cause)
        db.session.commit()
        return cause.to_dict(), 201


# Register routes
api.add_resource(PublicCauseList, '/causes')
api.add_resource(CauseCreate, '/causes/create')
