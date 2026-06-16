import mongoose from "mongoose";
import { Schema } from "mongoose";

const interviewSchema = new Schema(
  {
    interviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Internship",
    },

    participant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    topic: {
      type: String,
      required: true,
      trim: true,
    },

    numOfQns: {
      type: Number,
      required: true,
      min: 2,
      max: 25,
    },

    questions: {
      type: [
        {
          question: {
            type: String,
            required: true,
          },
          time: {
            type: Number,
            required: true,
          },
        },
      ],
      required: true,
    },

    answers: {
      type: [String],
      required: true,
    },

    reviews: [
      {
        review: {
          type: String,
        },
        score: {
          type: Number,
        },
      },
    ],

    totalScore: {
      type: Number,
    },

    overAllReview: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const InterviewData = mongoose.model("InterviewData", interviewSchema);

export default InterviewData;






















