
import React from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { useNavigate } from "react-router-dom";

const QuizResult = ({ score, total, name, subject, level }) => {
  const percentage = Math.round((score / total) * 100);
  const { width, height } = useWindowSize();
  const navigate = useNavigate();

  // Define score level description
  let performance = "";
  if (percentage >= 90) performance = "Excellent";
  else if (percentage >= 75) performance = "Great";
  else if (percentage >= 50) performance = "Good";
  else performance = "Needs Improvement";

  return (
    <div className="relative w-full max-w-2xl mx-auto p-4 rounded-3xl bg-gray-900/80 backdrop-blur-md border border-gray-700 shadow-2xl">
      {/* Confetti */}
      <Confetti
        width={width}
        height={height}
        numberOfPieces={percentage >= 70 ? 300 : 0}
        recycle={false}
      />

      {/* Title with performance */}
      <h2 className="text-4xl sm:text-5xl font-bold text-white text-center">
        <span className="font-poppins">{performance}</span>{" "}
        <span className="text-[#ff6900] font-bold">{name}</span>!
      </h2>

      {/* Subject & Level */}
      <div className="flex flex-col sm:flex-row justify-center gap-6 mt-6 text-gray-300 text-lg sm:text-xl">
        <div className="flex flex-col items-center bg-gray-800/40 backdrop-blur-md px-6 py-3 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
          <span className="text-gray-400">Subject</span>
          <span className="text-white font-semibold mt-1">{subject}</span>
        </div>
        <div className="flex flex-col items-center bg-gray-800/40 backdrop-blur-md px-6 py-3 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
          <span className="text-gray-400">Level</span>
          <span className="text-white font-semibold mt-1">{level}</span>
        </div>
      </div>

      {/* Score */}
      <div className="text-center mt-8 relative">
        <p className="text-gray-400 text-lg sm:text-xl mb-2">Your Score</p>

        <div className="text-5xl sm:text-6xl font-bold text-[#ff6900] drop-shadow-lg">
          {score} / {total}
        </div>
        <p className="text-gray-400 mt-2 text-lg sm:text-xl">
          Accuracy: <span className="text-white font-semibold">{percentage}%</span>
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-5 rounded-full overflow-hidden mt-6 bg-gray-800/50 shadow-inner">
        <div
          className="h-full transition-all duration-1000 ease-out rounded-full"
          style={{
            width: `${percentage}%`,
            background: "linear-gradient(90deg, #ff6900, #ff9c3c)",
          }}
        ></div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-6 mt-8">
        <button
          onClick={() => navigate("/quiz")}
          className="w-full sm:w-auto px-10 py-3 bg-gradient-to-r from-[#ff6900] to-[#ff9c3c] text-white font-semibold rounded-2xl shadow-lg hover:scale-105 transform transition-all duration-200"
        >
          Take Another Quiz
        </button>
        <button
          onClick={() => navigate("/")}
          className="w-full sm:w-auto px-10 py-3 bg-gray-800/60 text-gray-300 border border-gray-600 hover:border-[#ff6900] hover:text-[#ff6900] font-semibold rounded-2xl transition-all duration-200"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default QuizResult;




