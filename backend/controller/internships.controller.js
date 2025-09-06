import Internship from "../models/internships.model.js";
import ResumeData from "../models/resumeData.model.js";
import axios from 'axios';

export const getMatchedInternships = async (req, res) => {
  const userId = req.user._id;
  try{

    const resumeData = await ResumeData.findOne({userId});

    if(!resumeData){
      return res.status(200).json({message : "resume data not found!", resumeData});
    }

    console.log(resumeData.resumeReview);


    const {data} = await axios.post(
      'http://127.0.0.1:5000/recommend',
      {summary : resumeData.resumeReview}
    );

    if(!data){
      return res.status(400).json({message : "server error!", resumeData});
    }

    const recommend_internships = data;

    return res.status(200).json({
      message : "resume data not found!",
      recommend_internships
    });

  }catch(err){
    console.log(err);
  }
}
















































