import React, { useState } from "react";
import QuizForm from "./QuizForm";
import QuizInterface from "./QuizInterface";
import QuizeImage from "../assets/Q2.jpeg"; // replace with your image path

const QuizPage = () => {
  const [quizConfig, setQuizConfig] = useState(null);

  return (
    <div className="w-screen h-screen flex flex-col md:flex-row bg-[#0D0D0D] text-white">
      {/* Left Section - Full Image */}
      <div className="w-full md:w-1/2 h-64 md:h-full">
        <img
          src={QuizeImage}
          alt="Quiz Illustration"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side Text + Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-6 md:px-12">
        <h2 className="text-4xl font-bold text-[#ff6900] mb-4">
          Customize Your Quiz
        </h2>
        <p className="text-gray-200 text-lg mb-8 leading-relaxed">
          Choose your subject, difficulty, and number of questions to generate
          a quiz tailored just for you.
        </p>

        {/* Form Container */}
        <div className="bg-[#1a1a1a] p-8 rounded-2xl shadow-lg space-y-6">
          <input
            type="text"
            placeholder="Target Job Role"
            className="w-full px-4 py-3 rounded-lg bg-[#2a2a2a] text-white placeholder-gray-400 focus:ring-2 focus:ring-[#ff6900] outline-none"
          />
          <input
            type="text"
            placeholder="Topic For Quiz"
            className="w-full px-4 py-3 rounded-lg bg-[#2a2a2a] text-white placeholder-gray-400 focus:ring-2 focus:ring-[#ff6900] outline-none"
          />
          <select
            className="w-full px-4 py-3 rounded-lg bg-[#2a2a2a] text-white focus:ring-2 focus:ring-[#ff6900] outline-none"
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
          <input
            type="number"
            placeholder="Number of Questions"
            className="w-full px-4 py-3 rounded-lg bg-[#2a2a2a] text-white placeholder-gray-400 focus:ring-2 focus:ring-[#ff6900] outline-none"
          />
          <button className="w-full bg-[#ff6900] hover:bg-[#e65c00] text-white font-semibold py-3 rounded-lg transition flex items-center justify-center">
            🚀 Start Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
