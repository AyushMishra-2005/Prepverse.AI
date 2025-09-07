import React, { useState, useContext } from "react";
import { X } from "lucide-react";
import axios from 'axios';
import server from '../environment.js';
import { toast } from 'react-hot-toast';
import { ThemeContext } from '../context/ThemeContext';

function CreateInterviewForm() {
  const { theme } = useContext(ThemeContext);

  const [role, setRole] = useState("");
  const [numOfQns, setNumOfQns] = useState(2);
  const [topics, setTopics] = useState([""]);

  const handleAddTopic = () => {
    setTopics([...topics, ""]);
  };

  const handleRemoveTopic = (index) => {
    const updatedTopics = [...topics];
    updatedTopics.splice(index, 1);
    setTopics(updatedTopics);
  };

  const handleTopicChange = (index, value) => {
    const updatedTopics = [...topics];
    updatedTopics[index] = value;
    setTopics(updatedTopics);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!role || !numOfQns || topics.length === 0 || !topics) return;

    try {
      await axios.post(
        `${server}/interview/create-companyInterview`,
        { role, numOfQns, topics },
        { withCredentials: true }
      );

      setRole("");
      setNumOfQns(2);
      setTopics([""]);
      toast.success("Interview Created");
    } catch (err) {
      console.log(err);
      const errorMessage = err?.response?.data?.message || "Something went wrong!";
      toast.error(errorMessage);
    }
  };

  return (
    <div
      className={`flex items-center justify-center px-4 py-10 ${
        theme === "dark" ? "bg-black" : "bg-gray-50"
      } h-[100vh] w-screen`}
    >
      <form
        onSubmit={handleSubmit}
        className={`relative max-w-[30vw] max-h-[90vh] overflow-y-auto p-6 rounded-2xl shadow-lg w-full ${
          theme === "dark"
            ? "bg-gray-900 border border-gray-700 text-white"
            : "bg-white border border-gray-300 text-gray-900"
        }`}
      >
        <h2
          className={`text-2xl font-bold text-center mb-6 drop-shadow ${
            theme === "dark" ? "text-[#ff6900]" : "text-[#ff6900]"
          }`}
        >
          Create Your Custom AI Interview
        </h2>

        {/* Role Input */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Role</label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g., Frontend Developer"
            className={`w-full px-4 py-2 rounded-lg border placeholder-gray-400 focus:outline-none focus:ring-2 ${
              theme === "dark"
                ? "bg-gray-800 border-gray-600 text-white focus:ring-[#ff6900]"
                : "bg-gray-100 border-gray-300 text-black focus:ring-[#ff6900]"
            }`}
            required
          />
        </div>
        

        {/* Number of Questions */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Number of Questions</label>
          <input
            type="number"
            min={2}
            max={25}
            value={numOfQns}
            onChange={(e) => setNumOfQns(e.target.value)}
            className={`w-full px-4 py-2 rounded-lg border placeholder-gray-400 focus:outline-none focus:ring-2 ${
              theme === "dark"
                ? "bg-gray-800 border-gray-600 text-white focus:ring-[#ff6900]"
                : "bg-gray-100 border-gray-300 text-black focus:ring-[#ff6900]"
            }`}
            required
          />
        </div>

        {/* Topics */}
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium">Topics</label>
          {topics.map((topic, index) => (
            <div key={index} className="relative mb-3">
              <input
                type="text"
                value={topic}
                onChange={(e) => handleTopicChange(index, e.target.value)}
                placeholder={`Topic ${index + 1}`}
                className={`w-full px-4 py-2 pr-10 rounded-lg border placeholder-gray-400 focus:outline-none focus:ring-2 ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-600 text-white focus:ring-[#ff6900]"
                    : "bg-gray-100 border-gray-300 text-black focus:ring-[#ff6900]"
                }`}
                required
              />
              {index !== 0 && (
                <button
                  type="button"
                  onClick={() => handleRemoveTopic(index)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-red-400 hover:text-red-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddTopic}
            className={`text-sm mt-2 px-4 py-1.5 rounded-md border transition ${
              theme === "dark"
                ? "border-[#ff6900] text-[#ff6900] hover:bg-[#ff6900]/20"
                : "border-[#ff6900] text-[#ff6900] hover:bg-[#ff6900]/20"
            }`}
          >
            + Add New Topic
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className={`w-full py-2.5 rounded-lg font-semibold shadow-lg transition duration-200 ${
            theme === "dark"
              ? "bg-[#ff6900] text-black hover:bg-[#ff7f33]"
              : "bg-[#ff6900] text-black hover:bg-[#ff7f33]"
          }`}
        >
          Submit Interview Request
        </button>
      </form>
    </div>
  );
}

export default CreateInterviewForm;
