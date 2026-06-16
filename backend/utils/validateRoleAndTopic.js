import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export const validateRoleAndTopic = async ({ role, topics }) => {
  const prompt = `
    You are an expert AI assistant.

    Your task is to determine whether the given role and ALL of the provided topics are appropriate and logically related.

    Return STRICT JSON only.

    If every topic is appropriate:

    {
      "valid": true,
      "invalidTopics": []
    }

    If one or more topics are inappropriate:

    {
      "valid": false,
      "invalidTopics": [
        "topic1",
        "topic2"
      ]
    }

    Rules:
    - Validate each topic independently.
    - Only include unrelated or inappropriate topics in "invalidTopics".
    - Do not return any explanation.
    - Do not return markdown.
    - Return only valid JSON.

    Role:
    ${role}

    Topics:
    ${topics.join(", ")}
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
      temperature: 0.2,
      response_format: {
        type: "json_object"
      }
    });

    const response = JSON.parse(
      completion.choices[0].message.content
    );

    if (
      typeof response.valid !== "boolean" ||
      !Array.isArray(response.invalidTopics)
    ) {
      throw new Error("Invalid AI response.");
    }

    return response;

  } catch (err) {
    console.error("validateRoleAndTopic:", err.message);

    return {
      valid: false,
      invalidTopics: topics
    };
  }
};