import Internship from "../models/internships.model.js";
import ResumeData from "../models/resumeData.model.js";
import Recommendation from "../models/recommendation.model.js";
import axios from "axios";

export const generateRecommendations = async (userId, filters = {}) => {
  const resumeData = await ResumeData.findOne({ userId });

  if (!resumeData) {
    throw new Error("Resume data not found.");
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
    throw new Error("Failed to generate recommendations.");
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

  return await getSavedRecommendations(userId);
};

export const getSavedRecommendations = async (userId) => {
  const recommendation = await Recommendation.findOne({ userId });

  if (!recommendation) {
    return null;
  }

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

  return recommend_internships;
};