import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export const evaluateResume = async (resumeJson, jobTitle, topics) => {
  try {
    const topicsStr = topics.join(", ");

    const prompt = `
      You are a highly analytical and fair technical hiring evaluator.

      You are provided with:
      - A job title
      - A list of required technologies or topics
      - A parsed resume in structured JSON format

      Your task is to assess how well the candidate's resume aligns with the job requirements in a balanced and realistic way.

      ### SCORING INSTRUCTIONS (BALANCED MODE):

      Assign a score out of 100 based on the candidate's experience with the listed topics.

      Give FULL credit when:
      - The topic is clearly used in real-world projects or experience
      - The candidate demonstrates implementation and depth

      Give PARTIAL credit when:
      - The topic appears in skills but has limited or indirect usage
      - The candidate shows related or foundational knowledge

      Give LOW or NO credit when:
      - The topic is missing or irrelevant
      - Only vague or unrelated mentions exist

      ### IMPORTANT:
      - Do NOT be overly strict — recognize learning-stage candidates
      - Do NOT be overly generous — avoid giving high scores without evidence
      - Balance accuracy with realistic evaluation

      ### SCORING SCALE:

      - 85 to 100: Strong match (extensive hands-on experience)
      - 65 to 84: Good match (experience with most topics)
      - 45 to 64: Moderate match (partial or mixed experience)
      - 25 to 44: Basic exposure
      - 0 to 24: Minimal or no relevant experience

      ### OUTPUT FORMAT:
      Respond ONLY with raw JSON.

      {
        "resumeScore": {
          "total_score": <integer from 0 to 100>,
          "summary_feedback": "<3-4 sentence explanation>"
        }
      }

      ### INPUTS

      Job Title: "${jobTitle}"
      Required Topics: [${topicsStr}]

      Candidate Resume:
      ${JSON.stringify(resumeJson, null, 2)}
      `;
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

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      throw new Error("Empty response from Groq");
    }

    const parsedOutput = JSON.parse(content);

    return parsedOutput.resumeScore || {
      error: "Missing resumeScore key",
      raw: parsedOutput
    };

  } catch (err) {
    console.error("Groq API error:", err.message);

    return {
      error: "Groq API failed",
      details: err.message
    };
  }
};