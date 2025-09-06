import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext.jsx';
import axios from 'axios';
import toast from 'react-hot-toast';
import useConversation from '../stateManage/useConversation.js';

const QuizForm = () => {
  const [formData, setFormData] = useState({
    jobRole: '',
    subject: '',
    level: 'easy',
    count: 5,
  });

  const { setConfig } = useQuiz(); 
  const navigate = useNavigate();  
  const [loading, setLoading] = useState(false);
  const { setQuizData } = useConversation();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!formData || !formData.jobRole || !formData.subject || !formData.level || !formData.count){
      return;
    }

    setConfig(formData);    
    
    try {
      setLoading(true);
      const role = formData.jobRole;
      const topic = formData.subject;
      const level = formData.level;
      const numOfQns = formData.count;

      const { data } = await axios.post(
        "http://localhost:8000/quiz/generate-quiz-questions",
        { role, topic, numOfQns, level },
        { withCredentials: true }
      );

      if (!data.response.valid) {
        setLoading(false);
        return toast.error("Please enter valid Role and Topic!");
      }

      const { questions } = data;
      setQuizData(questions);

      setLoading(false);
      navigate('/quiz/start');  

    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full space-y-6 transition-all duration-300 ease-in-out text-white"
    >
      {/* Job Role */}
      <input
        type="text"
        name="jobRole"
        placeholder="Target Job Role"
        className="w-full px-4 py-3 rounded-lg bg-gray-800/70 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#ff6900] focus:border-[#ff6900] transition-all"
        onChange={handleChange}
        required
      />

      {/* Topic */}
      <input
        type="text"
        name="subject"
        placeholder="Topic For Quiz"
        className="w-full px-4 py-3 rounded-lg bg-gray-800/70 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#ff6900] focus:border-[#ff6900] transition-all"
        onChange={handleChange}
        required
      />

      {/* Difficulty */}
      <div className="relative">
        <button
          type="button"
          onClick={() =>
            setFormData((prev) => ({ ...prev, openDifficulty: !prev.openDifficulty }))
          }
          className="w-full px-4 py-3 rounded-lg bg-gray-800/70 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#ff6900] focus:border-[#ff6900] flex justify-between items-center"
        >
          {formData.level || "Select Difficulty"}
          <span className="ml-2">▼</span>
        </button>
        {formData.openDifficulty && (
          <ul className="absolute z-10 w-full mt-1 bg-gray-800/90 border border-gray-700 rounded-lg shadow-lg">
            {["easy", "medium", "hard"].map((opt) => (
              <li
                key={opt}
                onClick={() => {
                  handleChange({ target: { name: "level", value: opt } });
                  setFormData((prev) => ({ ...prev, openDifficulty: false }));
                }}
                className="px-4 py-3 cursor-pointer text-white hover:bg-[#ff6900] hover:text-black transition-colors"
              >
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Question Count */}
      <input
        type="number"
        name="count"
        min="1"
        max="20"
        placeholder="Number of Questions"
        className="w-full px-4 py-3 rounded-lg bg-gray-800/70 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#ff6900] focus:border-[#ff6900] transition-all"
        onChange={handleChange}
        required
      />

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-[#ff6900] hover:bg-[#e85d00] text-white font-bold rounded-lg transition-all duration-200 ease-in-out shadow-lg hover:shadow-[#ff6900]/50 flex items-center justify-center"
      >
        {loading ? (
          <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          "Start Quiz"
        )}
      </button>
    </form>
  );
};

export default QuizForm;
