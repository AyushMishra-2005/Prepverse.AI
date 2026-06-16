import axios from 'axios';
import InterviewData from '../models/interview.model.js';
import Groq from "groq-sdk";
import dotenv from 'dotenv'
import { validateRoleAndTopic } from "../utils/validateRoleAndTopic.js";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export const generateQuestionsReview = async (req, res) => {
  const { modelId } = req.body;
  let { givenAnswer } = req.body;
  const { email } = req.user;
  const userId = req.user._id;

  if (!modelId) {
    return res.status(500).json({ message: "Must provide a modelId!" });
  }

  givenAnswer = givenAnswer?.trim() || "Answer Not Provided.";

  const data = await InterviewData.findById(modelId)
    .populate("participant", "name email");

  if (!data) {
    return res.status(404).json({
      message: "Interview not found."
    });
  }

  const {
    role,
    topic,
    numOfQns,
    questions,
    answers,
    reviews,
    participant
  } = data;

  const { name, email } = participant;

  try {
    let prompt;
    let aiResponse;
    let response;
    let finishInterview = false;

    if (questions.length === 0) {
      const prompt = `You are conducting a professional interview for a ${role} position, focusing on ${topic}.

        The candidate's name is ${name}.

        Generate the following:

        1. WELCOME MESSAGE
        - Warm and professional.
        - Address the candidate by name.
        - Mention the ${role} position naturally.
        - Under 70 words.
        - Do not mention AI, mock interviews, or evaluation.

        2. TRANSITION
        - A short phrase only.
        - No question mark.
        - Examples:
          - "Let's begin with"
          - "To get started"
          - "We'll start by discussing"

        3. FIRST INTERVIEW QUESTION
        Rules:
        - Ask exactly one question.
        - It must be related to ${topic}.
        - Suitable for a 30–60 second spoken answer.
        - Clear and concise.
        - Do not combine multiple questions.

        4. TIME
        Return an appropriate time in seconds:
        - Simple: 30–35
        - Conceptual: 40–50
        - Scenario-based: 50–60

        Return STRICT JSON only.

        {
          "addressing": "...",
          "transition": "...",
          "question": "...",
          "time": 45
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

      const { addressing, transition, question, time } = response;

      if (!addressing || !transition || !question || !time) {
        return res.status(500).json({ message: "Failed to generate question!" });
      }

      const data = await InterviewData.findById(modelId);
      data.questions.push({
        question,
        time
      });

      await data.save();

      const responseData =
        `${addressing} ${transition}, ${question}`;

      return res.status(200).json({
        message: "Question generated!",
        question: {
          question,
          time
        },
        responseData,
        finishInterview: false
      });

    } else {

      const previousQuestion = questions[questions.length - 1]?.question || "";

      const previousQuestions = questions
        .map((q, index) => `Question ${index + 1}: ${q.question}`)
        .join("\n");

      const previousAnswers = answers
        .map((answer, index) => `Answer ${index + 1}: ${answer}`)
        .join("\n");

      if (questions.length == numOfQns) {
        prompt = `
          You are conducting a professional interview for the role of ${role} focusing on ${topic}.

          Candidate Name: ${name}

          Final Question:
          ${previousQuestion}

          Final Answer:
          ${givenAnswer}

          The interview has now ended. Do NOT generate another question.

          Generate:

          1. FEEDBACK
          - Exactly 2 professional sentences.
          - Evaluate only the candidate's final answer.
          - Use "you" and "your".
          - Be objective and factual.
          - Do not give suggestions or praise.

          2. CLOSING MESSAGE
          - Thank the candidate for participating.
          - 2–3 professional sentences.
          - Professional and friendly.
          - End the interview naturally.
          - Do not mention AI or mock interviews.

          Return STRICT JSON:

          {
            "feedback": "text",
            "closing": "text"
          }`;

        finishInterview = true;

      } else {
        prompt = `
          You are conducting a professional interview for the role of ${role} focusing on ${topic}.

          Candidate Name: ${name}

          Interview History:
          ${previousQuestions}

          Latest Question:
          ${previousQuestion}

          Latest Answer:
          ${givenAnswer}

          Generate:

          1. FEEDBACK
          - Exactly 2 professional sentences.
          - Evaluate only the latest answer.
          - Use "you" and "your".
          - Be objective and factual.
          - Do not give suggestions or praise.

          2. TRANSITION
          - A short transition phrase.
          - Examples:
            - "Next, let's discuss"
            - "Moving on to"
            - "Now, let's explore"
          - No question mark.
          - End with ":" or "...".

          3. NEXT QUESTION
          - Generate exactly one interview question.
          - Do NOT repeat any previous question.
          - If the candidate mentions an interesting technology, framework, project, implementation, optimization, design decision, or any topic that deserves deeper discussion, ask one relevant follow-up question to explore it further.
          - Follow-up questions should be used occasionally, not after every answer.
          - Otherwise, generate a new question covering another important aspect of ${topic}.
          - Maintain or gradually increase the interview difficulty.
          - The question should be answerable in 30–60 seconds.

          4. TIME
          Return the estimated answer time in seconds:
          - Simple: 30–35
          - Conceptual: 40–50
          - Scenario: 50–60

          Return STRICT JSON:

          {
            "feedback": "text",
            "transition": "text",
            "question": "text",
            "time": 45
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

      if (finishInterview) {
        const { feedback, closing } = response;

        if (!feedback || !closing) {
          return res.status(500).json({
            message: "Invalid AI response."
          });
        }

        data.answers.push(givenAnswer);

        data.reviews.push({
          review: feedback
        });

        await data.save();

        return res.status(200).json({
          message: "Interview completed.",
          responseData: `${feedback} ${closing}`,
          finishInterview: true
        });
      } else {
        const {
          feedback,
          transition,
          question,
          time
        } = response;

        if (!feedback || !transition || !question) {
          return res.status(500).json({
            message: "Invalid AI response."
          });
        }

        const questionTime = time ?? 45;

        data.answers.push(givenAnswer);

        data.reviews.push({
          review: feedback
        });

        data.questions.push({
          question,
          time: questionTime
        });

        await data.save();

        let transitionData = transition.trim();

        if (transitionData.endsWith(".")) {
          transitionData =
            transitionData.slice(0, -1) + ",";
        }
        else if (!transitionData.endsWith(",")) {
          transitionData += ",";
        }

        const responseData =
          `${feedback} ${transitionData} ${question}`;

        return res.status(200).json({
          message: "Question generated.",
          question: {
            question,
            time: questionTime
          },
          responseData,
          finishInterview: false
        });

      }




    }

  } catch (err) {
    console.error("Error in generateQuestions:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};




export const createCandidateInterview = async (req, res) => {
  const { role, topic, numOfQns } = req.body;
  const participant = req.user._id;

  if (!role || !topic || !numOfQns) {
    return res.status(400).json({
      message: "Provide valid inputs."
    });
  }

  if (numOfQns < 2 || numOfQns > 10) {
    return res.status(400).json({
      message: "Please provide a number of questions between 2 and 25."
    });
  }

  try {
    const topics = [topic];

    const { valid, invalidTopics } = await validateRoleAndTopic({
      role,
      topics
    });

    if (!valid) {
      return res.status(400).json({
        message: "Invalid role-topic combination.",
        invalidTopics
      });
    }

    const interview = await InterviewData.create({
      participant,
      role,
      topic,
      numOfQns,
      questions: [],
      answers: [],
      reviews: []
    });

    return res.status(200).json({
      message: "Interview created successfully.",
      interviewModelId: interview._id
    });

  } catch (err) {
    console.error("Create Interview Error:", err.message);

    return res.status(500).json({
      message: "Server Error."
    });
  }
};



















