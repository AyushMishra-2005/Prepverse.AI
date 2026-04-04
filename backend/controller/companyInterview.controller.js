import dotenv from 'dotenv'
dotenv.config();

import CompanyInterviewData from "../models/companyInterview.model.js";
import User from '../models/user.model.js'
import axios from 'axios'
import { validateRoleAndTopic } from '../utils/validateRoleAndTopic.js'
import { generateQuestions } from '../utils/generateQuestions.js'
import InterviewData from "../models/interview.model.js";
import { evaluateResult } from "../utils/evaluateResult.js";
import Internship from "../models/internships.model.js";
import { sendTemplateMessage, sendTextMessage } from '../utils/sendWhatsappMessage.js'
import { emailApi } from '../config/bravo.config.js';

const GEOAPIFY_KEY = process.env.GEOAPIFY_KEY;

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
    location
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
    location
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

    const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(location)}&apiKey=${GEOAPIFY_KEY}`;

    const geoResponse = await axios.get(url);
    const locationData = geoResponse.data;
    let lat;
    let lon;

    if (locationData.features && locationData.features.length > 0) {
      const propertiesObject = locationData.features[0].properties;
      lat = propertiesObject.lat;
      lon = propertiesObject.lon;
    } else {
      console.log("No coordinates found for", location);
      return res.status(500).json({ message: "No coordinates found for!" });
    }

    const { valid } = await validateRoleAndTopic({ role, topics });

    if (!valid) {
      return res.status(500).json({ message: "Role and Topic are not valid!" });
    }

    const { data } = await axios.post("http://127.0.0.1:5000/embed", requiredFields);
    if (!data) {
      return res.status(500).json({ message: "Server error!" });
    }

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
      locationName: location,
      location: {
        type: 'Point',
        coordinates: [lon, lat]
      },
    });
    await newData.save();

    const eligibleUsers = await axios.post("http://127.0.0.1:5000/eligible_users", {
      internshipId: newData._id,
    });

    const eligible_users = eligibleUsers.data.eligible_users || [];

    const userIds = eligible_users.map(u => u.userId);

    const users = await User.find(
      { _id: { $in: userIds } },
      { name: 1, email: 1, mobileNumber: 1 }
    );

    console.log(users);


    for (const user of users) {
      await emailApi.sendTransacEmail({
        sender: {
          email: process.env.SENDER_EMAIL,
          name: "Prepverse.AI"
        },
        to: [
          {
            email: user.email
          }
        ],
        subject: `🚀 Internship Opportunity: ${jobTitle} at ${company}`,
        htmlContent: `
          <!DOCTYPE html>
          <html>
          <body style="margin:0; padding:0; background-color:#0D0D0D; font-family:Arial, sans-serif;">

            <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0;">
              <tr>
                <td align="center">

                  <!-- Card -->
                  <table width="600" cellpadding="0" cellspacing="0" 
                    style="background:#141414; border-radius:12px; padding:30px; box-shadow:0 0 25px rgba(255,105,0,0.15);">

                    <!-- Header -->
                    <tr>
                      <td align="center" style="padding-bottom:20px;">
                        <h1 style="margin:0; color:#FF6900; font-size:26px;">
                          Prepverse.AI 🚀
                        </h1>
                      </td>
                    </tr>

                    <!-- Greeting -->
                    <tr>
                      <td style="color:#FFFFFF; font-size:16px; line-height:1.6;">
                        <p style="margin:0 0 10px;">Hello <strong>${user.name}</strong>,</p>

                        <p style="margin:0 0 15px; color:#CCCCCC;">
                          We found an <span style="color:#FF6900; font-weight:bold;">internship opportunity</span> 
                          that perfectly matches your profile!
                        </p>
                      </td>
                    </tr>

                    <!-- Job Card -->
                    <tr>
                      <td style="padding:15px 0;">
                        <div style="
                          padding:20px;
                          border:1px solid #2A2A2A;
                          border-radius:10px;
                          background:#1A1A1A;
                          box-shadow:0 0 15px rgba(255,105,0,0.15);
                        ">

                          <h2 style="color:#FF6900; margin:0 0 10px;">
                            ${jobTitle}
                          </h2>

                          <p style="margin:6px 0; color:#CCCCCC;"><strong>Role:</strong> ${jobRole}</p>
                          <p style="margin:6px 0; color:#CCCCCC;"><strong>Duration:</strong> ${duration}</p>
                          <p style="margin:6px 0; color:#CCCCCC;">
                            <strong>Company:</strong> 
                            <span style="color:#FF8C00; font-weight:bold;">${company}</span>
                          </p>
                          <p style="margin:6px 0; color:#CCCCCC;"><strong>Stipend:</strong> ${stipend}</p>
                          <p style="margin:6px 0; color:#CCCCCC;"><strong>Location:</strong> ${location}</p>

                        </div>
                      </td>
                    </tr>

                    <!-- CTA -->
                    <tr>
                      <td align="center" style="padding:25px 0;">
                        <a href="https://prepverse-ai.onrender.com/"
                          style="
                            background:linear-gradient(90deg,#FF6900,#FF8C00);
                            color:#ffffff;
                            padding:14px 30px;
                            text-decoration:none;
                            border-radius:8px;
                            font-weight:bold;
                            display:inline-block;
                            box-shadow:0 0 15px rgba(255,105,0,0.6);
                          ">
                          Apply Now 🚀
                        </a>
                      </td>
                    </tr>

                    <!-- Message -->
                    <tr>
                      <td style="color:#CCCCCC; font-size:14px; text-align:center;">
                        <p style="margin:0;">
                          🌟 Don’t miss this chance to grow your skills and advance your career.
                        </p>
                      </td>
                    </tr>

                    <!-- Divider -->
                    <tr>
                      <td style="padding-top:25px;">
                        <hr style="border:none; border-top:1px solid #2A2A2A;">
                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="text-align:center; color:#888888; font-size:13px; padding-top:10px;">
                        <p style="margin:5px 0;">Best regards,</p>
                        <p style="margin:5px 0; color:#FF6900;"><b>The Prepverse.AI Team</b></p>
                        <p style="margin:5px 0;">
                          <a href="https://prepverse-ai.onrender.com/" style="color:#FF6900; text-decoration:none;">
                            www.prepverse.com
                          </a>
                        </p>
                        <p style="margin:5px 0;">support@prepverse.com</p>
                      </td>
                    </tr>

                  </table>

                </td>
              </tr>
            </table>

          </body>
          </html>
          `
      });

      if (user.mobileNumber) {
        await sendTextMessage({
          to: user.mobileNumber,
          name: user.name,
          jobTitle,
          jobRole,
          duration,
          company,
          stipend,
        });
      }
    }

    return res.status(200).json({
      message: "Interview Data Created & Emails Sent",
      newData,
      notifiedUsers: users.map(u => u.email),
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};


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

















