import requests
import json
import os
from dotenv import load_dotenv
from groq import Groq
import re

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def evaluate_resume(resume_json, job_title, topics):

  topics_str = ", ".join(topics)

  prompt = f"""
    You are a highly strict and technical hiring evaluator.

    You are provided with:
    - A job title
    - A list of required technologies or topics
    - A parsed resume in structured JSON format

    Your task is to rigorously assess how well the candidate's resume aligns with the job requirements.

    ### SCORING INSTRUCTIONS (STRICT MODE):

    You must assign a score out of 100 based strictly on the candidate's hands-on experience with the listed topics.

    Award points only when:
    - The topic is explicitly mentioned in projects or experience
    - The candidate demonstrates actual implementation

    Do not give points for:
    - Skills lists without context
    - Buzzword mentions
    - Academic mentions without implementation

    ### SCORING SCALE:

    - 100: Used all topics across real-world projects
    - 70-90: Used most topics with depth
    - 40-60: Surface-level or academic experience
    - 10-30: Topics vaguely listed
    - 0: No mention

    ### OUTPUT FORMAT:
    Respond with only raw JSON.

    {{
      "resumeScore": {{
        "total_score": <integer from 0 to 100>,
        "summary_feedback": "<3-4 sentence explanation>"
      }}
    }}

    ### INPUTS

    Job Title: "{job_title}"
    Required Topics: [{topics_str}]

    Candidate Resume:
    {json.dumps(resume_json, indent=2)}
    """

  try:
    completion = client.chat.completions.create(
      model="llama-3.1-8b-instant",
      messages=[
        {
          "role": "user",
          "content": prompt
        }
      ],
      temperature=0.5
    )

    raw_output = completion.choices[0].message.content.strip()

    parsed_output = json.loads(raw_output)

    return parsed_output.get(
      "resumeScore",
      {"error": "Missing resumeScore key", "raw": parsed_output}
    )

  except json.JSONDecodeError as e:
    print("Failed to parse LLM response:", e)
    return {"error": "Invalid JSON from LLM", "raw": raw_output}

  except Exception as e:
    print("Groq API error:", e)
    return {"error": "Groq API failed", "details": str(e)}
    
