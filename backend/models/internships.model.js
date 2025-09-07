import mongoose from "mongoose";

const InternshipSchema = new mongoose.Schema(
  {
    jobTitle: { type: String, required: true, trim: true },
    jobRole: { type: String, required: true, trim: true },
    jobTopic: { type: String, trim: true , required: true},
    duration: { type: String, trim: true , required: true},
    type: { type: String, trim: true , required: true}, 
    company: { type: String, trim: true , required: true},
    stipend: { type: String, trim: true , required: true},
    jobType: { type: String, trim: true , required: true}, 
    lastDate: { type: String, trim: true , required: true}, 
    description: { type: String, trim: true , required: true},
    numOfQns: {type: Number, required: true},
    embedding: {
      type: [Number],
      required: true,
      index: "2dsphere" 
    }
  },
  { timestamps: true }
);

export default mongoose.model("Internship", InternshipSchema, "new_internships_data");
