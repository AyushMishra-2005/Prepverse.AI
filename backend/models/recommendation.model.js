import mongoose from "mongoose";

const recommendationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    internships: [
      {
        internshipId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Internship",
          required: true,
        },
        score: Number,
      },
    ],
    generatedAt: {
      type: Date,
      default: Date.now,
    },
    resumeVersion: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

const Recommendation = mongoose.model("Recommendation", recommendationSchema);

export default Recommendation;