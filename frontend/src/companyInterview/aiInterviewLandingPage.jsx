import React from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import aiAnimation from "../assets/animations/aiInterview.json"; 
import {useNavigate} from 'react-router-dom'

export function AiInterviewLandingPage() {

  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white flex flex-col items-center justify-center px-4">

      <div className="w-full flex justify-center items-center gap-4 md:gap-10 mb-6">
        <motion.span
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-6xl md:text-8xl font-bold text-purple-500"
        >
          A
        </motion.span>

        <div className="max-w-[200px] md:max-w-[350px]">
          <Lottie animationData={aiAnimation} loop={true} />
        </div>

        <motion.span
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-6xl md:text-8xl font-bold text-indigo-500"
        >
          I
        </motion.span>
      </div>

      <motion.h1
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.4,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="bg-gradient-to-br from-purple-400 to-indigo-600 py-4 bg-clip-text text-center text-4xl font-semibold tracking-tight text-transparent md:text-6xl"
      >
        Attend AI-Powered Interviews <br /> Created by Top Companies
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="text-center text-lg text-gray-300 mt-4 md:text-xl max-w-2xl"
      >
        Get evaluated by AI, or create interviews tailored to your hiring process.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mt-10 flex justify-center gap-6"
      >
        <button className="px-6 py-3 bg-indigo-600 text-white rounded-2xl shadow-md hover:bg-indigo-700 transition duration-300 cursor-pointer"
          onClick={() => {
            navigate('/aiInterviews/createInterview')
          }}
        >
          Create Interview
        </button>
        <button className="px-6 py-3 bg-purple-500 text-white rounded-2xl shadow-md hover:bg-purple-600 transition duration-300 cursor-pointer"
          onClick={() => {
            navigate('/aiInterviews/attendInterview')
          }}
        >
          Attend Interview
        </button>
      </motion.div>
    </div>
  );
}
