
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QuizResult from './QuizResult.jsx';
import useConversation from '../stateManage/useConversation.js';

const QuizInterface = ({ config }) => {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [correct, setCorrect] = useState(0);

  const { quizData } = useConversation();
  const sampleQuestions = quizData;
  const questions = sampleQuestions.slice(0, config.count);

  const handleOptionClick = (option) => {
    setSelected(option);
  };

  const next = () => {
    const currentQ = questions[current];
    const isCorrect = selected === currentQ.answer;

    setAnswers((prev) => [...prev, selected]);
    if (isCorrect) setCorrect((prev) => prev + 1);

    setSelected(null);

    if (current === questions.length - 1) {
      setShowResult(true);
    } else {
      setCurrent(current + 1);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-[#0f0f0f] flex items-center justify-center p-6">
      <AnimatePresence mode="wait">
        {showResult ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-xl"
          >
            <QuizResult
              score={correct}
              total={questions.length}
              name={config.name}
              subject={config.subject}
              level={config.level}
              restartQuiz={() => {
                setShowResult(false);
                setCurrent(0);
                setCorrect(0);
                setAnswers([]);
                setSelected(null);
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            key={`question-${current}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="bg-[#1a1a1a] text-white p-8 rounded-2xl shadow-lg w-full max-w-3xl space-y-8 border border-gray-800"
          >
            {/* Progress */}
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-300">
                Question {current + 1} of {questions.length}
              </h2>
              <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#ff6900] transition-all duration-500"
                  style={{ width: `${((current + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question */}
            <p className="text-2xl font-bold text-[#FFFFFF]">
              {questions[current].question}
            </p>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {questions[current].options.map((opt, idx) => {
                const label = String.fromCharCode(65 + idx); // A, B, C, D
                const isSelected = selected === opt;
                return (
                  <motion.button
                    key={idx}
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleOptionClick(opt)}
                    className={`flex items-center gap-3 px-5 py-4 rounded-xl transition-all text-left font-medium border
                      ${
                        isSelected
                          ? 'bg-[#ff6900] text-white border-[#ff6900] shadow-lg'
                          : 'bg-[#2a2a2a] text-gray-200 border-gray-700 hover:border-[#ff6900]/50 hover:bg-[#262626]'
                      }`}
                  >
                    <span
                      className={`uppercase font-bold w-9 h-9 rounded-full flex items-center justify-center ${
                        isSelected ? 'bg-white text-[#ff6900]' : 'bg-gray-700 text-gray-200'
                      }`}
                    >
                      {label}
                    </span>
                    {opt}
                  </motion.button>
                );
              })}
            </div>

            {/* Next Button */}
            <div className="flex justify-end pt-6">
              <button
                onClick={next}
                disabled={selected === null}
                className={`px-8 py-3 rounded-lg font-semibold transition-all text-lg
                  ${
                    selected
                      ? 'bg-[#ff6900] text-white hover:bg-[#e85f00] shadow-md'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
              >
                {current === questions.length - 1 ? 'Submit Quiz' : 'Next Question'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizInterface;

