from flask import Blueprint, request, jsonify
from services.recommendation_service import recommend

bp = Blueprint("recommend", __name__)

@bp.route("/recommend", methods=["POST"])
def recommend_route():
    return jsonify(recommend(request.get_json()))