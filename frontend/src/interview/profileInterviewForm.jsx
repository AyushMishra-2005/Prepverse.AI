import React, { useState } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import interviewAnimation from "../assets/animations/profileInterviewAnimation.json";
import toast from 'react-hot-toast'
import axios from 'axios'
import useConversation from '../stateManage/useConversation.js'
import { useNavigate } from 'react-router-dom';
import ResumeProcessingPage from "../components/resumeProgressPage.jsx";

export default function ProfileInterviewForm() {
  const [topics, setTopics] = useState([""]);
  const [resumeFile, setResumeFile] = useState(null);
  const [role, setRole] = useState("");
  const [numberOfQns, setNumberOfQns] = useState(2);
  const [loading, setLoading] = useState(false);
  const [openStepProgress, setOpenStepProgress] = useState(false);
  const navigate = useNavigate();

  const { setAccessInterviewPage, setInterviewData, interviewModelId, setInterviewModelId } = useConversation();

  const handleTopicChange = (index, value) => {
    const updated = [...topics];
    updated[index] = value;
    setTopics(updated);
  };

  const addTopicField = () => setTopics([...topics, ""]);

  const removeTopicField = (index) => {
    const updated = topics.filter((_, i) => i !== index);
    setTopics(updated);
  };

  const handleFileUpload = (e) => setResumeFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resumeFile || !role.trim() || !numberOfQns || !topics[0].trim()) {
      return toast.error("Fill the form properly.");
    }

    setLoading(true); 
    const formData = new FormData();
    formData.append('file', resumeFile);
    formData.append('role', role);
    formData.append('numberOfQns', numberOfQns);
    topics.forEach(t => formData.append('topics', t));

    try {
      setOpenStepProgress(true);
      const { data } = await axios.post(
        'http://localhost:8000/profileInterview/checkRoleValidity',
        formData,
        { withCredentials: true }
      );

      if (data.interviewModelId) {
        setInterviewModelId(data.interviewModelId);
      }

      setInterviewData({
        topic: topics.join(', '),
        role,
        numOfQns : numberOfQns
      });

      setAccessInterviewPage(true);
      setTopics([""]);
      setResumeFile(null);
      setRole("");
      setNumberOfQns(2);
      navigate('/interviewPage');

    } catch (err) {
      console.log(err);
      setTopics([""]);
      setResumeFile(null);
      setRole("");
      setNumberOfQns(2);
      const errorMessage =
        err.response?.data?.message || err.message || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if(openStepProgress){
    return(
      <ResumeProcessingPage/>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white px-4 py-8 flex items-center justify-center w-full">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-4xl flex flex-col md:flex-row gap-4 bg-gray-800 rounded-xl shadow-2xl overflow-hidden"
      >
        <div className="md:w-1/2 bg-gray-900 p-4 flex flex-col items-center justify-center text-center">
          <Lottie animationData={interviewAnimation} className="w-64 h-64" loop />
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-600 bg-clip-text text-transparent mt-4">
            Customize Your Mock Interview
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="md:w-1/2 p-4 h-[70vh] space-y-4 overflow-y-auto max-h-[70vh]"
        >
          <div>
            <label className="block mb-1 text-sm font-medium">Upload Resume</label>

            {!resumeFile ? (
              <div className="relative w-full border-2 border-dashed border-indigo-500 rounded-lg p-4 bg-gray-700 hover:bg-gray-600 cursor-pointer transition">
                <input
                  type="file"
                  accept=".pdf"
                  id="resume-upload"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <p className="text-center text-sm text-gray-300">
                  Click or drag a PDF file here to upload
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-gray-700 p-3 rounded-md">
                <span className="text-sm truncate text-white">
                  📄 {resumeFile.name}
                </span>
                <button
                  type="button"
                  onClick={() => setResumeFile(null)}
                  className="ml-3 px-2 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Role</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g., Frontend Developer"
              className="w-full p-2 rounded bg-gray-700 text-white outline-none text-sm"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Number of Questions</label>
            <input
              type="number"
              value={numberOfQns}
              onChange={(e) => setNumberOfQns(e.target.value)}
              placeholder="e.g., 5"
              className="w-full p-2 rounded bg-gray-700 text-white outline-none text-sm"
              min={1}
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Topics</label>
            {topics.map((topic, index) => (
              <div key={index} className="flex gap-2 mb-2 items-center">
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => handleTopicChange(index, e.target.value)}
                  placeholder={`Topic ${index + 1}`}
                  className="flex-grow p-2 rounded bg-gray-700 text-white text-sm"
                />
                {topics.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTopicField(index)}
                    className="text-red-400 hover:text-red-600 text-lg"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addTopicField}
              className="mt-1 px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm text-white"
            >
              + Add Topic
            </button>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded text-sm font-semibold transition 
              ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              {loading ? (
                <div className="flex justify-center items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                'Start Interview'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
