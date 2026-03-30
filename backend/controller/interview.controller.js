import axios from 'axios';
import InterviewData from '../models/interview.model.js';
import Groq from "groq-sdk";
import dotenv from 'dotenv'

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export const generateQuestionsReview = async (req, res) => {
  const { role, topic, name, previousQuestions = [], askedQuestion, numOfQns, modelId } = req.body;
  let { givenAnswer } = req.body;
  const { email } = req.user;

  if (!role || !topic || !name) {
    return res.status(500).json({ message: "Must provide a role, topic, and name!" });
  }

  if (!modelId) {
    return res.status(500).json({ message: "Must provide a modelId!" });
  }

  if (previousQuestions.length > 0 && (!askedQuestion || !givenAnswer)) {
    console.error('Missing fields for follow-up:', { askedQuestion, givenAnswer });
    return res.status(400).json({
      message: "For follow-up questions, must provide askedQuestion and givenAnswer!",
      received: { askedQuestion, givenAnswer }
    });
  }

  givenAnswer = givenAnswer?.trim() === "" ? "Answer Not Provided." : givenAnswer;

  try {
    let prompt;
    let aiResponse;
    let response;
    let finishInterview = false;

    if (previousQuestions.length === 0) {
      const prompt = `You are conducting a professional interview for a ${role} position, focusing on ${topic}.

        Your task is to generate:

        1. A warm, professional welcome message for the candidate ${name}, written as three short parts in a single line (no line breaks).
        - Under 200 words
        - Mention the job title naturally
        - Friendly + professional tone
        - No AI/mock mention

        2. A standalone transition phrase:
        - Not a full sentence
        - No question mark
        - Example: "Let's begin with"

        Return STRICT JSON:
        {
          "addressing": "text",
          "transition": "text"
        }`
        ;
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

      const response = JSON.parse(completion.choices[0].message.content);

      const { addressing, transition } = response;

      if (!addressing || !transition) {
        return res.status(500).json({ message: "Failed to generate question!" });
      }

      const data = await InterviewData.findById(modelId);
      const question = data.questions[0];

      let transitionData = transition.trim();

      if (transitionData.endsWith(".")) {
        transitionData = transitionData.slice(0, -1) + ",";
      } else if (!transitionData.endsWith(",")) {
        transitionData += ",";
      }

      let responseData =
        addressing + " " + transitionData + " " + question.question;

      return res.status(200).json({
        message: "Question generated!",
        question,
        responseData,
        finishInterview
      });

    } else {

      if (previousQuestions.length == numOfQns) {
        prompt = `You are conducting a professional interview for ${role} focusing on ${topic}.
          Previous Question: "${askedQuestion}"
          Candidate Answer: "${(givenAnswer || '').trim() || '[No answer provided]'}"

          Generate:

          1. FEEDBACK:
          - Exactly 2 professional sentences
          - Use "you/your"
          - Only assessment (no suggestions/praise)
          - Be objective and factual

          2. END MESSAGE:
          - 2–3 sentence professional thank-you
          - Different wording every time

          Return STRICT JSON:
          {
            "feedback": "text",
            "transition": "text"
          }`
          ;

        finishInterview = true;
      } else {
        prompt = `You are conducting a professional interview for ${role} focusing on ${topic}.

        Previous Question: "${askedQuestion}"
        Candidate Answer: "${(givenAnswer || '').trim() || '[No answer provided]'}"

        Generate:

        1. FEEDBACK:
        - Exactly 2 professional sentences
        - Use "you/your"
        - Only assessment (no suggestions/praise)
        - Be objective and factual

        2. TRANSITION:
        - Start with:
          "Next, let's discuss,", "Moving on to,", "Now, consider,"
        - No question
        - End with ":" or "..."

        Return STRICT JSON:
        {
          "feedback": "text",
          "transition": "text"
        }`;
      }

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

      const response = JSON.parse(completion.choices[0].message.content);

      const { feedback, transition } = response;

      if (!feedback || !transition) {
        return res.status(500).json({ message: "Invalid AI response" });
      }
      const data = await InterviewData.findById(modelId);
      const question = data.questions[previousQuestions.length];

      let transitionData = transition.trim();

      if (!question) {
        if (transitionData.endsWith(",")) {
          transitionData = transitionData.slice(0, -1) + ".";
        } else if (!transitionData.endsWith(".")) {
          transitionData += ".";
        }
      } else {
        if (transitionData.endsWith(".")) {
          transitionData = transitionData.slice(0, -1) + ",";
        } else if (!transitionData.endsWith(",")) {
          transitionData += ",";
        }
      }

      data.answers[previousQuestions.length - 1] = givenAnswer;
      await data.save();

      let responseData = "";

      if (!question) {
        responseData = feedback + " " + transitionData;
      } else {
        responseData = feedback + " " + transitionData + " " + question.question;
      }

      return res.status(200).json({
        message: "Question generated!",
        question,
        responseData,
        finishInterview
      });
    }

  } catch (err) {
    console.error("Error in generateQuestions:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};




export const checkRoleAndTopic = async (req, res) => {

  const { role, topic, numOfQns } = req.body;
  const participant = req.user._id;

  if (!role || !topic || !numOfQns) {
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
      - If valid, generate oral interview questions.

      Constraints:
      1. Generate exactly ${numOfQns} questions.
      2. Each question should be answerable in 30–60 seconds.
      3. No repetition.
      4. Keep questions concise and role-relevant.
      5. Add time (seconds):
        - Simple: 30–35
        - Conceptual: 40–50
        - Scenario: 50–60

      Return STRICT JSON:

      If valid:
      {
        "valid": true,
        "questions": [
          { "question": "text", "time": 30 }
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

    questions = questions.map(q => ({
      ...q,
      time: q.time ?? 45
    }));

    const newData = new InterviewData({
      participant,
      questions,
      answers: questions.map(() => "Answer Not Provided.")
    });

    await newData.save();

    const interviewModelId = newData._id;

    return res.status(200).json({
      message: "Questions generated successfully",
      response: parsed,
      interviewModelId
    });

  } catch (err) {
    console.error("Groq Error:", err.message);
    return res.status(500).json({ message: "Server Error" });
  }
};




















