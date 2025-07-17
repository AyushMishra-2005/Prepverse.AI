import axios from 'axios';
import { callGeminiFlash } from './geminiHelper.js';

export const validateSingleTopic  = async ({ role, topic }) => {
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
    return await callGeminiFlash(prompt);
  } catch (err) {
    console.error("validateRoleAndTopic error:", err.message);
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