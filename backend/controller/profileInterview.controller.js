import axios from 'axios'
import { validateRoleAndTopic } from '../utils/validateRoleAndTopic.js'
import fs from 'fs'
import FormData from 'form-data';
import { deleteFile } from '../utils/deleteFile.js';
import { generateInterviewQuestions } from '../utils/generateProfileInterviewQuestions.js';
import InterviewData from '../models/interview.model.js';


export const checkRoleValidity = async (req, res) => {

  let { role, topics, numberOfQns } = req.body;
  const participant = req.user._id;

  if (typeof topics === "string") {
    topics = [topics];
  }

  if (!req.file) {
    return res.status(400).json({ message: "No file provided" });
  }

  const filePath = req.file.path;

  if (
    !role?.trim() ||
    !Array.isArray(topics) ||
    topics.length === 0 ||
    !topics.some(topic => topic.trim() !== "") ||
    !numberOfQns
  ) {
    deleteFile(filePath);
    return res.status(400).json({ message: "Please provide a valid role and at least one non-empty topic." });
  }

  const form = new FormData();
  form.append("file", fs.createReadStream(filePath), req.file.originalname);

  try {

    const { valid } = await validateRoleAndTopic({ role, topics });

    console.log(valid);

    if (!valid) {
      deleteFile(filePath);
      return res.status(501).json({ message: "Not valid role and topic" });
    }

    const flaskUrl = "https://prepverse-ai-python-server.onrender.com/parse-resume";

    const { data } = await axios.post(flaskUrl, form, {
      headers: form.getHeaders(),
    });


    if (data.resume_data) {

      console.log("Resume Parsed");
    
      const resume_data = data.resume_data;
      const job_title = role;

      const response = await axios.post(
        'https://prepverse-ai-python-server.onrender.com/evaluate-resume',
        {resume_data, job_title, topics}
      );

      console.log(response.data.evaluation);

      if(response.data.evaluation.total_score <= 3){
        return res.status(501).json({message : "Resume doesn't fit for the Role"});
      }

      const questions = await generateInterviewQuestions(
        data.resume_data,
        role,
        Array.isArray(topics) ? topics : topics.split(","),
        parseInt(numberOfQns) || 5
      );

      console.log(questions)

      if(questions){
        const newData = new InterviewData({
          participant,
          questions,
          answers: questions.map(() => "Answer Not Provided.")
        });

        await newData.save();

        const interviewModelId = newData._id;

        deleteFile(filePath);

        return res.status(200).json({message : "process successfull", interviewModelId});

      }

      deleteFile(filePath);
      return res.status(200).json({
        resume_data: data.resume_data,
        questions,
        message : "Resume Parsing successful"
      });

    } else {
      deleteFile(filePath);
      return res.status(500).json({ message: "Resume parsing failed." });
    }

    

  } catch (err) {
    console.log(err);
    deleteFile(filePath);
    return res.status(501).json({ message: "server error" });
  }
}





























