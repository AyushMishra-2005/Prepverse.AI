import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export const parseResumeWithLLM = async (text) => {
  const prompt = `
    You are an intelligent and structured JSON resume parser.

    Your task is to read the raw text of a candidate's resume and extract only the professional, academic, and domain-relevant information.
    Ignore personal details such as name, email, phone, or address.

    ### General Rules:
    - Output must be a valid JSON object.
    - Do not include explanations or extra text.
    - If a section is missing, return an empty list or empty string.
    - Always preserve the schema structure exactly as given.

    ### Schema to Extract:

    {
    "skills": [
      {
        "name": "",
        "items": []
      }
    ],
    "experience": [
      {
        "organization": "",
        "role": "",
        "duration": "",
        "skills_used": [],
        "responsibilities": []
      }
    ],
    "projects": [
      {
        "name": "",
        "role": "",
        "description": "",
        "skills_used": [],
        "link": ""
      }
    ],
    "certifications": [
      {
        "title": "",
        "issuing_organization": "",
        "issue_date": "",
        "certificate_link": ""
      }
    ],
    "publications": [
      {
        "title": "",
        "journal_or_publisher": "",
        "publication_date": "",
        "link": ""
      }
    ],
    "contributions": [
      {
        "project_or_activity": "",
        "description": "",
        "skills_used": [],
        "contribution_link": ""
      }
    ],
    "education": [
      {
        "degree": "",
        "field_of_study": "",
        "institution": "",
        "graduation_year": ""
      }
    ]
    }

    Here is the resume content:
    """
    ${text}
    """

    Respond ONLY with the final JSON object.
    `;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0].message.content;

    if (!content) {
      throw new Error("Empty response from Groq");
    }

    return JSON.parse(content);
    
  } catch (err) {
    console.error("Groq API error:", err.message);
    return {
      error: "Groq API failed",
      details: err.message
    };
  }
};