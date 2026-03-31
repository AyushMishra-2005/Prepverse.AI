import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export const validateSingleTopic = async ({ role, topic }) => {

  const prompt = `
    You are an expert AI assistant.

    Your task is to determine whether the given role and the following comma-separated list of topics are appropriate and logically related.

    Return strictly one of the following JSON responses:

    If the combination is valid:
    { "valid": true }

    If the combination is inappropriate or unrelated:
    { "valid": false }

    Do not provide any explanation or extra text.

    Role: ${role}
    Topics: ${topic}
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
      temperature: 0.3
    });

    let raw = completion.choices[0].message.content.trim();

    if (!raw.endsWith("}")) raw += "}";

    const jsonMatch = raw.match(/\{\s*"valid"\s*:\s*(true|false)\s*\}/);

    if (!jsonMatch) {
      throw new Error("Invalid JSON response from AI");
    }

    return JSON.parse(jsonMatch[0]);

  } catch (err) {
    console.log("validateRoleAndTopic error:", err.message);
    return { valid: false };
  }
};

export const validateRoleAndTopic = async ({ role, topics }) => {
  try {

    for (const topic of topics) {
      const { valid } = await validateSingleTopic({ role, topic });

      if (!valid) {
        return { valid: false };
      }
    }

    return { valid: true };

  } catch (err) {
    throw new Error("Validation failed");
  }
};