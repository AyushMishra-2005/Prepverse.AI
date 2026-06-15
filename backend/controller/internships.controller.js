import Internship from "../models/internships.model.js";
import ResumeData from "../models/resumeData.model.js";
import { generateRecommendations, getSavedRecommendations } from "../utils/recommendation.js";
import axios from 'axios';

export const recommendInternships = async (req, res) => {
  const userId = req.user._id;
  const { filters } = req.body;

  try {
    const recommend_internships = await generateRecommendations(
      userId,
      filters
    );

    return res.status(200).json({
      message: "Recommendations generated successfully.",
      recommend_internships,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: err.message,
    });
  }
};

export const getRecommendedInternships = async (req, res) => {
  const userId = req.user._id;

  try {
    let recommend_internships = await getSavedRecommendations(userId);

    if (!recommend_internships) {
      recommend_internships = await generateRecommendations(
        userId,
        {}
      );
    }

    return res.status(200).json({
      recommend_internships,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: err.message,
    });
  }
};


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









































