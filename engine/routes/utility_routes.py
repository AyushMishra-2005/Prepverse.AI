from flask import Blueprint, request, jsonify, send_file, after_this_request
from services.utility_service import parse_resume_service, speak_service

bp = Blueprint("utility", __name__)


@bp.route("/parse-resume", methods=['POST'])
def parse_resume():
    print("FILES:", request.files)
    print("FORM:", request.form)

    if 'file' not in request.files:
        return jsonify({"message": "No file Found"}), 400

    uploaded_file = request.files['file']

    result = parse_resume_service(uploaded_file)

    if isinstance(result, tuple):
        return jsonify(result[0]), result[1]

    return jsonify(result)


@bp.route("/speak", methods=["POST"])
def speak():
    try:
        data = request.json or {}
        user_text = data.get("text", "Hello, how can I help you?")

        result = speak_service(user_text)

        if isinstance(result, tuple):
            return jsonify(result[0]), result[1]

        file_path = result

        @after_this_request
        def cleanup(response):
            import os
            try:
                os.remove(file_path)
            except Exception as e:
                print("Cleanup error:", e)
            return response

        return send_file(file_path, mimetype="audio/mpeg")

    except Exception as e:
        return jsonify({"error": str(e)}), 500