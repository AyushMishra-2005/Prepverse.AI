import React, { useState } from "react";
import { X } from "lucide-react";
import axios from 'axios'
import server from '../environment.js'
import {toast} from 'react-hot-toast'

function CreateInterviewForm() {
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
    if(!role || !numOfQns || topics.length === 0 || !topics){
      return;
    }

    try{
      const {data} = await axios.post(
        `${server}/interview/create-companyInterview`,
        {role, numOfQns, topics},
        {withCredentials : true}
      );

      setRole("");
      setNumOfQns(2);
      setTopics([""]);

      return toast.success("Interview Created");

    }catch(err){
      console.log(err);
      const errorMessage = err?.response?.data?.message || "Something went wrong!";
      toast.error(errorMessage);
    }

  };

  return (
    <div className="dark-mystic-bg flex items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="relative bg-white/5 backdrop-blur-md border border-white/10 text-white max-w-2xl max-h-[60vh] overflow-y-auto p-6 rounded-2xl shadow-lg z-10"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-300 drop-shadow">
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
            className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 placeholder-gray-300 text-white focus:outline-none focus:ring focus:ring-blue-400"
            required
          />
        </div>

        {/* Number of Questions */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">
            Number of Questions
          </label>
          <input
            type="number"
            min={2}
            max={25}
            value={numOfQns}
            onChange={(e) => setNumOfQns(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 placeholder-gray-300 text-white focus:outline-none focus:ring focus:ring-blue-400"
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
                className="w-full px-4 py-2 pr-10 rounded-lg bg-white/10 border border-white/20 placeholder-gray-300 text-white focus:outline-none focus:ring focus:ring-blue-400"
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
            className="text-sm mt-2 px-4 py-1.5 rounded-md border border-blue-400 text-blue-300 hover:bg-blue-400/20 transition"
          >
            + Add New Topic
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg shadow-lg transition duration-200"
        >
          Submit Interview Request
        </button>
      </form>
    </div>
  );
}

export default CreateInterviewForm;
