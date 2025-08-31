from flask import Flask, request, send_file, jsonify, after_this_request, redirect, url_for, session, Response
import fitz
import tempfile
import os
import requests
from llmFunctions import evaluate_resume
from llmFunctions import parse_resume_with_llm
import asyncio
import edge_tts
from flask_cors import CORS
import uuid


app = Flask(__name__)
CORS(app)

@app.route("/parse-resume", methods=['post'])
def parse_resume():

  if 'file' not in request.files:
    return jsonify({"message" : "No file Found"}), 400
  
  uploaded_file = request.files['file']
  
  with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp:
    uploaded_file.save(temp.name)
    temp_path = temp.name
  
  try:
    
    doc = fitz.open(temp_path)
    resume_text = "\n".join([page.get_text() for page in doc])
    doc.close()
    os.remove(temp_path)
    
    parsed_resume_data = parse_resume_with_llm(resume_text)
    
    return jsonify({"resume_data" : parsed_resume_data})
  except Exception as e:
    return jsonify({"message" : str(e)}), 500
  
  
@app.route("/evaluate-resume", methods=["POST"])
def evaluate_resume_endpoint():
    data = request.json
    resume_json = data.get("resume_data")
    job_title = data.get("job_title")
    topics = data.get("topics") 

    result = evaluate_resume(resume_json, job_title, topics)
    return jsonify({"evaluation": result})



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
