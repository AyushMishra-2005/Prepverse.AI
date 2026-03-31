import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export const generateResumeSummary = async (userData) => {
  try {
    const userDataStr = JSON.stringify(userData, null, 2);

    const prompt = `
      You are an expert system that generates a structured, factual professional summary for internship recommendation purposes.

      Instructions:
      1. Analyze the provided JSON profile of a candidate.
      2. Extract all relevant factual information: education, programming languages, frameworks/libraries, databases, tools, project experience, technical stacks, and transferable strengths (problem-solving, research, leadership, teamwork, design, communication).
      3. Do NOT include subjective praise, filler text, bullet points, headings, or any special symbols other than periods and commas.
      4. Write a concise, structured summary of 3–4 sentences with only factual data suitable for machine learning-based internship recommendation.
      5. Explicitly mention project names, technologies, and skills used in projects.
      6. At the end of the summary, list all relevant domains/tech stacks based on the candidate's experience and skills, including both technical domains (e.g., Web Development, Data Science, Machine Learning, Generative AI) and non-technical domains (e.g., Leadership, Teamwork, Research, Communication, Design), separated by commas.

      Candidate JSON Profile:
      ${userDataStr}

      Structured Factual Summary:
      `;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.5
    });

    const summary = completion.choices[0]?.message?.content?.trim();

    if (!summary) {
      return "Error: Received an empty summary from the model.";
    }

    return summary;

  } catch (err) {
    console.error("Groq API error:", err.message);
    return `Error: Groq API request failed. Details: ${err.message}`;
  }
};