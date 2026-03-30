import Groq from "groq-sdk";
import dotenv from 'dotenv'
dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export async function generateInterviewQuestions(
  resumeData,
  role,
  topics,
  numberOfQns = 2
) {

  const topicsStr = topics.join(", ");

  const prompt = `
    You are an AI interviewer for the role: ${role}.

    Generate ${numberOfQns} technical interview questions.

    Input:
    - Candidate resume (JSON)
    - Topics: ${topicsStr}

    Rules:
    • 70% questions should relate to the resume.
    • 30% should come from the topics.
    • Questions must be natural, open-ended, and non-repetitive.
    • Avoid yes/no or definition questions.

    For each question include:
    {
    "question": "...",
    "time": number
    }

    Time rules:
    • 30–40 → simple questions
    • 40–50 → moderate reasoning
    • 50–60 → complex technical questions

    Return only JSON:
    {
    "questions": [
      {"question":"...","time":45}
    ]
    }

    Resume:
    ${JSON.stringify(resumeData)}
    `;

  try {

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const parsed = JSON.parse(completion.choices[0].message.content);

    if (parsed.questions && Array.isArray(parsed.questions)) {
      return parsed.questions;
    } else {
      console.error("Unexpected LLM format:", parsed);
      return [];
    }

  } catch (err) {
    console.error("Groq request failed:", err.message);
    return [];
  }
}