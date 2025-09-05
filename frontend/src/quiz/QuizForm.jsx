import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../context/QuizContext.jsx";
import axios from "axios";
import toast from "react-hot-toast";
import useConversation from "../stateManage/useConversation.js";

const QuizForm = () => {
  const [formData, setFormData] = useState({
    jobRole: "",
    subject: "",
    level: "easy",
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

    if (
      !formData ||
      !formData.jobRole ||
      !formData.subject ||
      !formData.level ||
      !formData.count
    ) {
      return;
    }

    setConfig(formData);

    try {
      setLoading(true);
      const { jobRole: role, subject: topic, level, count: numOfQns } = formData;

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
    } catch (err) {
      console.log(err);
      setLoading(false);
    }

    navigate("/quiz/start");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full bg-[#121212] p-8 rounded-2xl shadow-lg space-y-6 border border-[#1F1F1F]"
    >
      {/* Job Role */}
      <input
        type="text"
        name="jobRole"
        placeholder="🎯 Target Job Role"
        className="w-full px-4 py-3 rounded-lg bg-[#1A1A1A] text-white placeholder-gray-500
                   focus:outline-none focus:ring-2 focus:ring-[#ff6900]"
        onChange={handleChange}
        required
      />

      {/* Topic */}
      <input
        type="text"
        name="subject"
        placeholder="📝 Topic For Quiz"
        className="w-full px-4 py-3 rounded-lg bg-[#1A1A1A] text-white placeholder-gray-500
                   focus:outline-none focus:ring-2 focus:ring-[#ff6900]"
        onChange={handleChange}
        required
      />

      {/* Difficulty */}
      <select
        name="level"
        className="w-full px-4 py-3 rounded-lg bg-[#1A1A1A] text-white
                   focus:outline-none focus:ring-2 focus:ring-[#ff6900]"
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
        placeholder="🔢 Number of Questions"
        className="w-full px-4 py-3 rounded-lg bg-[#1A1A1A] text-white placeholder-gray-500
                   focus:outline-none focus:ring-2 focus:ring-[#ff6900]"
        onChange={handleChange}
        required
      />

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-[#ff6900] hover:bg-[#e85e00] text-white font-bold rounded-lg 
                   transition-all duration-200 ease-in-out shadow-md hover:shadow-lg disabled:opacity-50"
      >
        {loading ? "Loading..." : "🚀 Start Quiz"}
      </button>
    </form>
  );
};

export default QuizForm;
