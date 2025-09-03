import requests
import json

def parse_resume_with_llm(text):
  prompt = f"""
You are an intelligent and structured JSON resume parser.

Your task is to read the raw text of a candidate's resume and extract **only the professional, academic, and domain-relevant information**.  
Ignore personal details such as name, email, phone, or address.

### General Rules:
- Output must be a valid JSON object.
- Do **not** include explanations, comments, or extra text.
- If a section is missing, return an empty list or empty string for its fields.
- Always preserve the schema structure exactly as given below.
- Capture **hands-on skills and applications** from experience/projects separately from general skills.
- The `skills` field must be grouped by category, where each category has a `name` and a list of `items`.
- Be flexible across domains (e.g., software, science, arts, finance, law, teaching, medicine).

### Schema to Extract:

{{
  "skills": [
    {{
      "name": "",
      "items": []
    }}
  ],
  "experience": [
    {{
      "organization": "",
      "role": "",
      "duration": "",
      "skills_used": [],
      "responsibilities": []
    }}
  ],
  "projects": [
    {{
      "name": "",
      "role": "",
      "description": "",
      "skills_used": [],
      "link": ""
    }}
  ],
  "certifications": [
    {{
      "title": "",
      "issuing_organization": "",
      "issue_date": "",
      "certificate_link": ""
    }}
  ],
  "publications": [
    {{
      "title": "",
      "journal_or_publisher": "",
      "publication_date": "",
      "link": ""
    }}
  ],
  "contributions": [
    {{
      "project_or_activity": "",
      "description": "",
      "skills_used": [],
      "contribution_link": ""
    }}
  ],
  "education": [
    {{
      "degree": "",
      "field_of_study": "",
      "institution": "",
      "graduation_year": ""
    }}
  ]
}}

Here is the resume content:
\"\"\" 
{text} 
\"\"\"

Respond ONLY with the final JSON object.
"""


  response = requests.post("http://localhost:11434/api/generate", json={
    "model": "llama3.1:8b",
    "prompt": prompt,
    "stream": False,
    "temperature": 0.2,         
    "format": "json"           
  })


  resp_json = response.json()
  if "response" not in resp_json:
    raise ValueError(f"Missing 'response' in Ollama output: {resp_json}")
  return resp_json["response"].strip()

def evaluate_resume(resume_json, job_title, topics):
    topics_str = ", ".join(topics)

    prompt = f"""
    You are a highly strict and technical hiring evaluator.

    You are provided with:
    - A job title
    - A list of required technologies or topics
    - A parsed resume in structured JSON format

    Your task is to **rigorously assess** how well the candidate's resume aligns with the job requirements, based **only** on the required topics and job title.

    ---

    ### SCORING INSTRUCTIONS (STRICT MODE):

    You must assign a score **out of 10**, based **strictly** on the candidate's **hands-on experience** and **project usage** of the listed topics. Ignore unrelated content.

      - Award points **only** when:
      - The topic is **explicitly mentioned** in projects, job roles, or experience **AND**
      - The candidate demonstrates **actual usage**, implementation, or problem-solving with that topic

      - Do **not** give points for:
      - Topics listed under "skills" or "technologies" without context
      - Vague or buzzword mentions without concrete examples
      - Academic mentions without hands-on application
      - General-purpose tools (e.g. Python, Java) unless directly applied to a required topic

    ---

    ### SCORING SCALE:

    - **100**: Candidate used all topics across multiple real-world projects and roles. E.g., built full-stack apps with React + Node + MongoDB and deployed them.
    - **70–90**: Candidate used most topics with hands-on depth. E.g., 2 projects using React, Firebase, and Express.js but lacking deployment or team-based complexity.
    - **40–60**: Candidate has surface-level or academic experience. E.g., mentions Django in one small academic project without deep explanation.
    - **10–30**: Topics only appear in skills section or are vaguely used (e.g., just listing Python or Java).
    - **0**: No mention or usage of any required topics.

    ---

    ### OUTPUT FORMAT:
    Respond with only the raw JSON object.
    Do not include any markdown formatting or explanation.
    No ```json block.

    {{
      "resumeScore" : {{
        "total_score": <integer from 0 to 100>,
        "summary_feedback": "<3–4 sentence explanation justifying the score. Use specific project/experience references from the resume. Be concise and critical — do not praise irrelevant content.>"
      }}
    }}

    ---

    ### INPUTS:

    Job Title: "{job_title}"  
    Required Topics: [{topics_str}]

    Candidate Resume:
    {json.dumps(resume_json, indent=2)}
    """



    response = requests.post("http://localhost:11434/api/generate", json={
        "model": "llama3.1:8b",
        "prompt": prompt,
        "stream": False,
        "temperature": 0.5,
        "format": "json"
    })

    resp_json = response.json()
    if "response" not in resp_json:
      raise ValueError(f"Missing 'response' in Ollama output: {resp_json}")
    raw_output = resp_json["response"].strip()

    try:
      parsed_output = json.loads(raw_output)
      return parsed_output.get("resumeScore", {"error": "Missing resumeScore key", "raw": parsed_output})
    except json.JSONDecodeError as e:
      print("Failed to parse LLM response:", e)
      return {"error": "Invalid JSON from LLM", "raw": raw_output}
