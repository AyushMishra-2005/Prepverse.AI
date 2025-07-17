import requests
import json
import google.generativeai as genai
from dotenv import load_dotenv
import os
import re

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-1.5-flash")

def parse_resume_with_llm(text):
  prompt = f"""
You are an intelligent and structured JSON resume parser.

Given the raw text of a candidate's resume, extract **only the technical information** relevant for generating technical interview questions. Ignore personal details like name, email, phone, etc.

### Instructions:
- Return a well-structured JSON object.
- Do NOT include any comments, explanations, or introductory text.
- Only extract content that is useful to generate technical interview questions.
- If a section is missing, return an empty list for it.
- Start and end with curly braces {{}} for a valid JSON object.

### Extract ONLY the following fields:

1. **skills**:
   - Grouped under categories:
     - frontend
     - backend
     - mobile
     - devops
     - databases
     - tools_and_platforms

2. **experience**: list of objects with:
   - company
   - role
   - technologies (tech/tools used in the role)
   - responsibilities (as bullet points or short sentences)

3. **projects**: list of objects with:
   - name
   - role
   - description (brief summary of what the project does)
   - technologies (languages, libraries, frameworks, tools used)

Here is the resume content:
\"\"\"
{text}
\"\"\"

Respond ONLY with the final JSON object.
"""



  response = model.generate_content(prompt)
  raw_text = response.text.strip()
  cleaned = re.sub(r"^```(?:json)?\n|\n```$", "", raw_text.strip(), flags=re.MULTILINE)
  
  try:
      parsed = json.loads(cleaned)
      return parsed
  except json.JSONDecodeError as e:
    print("Failed to parse Gemini response:", e)
    return {"error": "Invalid JSON from Gemini", "raw": response.text}

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

- **10**: Candidate used all topics across multiple real-world projects and roles. E.g., built full-stack apps with React + Node + MongoDB and deployed them.
- **7–9**: Candidate used most topics with hands-on depth. E.g., 2 projects using React, Firebase, and Express.js but lacking deployment or team-based complexity.
- **4–6**: Candidate has surface-level or academic experience. E.g., mentions Django in one small academic project without deep explanation.
- **1–3**: Topics only appear in skills section or are vaguely used (e.g., just listing Python or Java).
- **0**: No mention or usage of any required topics.

---

### OUTPUT FORMAT:
Respond with only the raw JSON object.
Do not include any markdown formatting or explanation.
No ```json block.

{{
  "resumeScore" : {{
    "total_score": <integer from 0 to 10>,
    "summary_feedback": "<3–4 sentence explanation justifying the score. Use specific project/experience references from the resume. Be concise and critical — do not praise irrelevant content.>"
  }}
}}

---

### INPUTS:

Job Title: "{job_title}"  
Required Topics: [{topics_str}]

Candidate Resume:
{resume_json}
"""



    response = model.generate_content(prompt)

    raw_text = response.text.strip()

    cleaned = re.sub(r"^```(?:json)?\n|\n```$", "", raw_text.strip(), flags=re.MULTILINE)

    try:
        parsed = json.loads(cleaned)
        return parsed.get("resumeScore", {"error": "Missing resumeScore key", "raw": parsed})
    except json.JSONDecodeError as e:
        print("Failed to parse Gemini response:", e)
        return {"error": "Invalid JSON from Gemini", "raw": raw_text}
