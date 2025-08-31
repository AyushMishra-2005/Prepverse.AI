import React, { useState } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import mockInterview from "../assets/animations/mockInterview.json"; 
import { useNavigate } from "react-router-dom";
import ProfileInterviewForm from "./profileInterviewForm";
import CheckCameraAndMic from "../components/checkCameraAndMic";

export function MockInterviewLandingPage() {
  const navigate = useNavigate();

  const [profileForm, setProfileForm] = useState(false);
  const [topicForm, setTopicForm] = useState(false);

  if(profileForm){
    return(
      <CheckCameraAndMic onContinue={() => navigate("/profileInterviewForm")}/>
    )
  }

  if(topicForm){
    return(
      <CheckCameraAndMic onContinue={() => navigate("/interviewForm")}/>
    )
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white px-6 py-10 flex flex-col md:flex-row items-center justify-center gap-40">

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="w-[250px] md:w-[350px] lg:w-[400px]"
      >
        <Lottie animationData={mockInterview} loop={true} />
      </motion.div>

      {/* Text + Buttons on the Right */}
      <div className="text-center md:text-left max-w-xl">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-indigo-600 bg-clip-text text-transparent leading-tight"
        >
          Master Interviews<br /> with AI-Powered Mock Sessions
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-4 text-lg md:text-xl text-gray-300"
        >
          Practice focused or personalized interviews and get instant AI feedback.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
        >
          <button
            onClick={() => setTopicForm(true)}
            className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl text-lg shadow-md transition"
          >
            Topic-Driven Mock
          </button>
          <button
            onClick={() => setProfileForm(true)}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-lg shadow-md transition"
          >
            Profile-Based Mock
          </button>
        </motion.div>
      </div>
    </div>
  );
}
