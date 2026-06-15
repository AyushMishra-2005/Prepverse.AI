import Internship from "../models/internships.model.js";
import ResumeData from "../models/resumeData.model.js";
import Recommendation from "../models/recommendationModel.js";
import axios from 'axios';

export const getMatchedInternships = async (req, res) => {
  const userId = req.user._id;
  const { filters } = req.body;

  try {
    const resumeData = await ResumeData.findOne({ userId });

    if (!resumeData) {
      return res.status(404).json({
        message: "Resume data not found.",
      });
    }

    const { data } = await axios.post(
      "http://127.0.0.1:5000/recommend",
      {
        embedding: resumeData.embedding,
        filters,
        resumeSummary: resumeData.resumeReview,
      }
    );

    if (!data) {
      return res.status(500).json({
        message: "Failed to generate recommendations.",
      });
    }

    const internships = data.map((internship) => ({
      internshipId: internship._id,
      score: internship.rerank_score,
    }));

    await Recommendation.findOneAndUpdate(
      { userId },
      {
        userId,
        internships,
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
      }
    );

    const recommendation = await Recommendation.findOne({ userId });

    const internshipIds = recommendation.internships.map(
      (item) => item.internshipId
    );

    const recommend_internships = await Internship.find({
      _id: { $in: internshipIds },
    }).lean();

    const scoreMap = new Map(
      recommendation.internships.map((item) => [
        item.internshipId.toString(),
        item.score,
      ])
    );

    recommend_internships.forEach((internship) => {
      internship.rerank_score = scoreMap.get(
        internship._id.toString()
      );
    });

    recommend_internships.sort(
      (a, b) => b.rerank_score - a.rerank_score
    );

    return res.status(200).json({
      message: "Recommendations generated successfully.",
      recommend_internships,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Internal server error.",
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









































