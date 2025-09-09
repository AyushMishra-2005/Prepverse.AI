import CompanyInterviewData from "../models/companyInterview.model.js";
import User from '../models/user.model.js'
import axios from 'axios'
import { validateRoleAndTopic } from '../utils/validateRoleAndTopic.js'
import { generateQuestions } from '../utils/generateQuestions.js'
import InterviewData from "../models/interview.model.js";
import { evaluateResult } from "../utils/evaluateResult.js";
import Internship from "../models/internships.model.js";

export const createCompanyInterview = async (req, res) => {
  const userId = req.user._id;
  const {
    jobTitle,
    jobRole,
    jobTopic,
    duration,
    type,
    company,
    stipend,
    jobType,
    lastDate,
    description,
    numOfQns,
  } = req.body;


  const requiredFields = {
    jobTitle,
    jobRole,
    jobTopic,
    duration,
    type,
    company,
    stipend,
    jobType,
    lastDate,
    description,
    numOfQns,
  };

  const missingFields = Object.entries(requiredFields)
    .filter(([key, value]) => !value || (Array.isArray(value) && value.length === 0))
    .map(([key]) => key);

  if (!userId || missingFields.length > 0) {
    return res.status(400).json({
      message: `Missing required fields: ${missingFields.join(", ")}`,
    });
  }


  try {
    const role = jobRole;
    const topics = jobTopic.split(",").map(t => t.trim());
    const { valid } = await validateRoleAndTopic({ role, topics });

    console.log(valid);

    if (!valid) {
      return res.status(500).json({ message: 'Role and Topic are not valid!' });
    }

    const { data } = await axios.post(
      'http://127.0.0.1:5000/embed',
      requiredFields
    );

    if (!data) {
      return res.status(500).json({ message: 'Server error!' });
    }

    console.log(data);

    const newData = new Internship({
      jobTitle,
      jobRole,
      jobTopic,
      duration,
      type,
      company,
      stipend,
      jobType,
      lastDate,
      description,
      numOfQns,
      embedding: data.embedding,
    });
    await newData.save();

    return res.status(200).json({ message: 'Interview Data Created', newData });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Server error' });
  }
}


export const sendAllInterviews = async (req, res) => {
  const userId = req.user._id;

  if (!userId) {
    return res.status(400).json({ message: 'Please provide valid data' });
  }

  try {
    const internships = await Internship.aggregate([
      { $sample: { size: 5 } },
      { $project: { embedding: 0 } }
    ]);

    return res.status(200).json({ message: 'Interview Data Fetched', internships });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Server error' });
  }
}


export const searchInterviews = async (req, res) => {
  const { companyName } = req.body;
  
  try {
    if (!companyName || companyName.trim() === '') {
      return res.status(400).json({ message: 'Username is required' });
    }

    const internships = await Internship.find(
      { company: { $regex: "^" + companyName, $options: "i" } },
      { embedding: 0 }
    ).limit(5);

    return res.status(200).json({ interviews: internships });


  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};


export const generateInterviewQuestions = async (req, res) => {
  const { role, numOfQns, topic, interviewId } = req.body;

  console.log("Number of questions");

  const participant = req.user._id;

  if (!interviewId || !role || !numOfQns || !topic) {
    return res.status(400).json({ message: 'Please provide valid data' });
  }

  try {

    const existing = await InterviewData.findOne({ interviewId, participant });
    if (existing) {
      return res.status(409).json({
        message: 'Already attended the Interview!'
      });
    }

    const questions = await generateQuestions({ role, topic, numOfQns });

    const interviewData = new InterviewData({
      interviewId,
      participant,
      questions,
      answers: questions.map(() => "Answer Not Provided.")
    });

    await interviewData.save();

    return res.status(200).json({ interviewData });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Server error' });
  }
}


export const evaluateInterviewResult = async (req, res) => {

  const { interivewId } = req.body;

  if (!interivewId) {
    return res.status(501).json({ message: "Missing interviewId" });
  }

  try {

    const interviewData = await InterviewData.findById(interivewId).populate("participant", "name email username profilePicURL").populate("interviewId");

    const { questions, answers } = interviewData;

    const result = await evaluateResult({ questions, answers });

    const { reviews, totalScore, overAllReview } = result;

    interviewData.reviews = reviews;
    interviewData.totalScore = totalScore;
    interviewData.overAllReview = overAllReview;

    await interviewData.save();

    res.status(200).json({ message: "Interview data saved!", interviewData });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Server error' });
  }
}


export const getAllCandidates = async (req, res) => {

  const { interviewId } = req.body;

  if (!interviewId) {
    return res.status(501).json({ message: "Missing interviewId" });
  }

  try {

    const candidates = await InterviewData.find({ interviewId }).populate("participant", "name email username profilePicURL").populate("interviewId");

    return res.status(200).json({ candidates });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

















