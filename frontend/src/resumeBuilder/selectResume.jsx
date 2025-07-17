import React, { useState } from 'react';
import './resume.css';
import ResumeModal from './resumeModal';
import { useNavigate } from 'react-router-dom';
import useResumeStore from '../stateManage/useResumeStore';
import axios from 'axios'
import server from '../environment.js'
import { useGetAllResumes } from '../context/getAllResume.jsx';
import { formatDistanceToNow } from 'date-fns';

import image1 from '../assets/resumeImage1.png'
import image2 from '../assets/resumeImage2.png'

const images = [image1, image2]

function SelectResume() {

  const { resumes } = useGetAllResumes();

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const { resumeData, setResumeData, setSelectedResumeId } = useResumeStore();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleAddClick = async () => {
    const resumeTitle = title;
    
    try {
      const { data } = await axios.post(
        `${server}/resume/create-resume`,
        { resumeTitle },
        { withCredentials: true }
      );

      if (!data) {
        return;
      }

      setResumeData(data.savedResumeDetails);
    } catch (err) {
      console.log(err);
    }
  }

  const handleSubmit = async () => {
    if (!title) {
      return;
    }
    setResumeData({
      ...resumeData,
      title: title,
    });
    handleClose();
    await handleAddClick();
    navigate('/resume/resumeForm');
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return formatDistanceToNow(date, { addSuffix: true });
  }

  return (
    <>
      <div className="gradient-bg min-h-screen w-[100vw] overflow-y-auto relative">
        <div className="w-full mx-auto px-14 py-8 relative z-10 pr-17">
          {/* Heading */}
          <div className="text-center mb-8 mt-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-500 mb-2">
              Create Your Own Resume
            </h1>
            <p className="text-gray-300 text-lg">Select a template or start from scratch</p>
          </div>

          {/* Cards Grid */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 pb-6">
            <div
              key="add"
              className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-500 bg-[#181c23] bg-opacity-70 cursor-pointer hover:border-purple-400 transition-all duration-300 transform hover:scale-[1.02] group p-6 h-full min-h-[200px]"
              onClick={() => {
                handleOpen();
              }}
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-white text-white text-2xl group-hover:bg-white group-hover:text-purple-600 transition-all">
                +
              </div>
              <p className="mt-4 text-white font-medium text-lg opacity-90 group-hover:opacity-100">
                Add New
              </p>
            </div>
            {resumes.map((resume) =>
              <div
                key={resume._id}
                className="bg-[#20252d] bg-opacity-80 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] flex flex-col h-full"
              >
                <div className="relative pt-[60%] bg-gradient-to-br from-gray-700 to-gray-900">
                  <img
                    src={images[resume.resumeDetails.template.number]}
                    alt={`Resume ${resume._id}`}
                    className="absolute top-0 left-0 w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-4">
                    <button className="bg-gradient-to-r from-pink-500 to-indigo-500 text-white px-6 py-2 rounded-lg text-sm font-medium transition-opacity w-full cursor-pointer"
                      onClick={() => {
                        setResumeData(resume.resumeDetails);
                        setSelectedResumeId(resume._id);
                        console.log(resume._id)
                        navigate('/resume/resumeForm');
                      }}
                    >
                      Open Resume
                    </button>
                  </div>
                </div>
                <div className="p-4 flex-grow flex flex-col">
                  <h2 className="text-white font-semibold text-xl mb-2">{resume.resumeDetails?.title}</h2>
                  <div className="flex mt-auto justify-between items-center">
                    <span className="text-gray-400 text-sm">Last edited: {formatDate(resume.updatedAt)}</span>
                    <button className="text-purple-400 hover:text-white transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )
            }
          </div>
        </div>
      </div>

      <ResumeModal
        open={open}
        handleClose={handleClose}
        title={title}
        setTitle={setTitle}
        handleSubmit={handleSubmit}
      />
    </>
  );
}

export default SelectResume;