import React, { useState, useContext, useEffect } from 'react';
import { Plus, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGetAllInterviews } from '../context/getAllInterviews.jsx';
import axios from 'axios';
import server from '../environment.js';
import useConversation from '../stateManage/useConversation.js';
import { ThemeContext } from '../context/ThemeContext';

function CreateInterviewPage() {
  const navigate = useNavigate();
  const { interviews } = useGetAllInterviews();
  const { reportData, setReportData } = useConversation();
  const { theme } = useContext(ThemeContext);

  const handleOpenClick = async (interviewId) => {
    try {
      const { data } = await axios.post(
        `${server}/interview/getAllCandidates`,
        { interviewId },
        { withCredentials: true }
      );

      if (data?.candidates) {
        setReportData(data.candidates);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className={`w-full min-h-screen flex flex-col items-center py-14 px-4 relative z-10 ${
        theme === 'dark' ? 'bg-black text-white' : 'bg-gray-50 text-orange-900'
      }`}
    >
      <h1
        className={`text-6xl font-extrabold mb-12 text-center leading-tight md:leading-snug ${
          theme === 'dark'
            ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#ff6900] to-gray-400'
            : 'text-gray-900'
        }`}
      >
        Manage Your Interviews
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-7xl">
        {interviews.map((interview) => (
          <div
            key={interview._id}
            className={`rounded-2xl p-6 flex flex-col justify-between shadow-md transition h-64 ${
              theme === 'dark'
                ? 'bg-gray-900 hover:shadow-[0_0_20px_rgba(255,105,0,0.15)]'
                : 'bg-white hover:shadow-md'
            }`}
          >
            <div>
              <h2 className="text-xl font-semibold mb-4">{interview.interview.role}</h2>
              <div className="flex flex-wrap gap-2 mb-2">
                {interview.interview.topics.map((topic, idx) => (
                  <span
                    key={idx}
                    className={`px-3 py-1 text-sm rounded-full ${
                      theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {topic}
                  </span>
                ))}
              </div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Number of Questions: <span className="font-medium">{interview.interview.numOfQns}</span>
              </p>
            </div>

            <button
              className={`mt-5 w-full py-2 rounded-xl flex items-center justify-center gap-2 font-semibold transition cursor-pointer ${
                theme === 'dark'
                  ? 'bg-[#ff6900] text-black hover:bg-[#ff6900]'
                  : 'bg-[#ff6900] text-black hover:bg-[#ff6900]'
              }`}
              onClick={() => {
                navigate('/aiInterviews/createInterview/attandants');
                console.log(interview._id);
                const interviewId = interview._id;
                handleOpenClick(interviewId);
              }}
            >
              Open <ArrowRight size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CreateInterviewPage;
