import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const callGeminiFlash = async (prompt) => {
  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = result.text;

    const jsonMatch = text.match(/\{(?:[^{}]|(?:\{[^{}]*\}))*\}/);
    if (!jsonMatch) {
      console.warn("Raw Gemini output:", text);
      throw new Error("No valid JSON found in Gemini response");
    }

    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.error("Gemini 2.5 Flash Error:", err.message);
    throw err;
  }
};
