import React, { useState } from 'react';
import './resume.css';
import Lottie from 'lottie-react';
import resumeAnim from '../assets/animations/resume.json';
import { useNavigate } from 'react-router-dom';
import ResumeModal from './resumeModal';

function ResumeLandingPage() {
  const navigate = useNavigate();

  return (
    <>
      <div className="gradient-bg h-screen w-screen flex flex-col lg:flex-row">

        <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 lg:pl-20 py-12 lg:py-0 relative z-10 gap-5 items-start">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 lg:mb-10 leading-tight">
            <span className="text-black dark:text-white">
              Craft Your{" "} <br />
            </span>
            <span className="text-transparent bg-clip-text bg-[radial-gradient(circle,_#7182ff_0%,_#3cff52_100%)] bg-[length:200%_200%] animate-text-shine">
              Career Masterpiece
            </span>
          </h1>

          <div className="lottie-container w-full max-w-full lg:max-w-[500px] h-48 sm:h-64 flex items-center justify-center">
            <Lottie
              animationData={resumeAnim}
              loop
              className="w-[200px] sm:w-[280px] md:w-[300px] h-auto"
            />
          </div>

          <div>
            <p className="text-lg sm:text-xl mt-6 text-white/80 font-medium max-w-full lg:max-w-[500px] text-center lg:text-left">
              Your story deserves a beautiful canvas. Let's paint it together.
            </p>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center relative z-10 pb-12 lg:pb-0">
          <button
            onClick={() => navigate('/resume/selectResume')}
            className="jumping-button px-8 py-4 sm:px-10 sm:py-5 rounded-full text-lg sm:text-xl font-bold shadow-2xl group relative overflow-hidden"
          >
            <span className="relative z-10">Create Now</span>
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#4facfe] to-[#00f2fe] opacity-80 group-hover:opacity-100 transition-all duration-300"></span>
          </button>
        </div>
      </div>
    </>
  );
}

export default ResumeLandingPage;
