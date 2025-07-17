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

  const {quizData} = useConversation();
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
    <div className="min-h-screen w-screen bg-gradient-to-br from-purple-900 to-indigo-900 flex items-center justify-center p-4">
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
            className="bg-white text-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-2xl space-y-6"
          >
            <h2 className="text-xl font-bold text-purple-700">
              Question {current + 1} / {questions.length}
            </h2>
            <p className="text-2xl font-semibold">{questions[current].question}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {questions[current].options.map((opt, idx) => {
                const label = String.fromCharCode(97 + idx);
                const isSelected = selected === opt;

                return (
                  <motion.button
                    key={idx}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.03 }}
                    onClick={() => handleOptionClick(opt)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-full transition-all border-2 text-left font-medium
                      ${
                        isSelected
                          ? 'bg-pink-600 text-white border-yellow-400 shadow-md'
                          : 'bg-gray-100 text-gray-800 border-transparent hover:bg-purple-100'
                      }`}
                  >
                    <span className="uppercase font-bold w-8 h-8 rounded-full flex items-center justify-center bg-yellow-400 text-purple-900">
                      {label}
                    </span>
                    {opt}
                  </motion.button>
                );
              })}
            </div>

            <div className="flex justify-end pt-6">
              <button
                onClick={next}
                disabled={selected === null}
                className={`px-6 py-2 rounded-lg font-semibold transition-all 
                  ${
                    selected
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
              >
                {current === questions.length - 1 ? 'Submit' : 'Next'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizInterface;
