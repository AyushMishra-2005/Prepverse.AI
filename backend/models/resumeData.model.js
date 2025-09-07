import mongoose from "mongoose";
import { Schema } from "mongoose";

const resumeDataSchema = new Schema(
  {
    userId : {
      type : mongoose.Schema.Types.ObjectId,
      ref : 'User',
      required : true,
      unique: true,
    },

    resumeLink: {
      type : String,
      required : true,
    },

    resumeJSONdata: {
      type : Schema.Types.Mixed,
      required: true,
    },

    resumeReview: {
      type: String,
      required: true,
    }

  },
  {
    timestamps: true,
  }
);


const ResumeData = mongoose.model('resumeData', resumeDataSchema);

export default ResumeData;




























