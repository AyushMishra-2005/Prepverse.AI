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
  const {setQuizData} = useConversation();
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    

    if(!formData || !formData.jobRole || !formData.subject || !formData.level || !formData.count){
      return;
    }

    console.log("I am working");

    setConfig(formData);    
    
    try {
      setLoading(true);
      const role = formData.jobRole;
      const topic = formData.subject;
      const level = formData.level;
      const numOfQns = formData.count;

      const { data } = await axios.post(
        "http://localhost:8000/quiz/generate-quiz-questions",
        {
          role, topic, numOfQns, level
        },
        { withCredentials: true }
      );

      console.log(data.response);
      if (!data.response.valid) {
        setLoading(false);
        return toast.error("Please enter valid Role and Topic!");
      }

      const {questions} = data;

      setQuizData(questions);


      setLoading(false);

    } catch (err) {
      console.log(err);
      setLoading(false);
    }
    
    navigate('/quiz/start');  
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full bg-white p-8 rounded-2xl shadow-2xl space-y-6 transition-all duration-300 ease-in-out"
    >
      {/* <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-2">
        🎯 Customize Your Quiz
      </h2> */}

      {/* Job Role */}
      <input
        type="text"
        name="jobRole"
        placeholder=" 🎯Target Job Role"
        className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={handleChange}
        required
      />

      {/* topic */}
      <input
        type="text"
        name="subject"
        placeholder=" 📝Topic For Quiz"
        className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={handleChange}
        required
      />

      {/* Difficulty */}
      <select
        name="level"
        className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={handleChange}
      >
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>

      {/* Question Count */}
      <input
        type="number"
        name="count"
        min="1"
        max="20"
        placeholder="Number of Questions"
        className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={handleChange}
        required
      />

      {/* Submit */}
      <button
        type="submit"
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all duration-200 ease-in-out shadow-md hover:shadow-lg"
      >
        🚀 Start Quiz
      </button>
    </form>
  );
};

export default QuizForm;
