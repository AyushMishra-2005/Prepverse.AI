from flask import Blueprint, request, jsonify
from services.embedding_service import embed_job, embed_candidate

bp = Blueprint("embed", __name__)

@bp.route("/embed", methods=["POST"])
def embed():
    return jsonify(embed_job(request.get_json()))

@bp.route("/embed_candidate", methods=["POST"])
def embed_candidate_route():
    return jsonify(embed_candidate(request.get_json()))