import axios from 'axios'

export async function generateInterviewQuestions(resumeData, role, topics, numberOfQns = 2) {
  const topicsStr = topics.join(", ");

  const prompt = `
You are a smart and professional AI interviewer preparing to interview a candidate for the role of **${role}**.

You are provided with:
- The candidate's resume (in structured JSON format)
- A list of technical topics relevant to the role: [${topicsStr}]

---

### TASK:

Generate exactly **${numberOfQns}** technical interview questions that follow these guidelines:

1. **70%** of the questions should be based on the candidate's resume — including their experience, projects, skills, tools, and technologies.
2. **30%** of the questions should be based strictly on the provided topics — even if those topics are not mentioned in the resume.
3. Questions should sound **natural, human, and conversational** — avoid robotic or repetitive phrasing like "in your previous projects."
4. All questions must be **open-ended**, **non-repetitive**, and **answerable orally within approximately 45–60 seconds**.
5. Avoid yes/no questions, overly generic prompts, or definition-based questions.
6. Do **not** include any explanations, instructions, or extra text — only return the questions and estimated time.

---

### OUTPUT FORMAT:
Return a valid JSON object in this exact format:

{
  "questions": [
    { "question": "How did you design your database schema for the inventory system, and what performance issues did you run into?", "time": 48 },
    { "question": "What was your strategy for debugging and optimizing the authentication module in your mobile app project?", "time": 52 },
    { "question": "How would you approach load testing for a backend API built with Node.js and Express?", "time": 60 }
  ]
}

- The "time" must be a **number only** (integer), representing the **estimated number of seconds** it would take to answer the question orally.
- Do not include the word "seconds" or any extra text.
- Time should vary based on complexity:
- Simpler reflective questions → 45–50 seconds
- Multi-part or technical deep-dives → 55–60 seconds

Important:
- Always return an object with the key "questions".
- Even if there is only one question, wrap it in an array.
- Do not return a plain array or a single object.
- Do not include explanations, notes, or additional fields.
---

### CANDIDATE RESUME:
${JSON.stringify(resumeData)}

Now generate the questions.
`;

  try {
    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "llama3.1:8b",
      prompt,
      stream: false,
      temperature: 0.7,
      format: "json"
    });

    const rawOutput = response.data.response;

    console.log(rawOutput);

    try {
      const parsed = JSON.parse(rawOutput);

      if (parsed.questions && Array.isArray(parsed.questions)) {
        return parsed.questions;
      } else {
        console.error("Unexpected LLM format:", parsed);
        return [];
      }
    } catch (err) {
      console.error("Failed to parse LLM response:", err.message);
      return [];
    }
  } catch (err) {
    console.error("LLM request failed:", err.message);
    return [];
  }
}
