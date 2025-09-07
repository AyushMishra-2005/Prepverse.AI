import React, { useState, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import QuizForm from "./QuizForm";
import QuizInterface from "./QuizInterface";
import { ThemeContext } from "../context/ThemeContext"; // Adjust path as needed

const QuizPage = () => {
  const [quizConfig, setQuizConfig] = useState(null);
  const { theme } = useContext(ThemeContext);

  const bgClass = theme === "dark" ? "bg-black" : "bg-gray-100";
  const textPrimary = theme === "dark" ? "text-white" : "text-gray-900";
  const textSecondary = theme === "dark" ? "text-white/90" : "text-gray-800/90";

  return (
    <div
      className={`w-screen h-screen flex flex-col md:flex-row items-center justify-center ${bgClass} transition-colors duration-500`}
    >
      {/* Left Section - Text */}
      <div className="flex flex-col items-center justify-center py-10 px-4">
        <div className="text-center md:text-left max-w-lg space-y-6">
          <h1
            className={`text-5xl md:text-7xl font-extrabold leading-tight tracking-tight font-poppins ${textPrimary}`}
          >
            <span className="block">Customize</span>
            <span className="block">
              Your <span className="text-[#ff6900] drop-shadow-lg">Quiz</span>
            </span>
          </h1>

          <p className={`text-lg font-inter ${textSecondary}`}>
            Select your subject, difficulty level, job role, and number of
            questions to get a quiz tailored just for you.
          </p>
        </div>
      </div>

      {/* Right Section - Form / Quiz */}
      <div className="flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {!quizConfig ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                <QuizForm onSubmit={setQuizConfig} theme={theme} />
              </motion.div>
            ) : (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <QuizInterface config={quizConfig} theme={theme} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
