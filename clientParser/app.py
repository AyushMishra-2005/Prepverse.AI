from flask import Flask, request, send_file, jsonify, after_this_request, redirect, url_for, session, Response
import fitz
import tempfile
import os
import requests
import asyncio
import edge_tts
from flask_cors import CORS
import uuid


app = Flask(__name__)
CORS(app)

@app.route("/parse-resume", methods=['post'])
def parse_resume():

  if 'file' not in request.files:
    return jsonify({"message": "No file Found"}), 400
  
  uploaded_file = request.files['file']
  
  with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp:
    uploaded_file.save(temp.name)
    temp_path = temp.name
  
  try:
    doc = fitz.open(temp_path)
    resume_text = "\n".join([page.get_text() for page in doc])
    doc.close()
    os.remove(temp_path)
    
    return jsonify({
      "resume_text": resume_text
    })

  except Exception as e:
    return jsonify({"message": str(e)}), 500


@app.route("/speak", methods=["POST"])
def speak():
  try:
    data = request.json
    user_text = data.get("text", "Hello, how can I help you?")
    voice = "en-US-JennyNeural"

    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as temp_audio:
      file_path = temp_audio.name

    async def generate_audio():
      tts = edge_tts.Communicate(text=user_text, voice=voice)
      await tts.save(file_path)

    asyncio.run(generate_audio())

    @after_this_request
    def cleanup(response):
      try:
        os.remove(file_path)
        print(f"Deleted: {file_path}")
      except Exception as e:
        print("Cleanup error:", e)
      return response

    return send_file(file_path, mimetype="audio/mpeg")

  except Exception as e:
    return jsonify({"error": str(e)}), 500
  
  
if __name__ == "__main__":
    app.run(port=3000, debug=True)
