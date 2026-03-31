from flask import Blueprint, request, jsonify
from services.eligibility_service import eligible_users

bp = Blueprint("eligibility", __name__)

@bp.route("/eligible_users", methods=["POST"])
def eligible_users_route():
    return jsonify(eligible_users(request.get_json()))