import axios from 'axios';
import Groq from 'groq-sdk'
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export async function evaluateResult({ questions, answers }) {
  if (!questions || !answers || questions.length !== answers.length) {
    throw new Error("Questions and answers must be provided and of equal length.");
  }

  const qaBlock = questions
    .map((q, i) => `Q${i + 1}: ${q.question}\nA${i + 1}: ${answers[i]}`)
    .join("\n\n");

  const prompt = `
    You are an expert technical interview evaluator.

    Evaluate the candidate's answers.

    Instructions:

    1. For each question-answer pair, write a **two-line review**:
    - Line 1: Assess answer quality.
    - Line 2: Suggest improvements.

    2. Give **score out of 10** (integer).

    3. Add "overAllReview" (exactly 2 lines):
    - Line 1: Overall performance
    - Line 2: Strengths & weaknesses

    Rules:
    - Missing/irrelevant answer → score 0
    - Do NOT repeat Q/A
    - STRICT JSON ONLY

    Format:
    {
      "reviews": [
        {
          "review": "text",
          "score": 7
        }
      ],
      "overAllReview": "text"
    }

    Q&A:
    ${qaBlock}
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
      temperature: 0.5,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(completion.choices[0].message.content);

    const { reviews, overAllReview } = result;

    const totalScore = reviews.reduce((sum, r) => sum + r.score, 0);

    return {
      reviews,
      totalScore,
      overAllReview
    };

  } catch (err) {
    console.error("Error calling LLaMA 3.2:", err.message);
    throw err;
  }
}
