import React, { useState } from 'react';
import { Plus, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom'
import CreateInterviewForm from './createInterviewForm';
import { useGetAllInterviews } from '../context/getAllInterviews';
import axios from 'axios';
import server from '../environment.js'
import useConversation from '../stateManage/useConversation.js';

function CreateInterviewPage() {
  const navigate = useNavigate();

  const [createInterview, setCreateInterview] = useState(false);
  const {interviews} = useGetAllInterviews();
  const {setReportData} = useConversation();

  if (createInterview === true) {
    return (
      <div className='w-full'>
        <CreateInterviewForm />
      </div>
    )
  }

  const handleOpenClick = async (interviewId) => {
    try{
      const {data} = await axios.post(
        `${server}/interview/getAllCandidates`,
        {interviewId},
        {withCredentials : true}
      );

      if(data?.candidates){
        setReportData(data.candidates);
      }

    }catch(err){
      console.log(err);
    }
  }


  return (
    <div className="dark-mystic-bg w-full min-h-screen flex flex-col items-center py-14 px-4 text-white relative z-10">
      <h1 className="text-6xl font-extrabold mb-12 text-center bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent leading-tight md:leading-snug">
        Manage Your Interviews
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-7xl">
        <div className="rounded-2xl bg-[#0f172a] border-2 border-dashed border-gray-500 flex flex-col items-center justify-center h-64 hover:border-indigo-500 transition cursor-pointer"
          onClick={() => setCreateInterview(true)}
        >
          <div className="w-16 h-16 rounded-full bg-gray-600 hover:bg-indigo-600 flex items-center justify-center text-white transition duration-300">
            <Plus className="w-8 h-8" />
          </div>
          <p className="mt-4 text-lg font-medium text-white">Add New Interview</p>
        </div>

        {interviews.map((interview) => (
          <div key={interview._id}
            className="bg-[#0f172a] rounded-2xl p-6 flex flex-col justify-between shadow-md hover:shadow-lg transition h-64"
          >
            <div>
              <h2 className="text-xl font-semibold mb-4">{interview.interview.role}</h2>
              <div className="flex flex-wrap gap-2 mb-2">
                {interview.interview.topics.map((topic, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 text-sm rounded-full bg-gray-700 text-gray-100"
                  >
                    {topic}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-300">
                Number of Questions: <span className="font-medium text-white">{interview.interview.numOfQns}</span>
              </p>
            </div>
            <button
              className="mt-5 w-full py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 transition text-white font-semibold flex items-center justify-center gap-2 cursor-pointer"
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
