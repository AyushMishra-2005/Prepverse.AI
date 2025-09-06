import mongoose from "mongoose";

const InternshipSchema = new mongoose.Schema(
  {
    jobTitle: { type: String, required: true, trim: true },
    jobRole: { type: String, required: true, trim: true },
    jobTopic: { type: String, trim: true },
    duration: { type: String, trim: true },
    type: { type: String, trim: true }, 
    company: { type: String, trim: true },
    stipend: { type: String, trim: true },
    jobType: { type: String, trim: true }, 
    lastDate: { type: String, trim: true }, 
    description: { type: String, trim: true },
    skills: { type: [String], default: [] },

    embedding: {
      type: [Number],
      required: true,
      index: "2dsphere" 
    }
  },
  { timestamps: true }
);

export default mongoose.model("Internship", InternshipSchema, "new_internships_data");
