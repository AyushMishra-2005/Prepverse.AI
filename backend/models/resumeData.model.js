import mongoose from "mongoose";
import { Schema } from "mongoose";

const resumeDataSchema = new Schema(
  {
    userId : {
      type : mongoose.Schema.Types.ObjectId,
      ref : 'User',
      required : true
    },

    resumeLink: {
      type : String,
      required : true,
    },

    resumeJSONdata: {
      type : Schema.Types.Mixed,
      required: true,
    },

    resumeDetails: {
      type : String,
      required: true
    }
  },
  {
    timestamps: true,
  }
);


const resumeData = mongoose.model('resumeData', resumeDataSchema);

export default resumeData;




























