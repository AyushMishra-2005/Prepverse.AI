import React, { useEffect, useRef } from "react";
import Lottie from "lottie-react";
import globeAnimation from "../assets/Globe1.json"; 
import { Link } from "react-router-dom";
import { Rocket } from "lucide-react";
import {
  FaUserCheck,
  FaRobot,
  FaFileAlt,
  FaCode,
  FaChartLine,
  FaSyncAlt,
} from "react-icons/fa";
import Button from "./Button.jsx";

// ---------------- Workflow Steps ----------------
const steps = [
  { icon: <FaUserCheck size={22} />, title: "User Onboarding", desc: "Set your profile and career goals to get a tailored experience." },
  { icon: <FaRobot size={22} />, title: "AI Interview", desc: "Practice with real-time AI-driven mock interviews." },
  { icon: <FaFileAlt size={22} />, title: "Resume Generator", desc: "Get your resume instantly crafted based on your goals." },
  { icon: <FaCode size={22} />, title: "Skill Quiz", desc: "Test yourself in your chosen language with AI quizzes." },
  { icon: <FaChartLine size={22} />, title: "Personalized Feedback", desc: "Get AI-generated insights to improve your performance." },
  { icon: <FaSyncAlt size={22} />, title: "Track Growth", desc: "Monitor your improvement and prepare smarter every day." },
];

const Home2 = () => {
  const particlesRef = useRef(null);

  // Custom Fonts + Styles
  const customStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Inter:wght@400;500&display=swap');
    
    .font-poppins { font-family: 'Poppins', sans-serif; }
    .font-inter { font-family: 'Inter', sans-serif; }

    .text-h1 { color: #FFFFFF; font-size: 3rem; font-weight: 700; }
    .text-h2 { color: #FFFFFF; font-size: 1.875rem; font-weight: 600; }
    .text-h3 { color: #FFFFFF; font-size: 1.25rem; font-weight: 500; }
    
    .card-shadow { box-shadow: 0 0 20px -5px rgba(255,105,0,0.4); }
    .secondary-btn-hover:hover { background-color: #FF6900; color: #FFFFFF; }
  `;

  // Particles.js Setup
  useEffect(() => {
    if (!window.particlesJS) {
      const particlesScript = document.createElement("script");
      particlesScript.src =
        "https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js";
      particlesScript.onload = () => {
        if (particlesRef.current) {
          window.particlesJS("particles-js", {
            particles: {
              number: { value: 200, density: { enable: true, value_area: 1500 } },
              color: { value: "#ffffff" },
              shape: { type: "circle" },
              opacity: { value: 0.5, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false } },
              size: { value: 1, random: true },
              line_linked: { enable: false },
              move: { enable: true, speed: 0.5, random: true, out_mode: "out" },
            },
            interactivity: { detect_on: "canvas", events: { resize: true } },
            retina_detect: true,
          });
        }
      };
      document.body.appendChild(particlesScript);
    }
  }, []);

  // Accent Component
  const PrimaryAccentText = ({ text }) => (
    <span className="text-[#FF6900]">{text}</span>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#0D0D0D] text-white overflow-x-hidden">
      <style>{customStyles}</style>

      {/* Background Particles */}
      <div
        ref={particlesRef}
        id="particles-js"
        className="fixed top-0 left-0 w-full h-full z-0 
        bg-[#0e0805] 
        bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),
            linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] 
        bg-[length:30px_30px]"
      ></div>

      {/* Main Page Content */}
      <div className="relative z-10 font-inter flex-1">
        
        {/* ---------------- Hero Section ---------------- */}
        <section className="container mx-auto px-6 md:px-12 lg:px-20 py-28 mt-24 grid md:grid-cols-2 gap-16 items-center">
          {/* Left - Text */}
          <div className="flex flex-col justify-center space-y-6">
            <h1 className="text-h1 font-poppins leading-tight tracking-tight">
              Welcome to <br />
              <PrimaryAccentText text="Prepverse.AI" /> <br />
              Your AI-powered career universe
            </h1>
            <p className="text-base text-[#B3B3B3] font-inter max-w-md leading-relaxed">
              Step into the multiverse of preparation — mock interviews,
              resume scoring, ATS analysis, and personalized quizzes.
            </p>
            <div className="flex space-x-4 pt-4">
  <Button />
</div>

          </div>

          {/* Right - Lottie Globe */}
          <div className="flex justify-center md:justify-end items-center">
            <div className="w-[280px] h-[280px] md:w-[420px] md:h-[420px]">
              <Lottie animationData={globeAnimation} loop={true} />
            </div>
          </div>
        </section>

        {/* ---------------- Features Section ---------------- */}
        <section className="container mx-auto py-20">
          <div className="text-center mb-12">
            <h2 className="text-h2 font-poppins">
              Supercharge Your <PrimaryAccentText text="Career Journey" />
            </h2>
            <p className="text-sm text-[#B3B3B3] font-inter max-w-xl mx-auto mt-2 leading-relaxed">
              Everything you need to ace interviews and build your career
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Mock Interviews", desc: "Prepare for the real deal with instant AI feedback.", link: "/mockInterviewLandingPage", btn: "Practice Now" },
              { title: "AI Skill Quiz", desc: "Discover strengths with AI-powered quizzes & insights.", link: "/quiz", btn: "Take a Quiz" },
              { title: "Resume Builder", desc: "Craft a professional resume that gets noticed.", link: "/resume", btn: "Build My Resume" },
            ].map((card, i) => (
              <div
                key={i}
                className="bg-[#141414] p-8 rounded-lg border border-[#2A2A2A] flex flex-col space-y-4 transition-all hover:-translate-y-1 hover:border-[#FF6900]"
              >
                <span className="text-[#FF6900] text-3xl">◆</span>
                <h3 className="text-h3 font-poppins">{card.title}</h3>
                <p className="text-base text-[#B3B3B3] font-inter leading-relaxed">{card.desc}</p>
                <Link to={card.link}>
                  <button className="mt-4 bg-[#FF6900] text-white font-poppins font-bold py-3 px-6 rounded-full transition-transform hover:scale-105">
                    {card.btn}
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ---------------- Workflow Section ---------------- */}
        <section className="py-20 relative">
          <div className="container mx-auto px-6 max-w-7xl text-center">
            <h2 className="text-h2 font-poppins mb-4">
              How <PrimaryAccentText text="Prepverse.AI" /> Works
            </h2>
            <p className="text-[#B3B3B3] font-inter max-w-2xl mx-auto mb-16 leading-relaxed">
              The smartest AI-powered career prep journey, designed to help you succeed.
            </p>

            <div className="relative">
              <div className="hidden md:block absolute top-8 left-0 w-full h-[2px] bg-gradient-to-r from-[#FF6900] via-orange-400 to-[#FF6900] opacity-50 blur-[2px]" />
              <div className="grid grid-cols-1 md:grid-cols-6 gap-10 relative z-10">
                {steps.map((step, index) => (
                  <div key={index} className="flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-2">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#141414] border border-[#2A2A2A] text-[#FF6900] mb-4 shadow-md shadow-[#ff690050]">
                      {step.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2 font-poppins">{step.title}</h3>
                    <p className="text-sm text-[#B3B3B3] font-inter leading-relaxed max-w-[180px]">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- AI Hire ---------------- */}
        <section className="container mx-auto py-20">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <span className="text-sm text-[#8A8A8A]">AI Hire</span>
              <h2 className="text-h2 font-poppins mt-2 mb-6">
                Smarter <PrimaryAccentText text="recruitment" />
              </h2>
              <p className="text-base text-[#B3B3B3] font-inter mb-8 leading-relaxed">
                Empower your hiring process with AI-driven interview design, seamless candidate invites, and performance evaluation.
              </p>
              <div className="space-y-6">
                {[
                  { title: "Custom Interview Design", desc: "Easily create structured interview processes tailored to your company’s needs." },
                  { title: "Candidate Insights", desc: "Analyze candidate performance with AI-powered evaluation and actionable feedback." },
                ].map((item, i) => (
                  <div key={i} className="flex items-start space-x-4">
                    <span className="text-[#FF6900] text-xl font-poppins font-bold">◆</span>
                    <div>
                      <h4 className="text-xl font-poppins font-medium text-[#E2E2E2]">{item.title}</h4>
                      <p className="text-base text-[#B3B3B3] font-inter leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#141414] rounded-lg p-6 flex items-center justify-center border border-[#2A2A2A] card-shadow">
              <div className="text-center">
                <span className="text-[#FF6900] text-6xl font-poppins font-bold">90%</span>
                <p className="text-base text-[#B3B3B3] font-inter">Faster hiring efficiency</p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- Call to Action ---------------- */}
        <section className="py-20 text-center w-full">
          <div className="relative p-12 rounded-3xl bg-[#141414] border border-[#2A2A2A] max-w-5xl mx-auto shadow-lg shadow-black/30">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-white font-poppins">
              Ready to enter the <PrimaryAccentText text="Prepverse?" />
            </h2>
            <p className="text-lg text-[#B3B3B3] mb-10 font-inter max-w-2xl mx-auto">
              Start your AI-powered preparation today — mock interviews, resume help, and more!
            </p>
            <Link to="/mockInterviewLandingPage">
              <button className="px-10 py-4 rounded-full font-bold bg-[#FF6900] text-white font-poppins transition-transform hover:scale-105 hover:shadow-[0_0_25px_#FF6900aa]">
                Launch AI Interview
                <Rocket size={20} className="inline-block ml-2" />
              </button>
            </Link>
          </div>
        </section>
      </div>  
    </div>
  );
};

export default Home2;
