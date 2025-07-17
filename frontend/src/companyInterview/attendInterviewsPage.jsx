import React, { useState } from 'react';
import './interviewPage.css';
import { PlaceholdersAndVanishInput } from "../components/ui/placeholders-and-vanish-input.jsx";
import Avatar from '@mui/material/Avatar';
import toast from 'react-hot-toast'
import axios from 'axios'
import server from '../environment.js'
import useConversation from '../stateManage/useConversation.js';
import { useNavigate } from 'react-router-dom'

function AttendInterviews() {
  const placeholders = [
    "WhatsApp",
    "Google",
    "Microsoft",
    "Amazon",
    "TCS"
  ];

  const [search, setSearch] = useState("");
  const [interviews, setInterviews] = useState([]);
  const { setInterviewData, setInterviewModelId } = useConversation();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!search) {
      return toast.error("Please enter valid search!");
    }

    const username = search;

    try {
      const { data } = await axios.post(
        `${server}/interview/search-Interviews`,
        { username },
        { withCredentials: true }
      );

      if (data?.interviews) {
        if (data.interviews.length === 0) {
          toast.error("No Interview Found");
        }
        setInterviews(data.interviews);
      }

    } catch (err) {
      console.log(err);
    }

  };

  const handleAttendClick = async (topics, role, numOfQns, interviewId) => {
    try {
      const { data } = await axios.post(
        `${server}/interview/generateInterviewQuestions`,
        { topic: topics, role, numOfQns, interviewId },
        { withCredentials: true }
      );

      if (data?.interviewData) {
        console.log(data.interviewData);
        setInterviewData({
          topic: topics,
          role,
          numOfQns,
        });
        setInterviewModelId(data.interviewData._id);
        navigate('/interviewPage');
      }

    } catch (err) {
      console.log(err);
      const errorMessage = err.response?.data?.message || "Something went wrong!";
      toast.error(errorMessage);
    }



  };

  return (
    <div className='dark-mystic-bg w-full min-h-screen flex flex-col items-center relative z-10'>
      <div className='flex flex-col w-full max-w-3xl px-6 mt-[4rem]'>
        <h2 className="text-2xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-300 text-center mb-5">
          Meet Your AI Interview Coach
        </h2>

        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          onChange={handleChange}
          onSubmit={onSubmit}
        />
      </div>

      <div className="w-full max-w-6xl px-6 mt-16 pb-16">
        <h3 className="text-white text-2xl font-semibold mb-6">Available AI Interviews</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {interviews.map((interview, idx) => (
            <div
              key={idx}
              className="bg-[#131b22] rounded-2xl p-6 shadow-lg hover:shadow-[0_0_20px_rgba(100,200,255,0.15)] hover:-translate-y-1 transition-all duration-300 text-white flex flex-col justify-between border border-transparent hover:border-[#6ca9f3]/30"
            >
              <div>
                <div className="flex justify-center mb-4">
                  <div className="h-[4rem] w-[4rem] rounded-full overflow-hidden border-2 border-[#4c5d6f] shadow-sm flex justify-center items-center">
                    <Avatar alt="Remy Sharp" src={`${interview.userId.profilePicURL}` || `https://ui-avatars.com/api/?name=${interview.userId.username}&background=random&color=fff&size=128`} sx={{ width: '4rem', height: '4rem' }} />
                  </div>
                </div>
                <h4 className="text-xl font-bold text-center">{interview.userId.username}</h4>
                <p className="text-sm text-center text-zinc-300 mb-3">{interview.interview.role}</p>

                <div className="flex flex-wrap justify-center gap-2 my-2">
                  {interview.interview.topics.map((topic, i) => (
                    <span
                      key={i}
                      className="bg-[#3a4a5a] text-xs px-3 py-1 rounded-full text-zinc-200"
                    >
                      {topic}
                    </span>
                  ))}
                </div>

                <p className="text-center mt-3 text-zinc-400 text-sm">
                  Number of Qns: <span className="text-white font-medium">{interview.interview.numOfQns}</span>
                </p>
              </div>

              <div className="mt-6">
                <button
                  className="w-full bg-[#456179] hover:bg-[#6ca9f3] transition duration-300 text-white font-medium text-sm py-2 px-4 rounded-full shadow hover:shadow-lg cursor-pointer"
                  onClick={() => {
                    const interviewId = interview._id;
                    handleAttendClick(interview.interview.topics.join(', '), interview.interview.role, interview.interview.numOfQns, interviewId);
                  }}
                >
                  Attend
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AttendInterviews;
