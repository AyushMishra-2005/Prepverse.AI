import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export const checkRoleAndTopicQuiz = async (req, res) => {
  const { role, topic, numOfQns, level } = req.body;
  const email = req.user.email;

  if (!role || !topic || !numOfQns || !level) {
    return res.status(400).json({ message: "Provide valid inputs" });
  }

  if (numOfQns < 2 || numOfQns > 25) {
    return res.status(400).json({
      message: "Please provide a number of questions between 2 and 25."
    });
  }

  try {
    const prompt = `
      You are an expert AI interview assistant.

      Task:
      - Validate if role and topic are related.
      - If valid, generate MCQ questions.

      Constraints:
      1. Generate exactly ${numOfQns} MCQs.
      2. Each question must have 4 options.
      3. Mark correct answer clearly.
      4. Difficulty: "${level}".
      5. Keep questions concise (30–60 sec level).
      6. No repetition.
      7. Strict JSON output only.

      Format:

      If valid:
      {
        "valid": true,
        "questions": [
          {
            "question": "text",
            "options": ["A","B","C","D"],
            "answer": "correct option"
          }
        ]
      }

      If invalid:
      {
        "valid": false,
        "questions": []
      }

      Input:
      Role: ${role}
      Topic: ${topic}
      `;

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

    let { valid, questions } = parsed;

    if (!valid || !Array.isArray(questions)) {
      return res.status(200).json({
        message: "Invalid role-topic combination",
        response: parsed
      });
    }

    questions = questions.slice(0, numOfQns);

    questions = questions.map((q) => ({
      ...q,
      time: q.time ?? 50
    }));

    return res.status(200).json({
      message: "Questions generated successfully",
      response: parsed,
      questions
    });

  } catch (err) {
    console.error("Groq Error:", err.message);
    return res.status(500).json({ message: "Server Error" });
  }
};