import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import QuizForm from './QuizForm';
import QuizInterface from './QuizInterface';
import Lottie from 'lottie-react';
import quizAnim from '../assets/animations/quiz.json';

const QuizPage = () => {
  const [quizConfig, setQuizConfig] = useState(null);

  return (
    <div className="w-screen h-screen flex flex-col md:flex-row text-white bg-gradient-to-br from-pink-600 to-purple-700">
      {/* Left Section - Text + Lottie */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center px-6 py-10 space-y-6">
        <div className="text-center md:text-left max-w-xl space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
           Customize Your <span className="text-yellow-300">Quiz</span>
          </h1>
          <p className="text-lg text-white/90">
            Select your subject, difficulty level, job role, and number of questions to get a quiz tailored just for you.
          </p>
        </div>

        <div className="w-full flex justify-center items-center mt-6">
          <Lottie
            animationData={quizAnim}
            loop
            className="w-[280px] md:w-[300px] h-auto"
          />
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-10">
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
                <QuizForm onSubmit={setQuizConfig} />
              </motion.div>
            ) : (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <QuizInterface config={quizConfig} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
export default QuizPage;
