import requests
import json
import os
from dotenv import load_dotenv
from groq import Groq
import re

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def parse_resume_with_llm(text):

  prompt = f"""
    You are an intelligent and structured JSON resume parser.

    Your task is to read the raw text of a candidate's resume and extract only the professional, academic, and domain-relevant information.
    Ignore personal details such as name, email, phone, or address.

    ### General Rules:
    - Output must be a valid JSON object.
    - Do not include explanations or extra text.
    - If a section is missing, return an empty list or empty string.
    - Always preserve the schema structure exactly as given.

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

  try:

    completion = client.chat.completions.create(
      model="llama-3.1-8b-instant",
      messages=[
        {
          "role": "user",
          "content": prompt
        }
      ],
      temperature=0.2
    )

    raw_output = completion.choices[0].message.content.strip()
    raw_output = raw_output.replace("```json", "").replace("```", "").strip()
    json_match = re.search(r"\{[\s\S]*\}", raw_output)

    if json_match:
      parsed_json = json.loads(json_match.group())
      return parsed_json
    else:
      raise ValueError("No valid JSON found in LLM response")

  except Exception as e:
      print("Groq API error:", e)
      return {"error": "Groq API failed", "details": str(e)}


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
    


def generate_user_summary(user_data: dict) -> str:
  """
  Generates a professional summary of a user's profile using Groq API.
  """

  user_data_str = json.dumps(user_data, indent=2)

  prompt = f"""
    You are an expert system that generates a structured, factual professional summary for internship recommendation purposes.

    Instructions:
    1. Analyze the provided JSON profile of a candidate.
    2. Extract all relevant factual information: education, programming languages, frameworks/libraries, databases, tools, project experience, technical stacks, and transferable strengths (problem-solving, research, leadership, teamwork, design, communication).
    3. Do NOT include subjective praise, filler text, bullet points, headings, or any special symbols other than periods and commas.
    4. Write a concise, structured summary of 3–4 sentences with only factual data suitable for machine learning-based internship recommendation.
    5. Explicitly mention project names, technologies, and skills used in projects.
    6. At the end of the summary, list all relevant domains/tech stacks based on the candidate's experience and skills, including both technical domains (e.g., Web Development, Data Science, Machine Learning, Generative AI) and non-technical domains (e.g., Leadership, Teamwork, Research, Communication, Design), separated by commas.

    Candidate JSON Profile:
    {user_data_str}

    Structured Factual Summary:
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

    summary = completion.choices[0].message.content.strip()

    if not summary:
      return "Error: Received an empty summary from the model."

    return summary

  except Exception as e:
    return f"Error: Groq API request failed. Details: {e}"