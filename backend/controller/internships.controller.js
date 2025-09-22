import Internship from "../models/internships.model.js";
import ResumeData from "../models/resumeData.model.js";
import axios from 'axios';

export const getMatchedInternships = async (req, res) => {
  const userId = req.user._id;
  const { filters } = req.body;
  try {

    const resumeData = await ResumeData.findOne({ userId });

    if (!resumeData) {
      return res.status(200).json({ message: "resume data not found!", resumeData });
    }


    const { data } = await axios.post(
      'http://127.0.0.1:5000/recommend',
      {
        embedding: resumeData.embedding,
        filters,
        resumeSummary: resumeData.resumeReview,
      }
    );

    if (!data) {
      return res.status(400).json({ message: "server error!", resumeData });
    }

    const recommend_internships = data;

    return res.status(200).json({
      message: "resume data not found!",
      recommend_internships
    });

  } catch (err) {
    console.log(err);
  }
}


export const getLocations = async (req, res) => {
  const { location } = req.body;

  if (!location || !location.trim()) {
    return res.status(400).json({ message: "Please provide a valid location." });
  }

  try {
    const locations = await Internship.aggregate([
      {
        $match: {
          locationName: { $regex: location, $options: "i" }
        }
      },
      {
        $group: {
          _id: "$locationName"
        }
      },
      {
        $limit: 5
      }
    ]);

    const uniqueLocations = locations.map((loc) => loc._id);

    return res.status(200).json({ locations: uniqueLocations });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error fetching locations." });
  }
};









































