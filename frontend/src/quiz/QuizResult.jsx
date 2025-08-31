import React from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { useNavigate } from 'react-router-dom'; // ✅ Make sure this import exists

const QuizResult = ({ score, total, name, subject, level, restartQuiz }) => {
  const percentage = Math.round((score / total) * 100);
  const { width, height } = useWindowSize();
  const navigate = useNavigate(); // ✅ moved inside the component

  return (
    <div className="relative bg-white p-8 rounded-xl shadow-xl w-full max-w-lg mx-auto text-center space-y-6">
      {/* 🎊 Confetti */}
      <Confetti
        width={width}
        height={height}
        numberOfPieces={percentage >= 70 ? 250 : 0}
        recycle={false}
      />

      <h2 className="text-4xl font-bold text-green-600">🎉 Well Done, {name}!</h2>
      <p className="text-gray-700 text-xl">Subject: <b>{subject}</b></p>
      <p className="text-gray-700 text-xl">Level: <b>{level}</b></p>
      <div className="text-3xl font-semibold text-blue-700">
        Your Score: {score} / {total}
      </div>

      <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
        <div className="bg-green-500 h-full" style={{ width: `${percentage}%` }}></div>
      </div>

      <p className="text-gray-600 mt-2">Accuracy: <b>{percentage}%</b></p>

      <button
        onClick={() => navigate('/quiz')}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        🔙 Take Another Quiz
      </button>
    </div>
  );
};

export default QuizResult;
