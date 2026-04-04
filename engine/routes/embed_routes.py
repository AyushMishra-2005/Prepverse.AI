from flask import Blueprint, request, jsonify
from services.embedding_service import embed_job, embed_candidate
from services.resume_vector_service import store_resume_chunks
from utils.text_utils import build_resume_text
from services.retrieval_service import retrieve_resume_chunks

bp = Blueprint("embed", __name__)

@bp.route("/embed", methods=["POST"])
def embed():
    return jsonify(embed_job(request.get_json()))

@bp.route("/embed_candidate", methods=["POST"])
def embed_candidate_route():
    return jsonify(embed_candidate(request.get_json()))

@bp.route("/store_resume_chunks", methods=["POST"])
def store_resume_chunks_route():
    data = request.get_json()

    user_id = data.get("userId")
    resume_json = data.get("resumeData")

    if not user_id or not resume_json:
        return jsonify({"error": "Missing userId or resumeData"}), 400

    resume_text = build_resume_text(resume_json)

    result = store_resume_chunks(user_id, resume_text)

    return jsonify(result)


@bp.route("/retrieve_resume_chunks", methods=["POST"])
def retrieve_resume_chunks_route():
    data = request.get_json()

    user_id = data.get("userId")
    query = data.get("query")

    if not user_id or not query:
        return jsonify({"error": "Missing userId or query"}), 400

    chunks = retrieve_resume_chunks(user_id, query)

    return jsonify({
        "query": query,
        "results": chunks
    })
