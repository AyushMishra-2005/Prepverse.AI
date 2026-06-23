import axios from 'axios'
import { validateRoleAndTopic } from '../utils/validateRoleAndTopic.js'
import fs from 'fs'
import FormData from 'form-data';
import { deleteFile } from '../utils/deleteFile.js';
import { generateInterviewQuestions } from '../utils/generateProfileInterviewQuestions.js';
import InterviewData from '../models/interview.model.js';
import { io, getUserSocketId } from '../SocketIO/server.js'
import ResumeData from '../models/resumeData.model.js';
import { evaluateResume } from '../utils/evaluateResume.js'
import { parseResumeWithLLM } from '../utils/resumeParser.js'



export const checkRoleValidity = async (req, res) => {

  let { role, topics, numberOfQns } = req.body;
  const participant = req.user._id;

  if (typeof topics === "string") {
    topics = [topics];
  }

  if (
    !role?.trim() ||
    !Array.isArray(topics) ||
    topics.length === 0 ||
    !topics.some(topic => topic.trim() !== "") ||
    !numberOfQns
  ) {
    return res.status(400).json({ message: "Please provide a valid role and at least one non-empty topic." });
  }

  const userSocketId = getUserSocketId(participant);
  if (!userSocketId) {
    return res.status(400).json({ message: "User Socket ID not found!" });
  }

  try {

    const { valid } = await validateRoleAndTopic({ role, topics });
    io.to(userSocketId).emit("validateRoleAndTopic", { valid });

    if (!valid) {
      return res.status(501).json({ message: "Not valid role and topic" });
    }

    const data = await ResumeData.findOne({userId : participant});

    if (!data) {
      return res.status(400).json({ message: "Parsing Resume Failed!" });
    }

    const resume_data = data.resumeJSONdata;

    if (resume_data) {

      io.to(userSocketId).emit("resumeParsed");

      const job_title = role;

      const evaluation = await evaluateResume(resume_data, job_title, topics);

      const totalScore = evaluation.total_score;
      const summaryFeedback = evaluation.summary_feedback;

      if (totalScore < 30) {
        io.to(userSocketId).emit("resumeScore", { totalScore, summaryFeedback });
        return res.status(501).json({ message: "Resume doesn't fit for the Role" });
      }

      io.to(userSocketId).emit("resumeScore", { totalScore, summaryFeedback });

      
      const newData = new InterviewData({
        participant,
        role,
        topics, 
        numOfQns: numberOfQns
      });

      await newData.save();

      const interviewModelId = newData._id;

      io.to(userSocketId).emit("questionsGenerated");

      return res.status(200).json({ message: "process successfull", interviewModelId });

    } else {
      return res.status(500).json({ message: "Resume parsing failed." });
    }

  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "server error" });
  }
}



export const profileBasedInterview = async (req, res) => {
  let { role, topics, numberOfQns, interviewId } = req.body;
  const participant = req.user._id;

  if (typeof topics === "string") {
    topics = [topics];
  }

  if (
    !role?.trim() ||
    !Array.isArray(topics) ||
    topics.length === 0 ||
    !topics.some(topic => topic.trim() !== "") ||
    !numberOfQns ||
    !interviewId
  ) {
    return res.status(400).json({ message: "Please provide a valid role and at least one non-empty topic." });
  }

  try {
    const existing = await InterviewData.findOne({ interviewId, participant });
    if (existing) {
      return res.status(409).json({
        message: 'Already attended the Interview!'
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Server issue." });
  }


  const userSocketId = getUserSocketId(participant);
  if (!userSocketId) {
    return res.status(400).json({ message: "User Socket ID not found!" });
  }

  try {

    const { valid } = await validateRoleAndTopic({ role, topics });
    io.to(userSocketId).emit("validateRoleAndTopic", { valid });

    const data = await ResumeData.findOne({ userId: participant });

    if (!data.resumeJSONdata) {
      return res.status(501).json({ message: "Resume Data not found!" });
    }


    io.to(userSocketId).emit("resumeParsed");

    const resume_data = data.resumeJSONdata;
    const job_title = role;

    const evaluation = await evaluateResume(resume_data, job_title, topics);

    const totalScore = evaluation.total_score;
    const summaryFeedback = evaluation.summary_feedback;

    if (response.data.evaluation.total_score < 30) {
      io.to(userSocketId).emit("resumeScore", { totalScore, summaryFeedback });
      return res.status(501).json({ message: "Resume doesn't fit for the Role" });
    }

    io.to(userSocketId).emit("resumeScore", { totalScore, summaryFeedback });

    const questions = await generateInterviewQuestions(
      resume_data,
      role,
      Array.isArray(topics) ? topics : topics.split(","),
      parseInt(numberOfQns) || 3
    );

    if (questions) {
      const newData = new InterviewData({
        interviewId,
        participant,
        questions,
        answers: questions.map(() => "Answer Not Provided.")
      });

      await newData.save();

      const interviewModelId = newData._id;

      io.to(userSocketId).emit("questionsGenerated");

      return res.status(200).json({ message: "process successfull", interviewModelId });

    }


    return res.status(200).json({
      resume_data: data.resume_data,
      questions,
      message: "Resume Parsing successful"
    });

  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "server error" });
  }
}


export const checkResumeData = async (req, res) => {
  try {
    const userId = req.user._id;
    
    if (!userId) {
      return res.status(400).json({ 
        exists: false,
        message: "User ID not found" 
      });
    }

    const data = await ResumeData.findOne({ userId });

    if (!data || !data.resumeJSONdata) {
      return res.status(200).json({ 
        exists: false,
        message: "Resume data not found!" 
      });
    }

    return res.status(200).json({
      exists: true,
      message: "Resume data found",
    });

  } catch (err) {
    console.error("Error checking resume data:", err);
    return res.status(500).json({ 
      exists: false,
      message: "Server error while checking resume data"
    });
  }
}





















