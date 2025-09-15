import React, { useEffect, useRef, useContext, useState } from "react";
import Lottie from "lottie-react";
import { Link } from "react-router-dom";
import { Rocket } from "lucide-react";
import {
  FaUserCheck,
  FaRobot,
  FaFileAlt,
  FaCode,
  FaChartLine,
  FaSyncAlt,
  FaComments,
  FaQuestionCircle,
  FaFilePdf,
} from "react-icons/fa";

import globeAnimation from "../assets/Globe1.json";
import Button from "./Button.jsx";
import { ThemeContext } from "../context/ThemeContext";
// Replace with your actual image imports
import interviewImage from "../assets/Slide2.webp";
import internshipimage from "../assets/Internship_image.png";
import mockInterviewImage from "../assets/mockinterview.png"; // Add appropriate image
import quizImage from "../assets/quiz.png"; // Add appropriate image
import resumeBuilderImage from "../assets/resume.png"; // Add appropriate image

const steps = [
  {
    icon: <FaUserCheck size={22} />,
    title: "User Onboarding",
    desc: "Set your profile and career goals to get a tailored experience.",
  },
  {
    icon: <FaRobot size={22} />,
    title: "AI Interview",
    desc: "Practice with real-time AI-driven mock interviews.",
  },
  {
    icon: <FaFileAlt size={22} />,
    title: "Resume Generator",
    desc: "Get your resume instantly crafted based on your goals.",
  },
  {
    icon: <FaCode size={22} />,
    title: "Skill Quiz",
    desc: "Test yourself in your chosen language with AI quizzes.",
  },
  {
    icon: <FaChartLine size={22} />,
    title: "Personalized Feedback",
    desc: "Get AI-generated insights to improve your performance.",
  },
  {
    icon: <FaSyncAlt size={22} />,
    title: "Track Growth",
    desc: "Monitor your improvement and prepare smarter every day.",
  },
];

const Home2 = () => {
  const particlesRef = useRef(null);
  const { theme } = useContext(ThemeContext);
  const [currentSlide, setCurrentSlide] = useState(0);
  const intervalRef = useRef(null);

  // Particles effect
  useEffect(() => {
    const loadParticles = () => {
      if (particlesRef.current && window.particlesJS) {
        window.particlesJS("particles-js", {
          particles: {
            number: { value: 200, density: { enable: true, value_area: 1500 } },
            color: { value: theme === "dark" ? "#ffffff" : "#000000" },
            shape: { type: "circle" },
            opacity: {
              value: 0.5,
              random: true,
              anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false },
            },
            size: { value: 1, random: true },
            line_linked: { enable: false },
            move: { enable: true, speed: 0.5, random: true, out_mode: "out" },
          },
          interactivity: { detect_on: "canvas", events: { resize: true } },
          retina_detect: true,
        });
      }
    };

    if (!window.particlesJS) {
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js";
      script.onload = loadParticles;
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    } else {
      loadParticles();
    }
  }, [theme]);

  // Auto-rotate carousel
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(intervalRef.current);
  }, []);

  // Manual slide navigation
  const goToSlide = (index) => {
    setCurrentSlide(index);
    // Reset the interval when manually navigating
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 4000);
  };

  const PrimaryAccentText = ({ text }) => (
    <span className="text-[#FF6900]">{text}</span>
  );

  // Feature sections data
  const featureSections = [
    {
      id: "mock-interview",
      title: "Mock Interview",
      description: "Empower your interview preparation with AI-driven mock interviews, real-time feedback, and performance analysis.",
      icon: <FaComments className="text-[#FF6900] text-2xl" />,
      image: mockInterviewImage,
      features: [
        {
          title: "AI-Powered Interviews",
          desc: "Experience realistic interviews with our advanced AI that adapts to your responses.",
        },
        {
          title: "Real-Time Feedback",
          desc: "Get instant feedback on your answers, communication skills, and body language.",
        },
        {
          title: "Customizable Questions",
          desc: "Choose from industry-specific questions or upload your resume for personalized questions.",
        },
      ],
      cta: {
        text: "Start Mock Interview",
        link: "/mockInterviewLandingPage"
      }
    },
    {
      id: "quiz",
      title: "AI Skill Quiz",
      description: "Test and improve your knowledge with adaptive quizzes that challenge your skills and identify areas for improvement.",
      icon: <FaQuestionCircle className="text-[#FF6900] text-2xl" />,
      image: quizImage,
      features: [
        {
          title: "Adaptive Difficulty",
          desc: "Questions adapt to your skill level, getting harder as you improve.",
        },
        {
          title: "Multiple Categories",
          desc: "Choose from technical skills, soft skills, or industry-specific knowledge.",
        },
        {
          title: "Detailed Analytics",
          desc: "Track your progress over time with detailed performance reports.",
        },
      ],
      cta: {
        text: "Take a Quiz",
        link: "/quiz"
      }
    },
    {
      id: "resume-builder",
      title: "Resume Builder",
      description: "Create professional, ATS-friendly resumes that highlight your skills and experience effectively.",
      icon: <FaFilePdf className="text-[#FF6900] text-2xl" />,
      image: resumeBuilderImage,
      features: [
        {
          title: "ATS Optimization",
          desc: "Ensure your resume passes through Applicant Tracking Systems with optimized content.",
        },
        {
          title: "Professional Templates",
          desc: "Choose from a variety of professionally designed templates for any industry.",
        },
        {
          title: "Content Suggestions",
          desc: "Get AI-powered suggestions to improve your resume's impact and readability.",
        },
      ],
      cta: {
        text: "Build My Resume",
        link: "/resume"
      }
    },
    {
      id: "attend-interview",
      title: "Attend Interview",
      description: "Empower your hiring process with AI-driven interview design, seamless candidate invites, and performance evaluation.",
      icon: <FaRobot className="text-[#FF6900] text-2xl" />,
      image: interviewImage,
      features: [
        {
          title: "Custom Interview Design",
          desc: "Easily create structured interview processes tailored to your company's needs.",
        },
        {
          title: "Candidate Insights",
          desc: "Analyze candidate performance with AI-powered evaluation and actionable feedback.",
        },
        {
          title: "Streamlined Process",
          desc: "Simplify your hiring workflow with intuitive tools and automated scheduling.",
        },
      ],
      cta: {
        text: "Learn More",
        link: "/employer-dashboard"
      }
    }
  ];

  return (
    <div
      className={`flex flex-col min-h-screen overflow-x-hidden transition-colors duration-500 ${
        theme === "dark"
          ? "bg-[#0D0D0D] text-white"
          : "bg-[#FFFFFF] text-[#1A1A1A]"
      }`}
    >
      {/* Background Particles */}
      <div
        ref={particlesRef}
        id="particles-js"
        className={`fixed top-0 left-0 w-full h-full z-0 ${
          theme === "dark" ? "bg-[#0e0805]" : "bg-[#F9F9F9]"
        }`}
        style={{
          backgroundImage:
            theme === "dark"
              ? "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)"
              : "linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      ></div>

      {/* Main Page Content */}
      <div className="relative z-10 font-inter flex-1">
        {/* Hero Section*/}
        <section className="container w-[100vw] mx-auto px-4 sm:px-6 md:px-8 lg:px-34 py-8 md:py-16 grid md:grid-cols-2 gap-0 items-center justify-center min-h-[100vh]">
          {/* Left - Text */}
          <div className="flex flex-col justify-center space-y-4 md:space-y-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-poppins leading-tight">
              <span className="whitespace-nowrap">
                Welcome to <PrimaryAccentText text="Prepverse.AI" />
              </span>{" "}
              <br />
              <span>Your AI-powered career universe</span>
            </h1>

            <p
              className={`text-sm md:text-base font-inter max-w-md leading-relaxed ${
                theme === "dark" ? "text-[#CCCCCC]" : "text-[#444444]"
              }`}
            >
              Step into the multiverse of preparation — mock interviews, resume
              scoring, ATS analysis, and personalized quizzes.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button />
            </div>
          </div>

          {/* Right - Lottie Globe */}
          <div className="flex justify-center items-center ml-0 sm:ml-10">
            <div className="w-[330px] h-[330px] sm:w-[370px] sm:h-[370px] md:w-[410px] md:h-[410px] lg:w-[450px] lg:h-[450px]">
              <Lottie animationData={globeAnimation} loop={true} />
            </div>
          </div>
        </section>

        {/* Internship Section - Fixed container width */}
        <section className="py-12 md:py-16 px-4 sm:px-6 md:px-8 relative">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              {/* Left Side: Image */}
              <div className="flex justify-center">
                <img
                  src={internshipimage}
                  alt="Internship Illustration"
                  className="rounded-2xl w-full max-w-md shadow-[0_0_5px_#FF6900,0_0_20px_#FF8C00]"
                />
              </div>

              {/* Right Side: Content */}
              <div>
                <h2 className="text-3xl md:text-4xl font-poppins font-bold mb-6">
                  Land Your Dream <PrimaryAccentText text="Internship" />
                </h2>

                <p
                  className={`text-lg font-inter max-w-2xl leading-relaxed mb-8 ${
                    theme === "dark" ? "text-[#CCCCCC]" : "text-[#444444]"
                  }`}
                >
                  Our AI-powered platform helps you discover, prepare for, and
                  secure the perfect internship.
                </p>

                {/* Steps */}
                <div className="space-y-6">
                  <div className="flex items-start">
                    <span className="text-[#FF6900] text-xl font-poppins font-bold mr-3">
                      ◆
                    </span>
                    <div>
                      <h3 className="text-xl font-semibold text-[#FF6900] mb-2">
                        Sign Up & Complete Profile
                      </h3>
                      <p
                        className={`${
                          theme === "dark" ? "text-[#CCCCCC]" : "text-[#444444]"
                        }`}
                      >
                        Create your account and upload your resume to help our
                        AI understand your skills, interests, and career goals.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <span className="text-[#FF6900] text-xl font-poppins font-bold mr-3">
                      ◆
                    </span>
                    <div>
                      <h3 className="text-xl font-semibold text-[#FF6900] mb-2">
                        Get Personalized Recommendations
                      </h3>
                      <p
                        className={`${
                          theme === "dark" ? "text-[#CCCCCC]" : "text-[#444444]"
                        }`}
                      >
                        Our AI algorithm matches you with ideal internship
                        opportunities based on your profile, skills, and
                        preferences.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <span className="text-[#FF6900] text-xl font-poppins font-bold mr-3">
                      ◆
                    </span>
                    <div>
                      <h3 className="text-xl font-semibold text-[#FF6900] mb-2">
                        Prepare & Apply
                      </h3>
                      <p
                        className={`${
                          theme === "dark" ? "text-[#CCCCCC]" : "text-[#444444]"
                        }`}
                      >
                        Use our interview preparation tools, resume builder, and
                        skill assessments to stand out and secure your
                        internship.
                      </p>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="mt-8">
                  <Link to="/signup">
                    <button className="px-6 py-3 md:px-8 md:py-3 rounded-2xl font-semibold bg-gradient-to-r from-[#FF6900] to-[#FF8C00] text-white font-poppins transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_#FF6900] text-base md:text-lg flex items-center">
                      Start Your Internship Journey
                      <Rocket size={18} className="ml-2" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Increased side margins */}
        <section className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-16 py-12 md:py-20">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-poppins font-bold">
              Supercharge Your <PrimaryAccentText text="Career Journey" />
            </h2>
            <p
              className={`text-lg md:text-xl font-inter max-w-2xl mx-auto mt-4 leading-relaxed ${
                theme === "dark" ? "text-[#E5E5E5]" : "text-[#333333]"
              }`}
            >
              Everything you need to ace interviews and build your career
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                title: "Mock Interviews",
                desc: "Prepare for the real deal with instant AI feedback, Get your customized question either based on your resume or topic.",
                link: "/mockInterviewLandingPage",
                btn: "Practice Now",
              },
              {
                title: "AI Skill Quiz",
                desc: "Discover strengths with AI-powered quizzes & insights, fully customized just choose subject, number of question and level of difficulty and you are good to go.",
                link: "/quiz",
                btn: "Take a Quiz",
              },
              {
                title: "Resume Builder",
                desc: "Craft a professional resume that gets noticed, choose template, fill your details and download it.",
                link: "/resume",
                btn: "Build My Resume",
              },
            ].map((card, i) => (
              <div
                key={i}
                className={`p-6 md:p-7 rounded-lg border flex flex-col space-y-4 transition-all hover:-translate-y-1 ${
                  theme === "dark"
                    ? "bg-orange-100 border-[#2A2A2A] hover:border-[#FF6900] hover:shadow-[0_0_25px_#FF690040]"
                    : "bg-orange-50 border-[#EAEAEA] shadow-md hover:border-[#FF6900] hover:shadow-[0_0_25px_#FF690020]"
                }`}
              >
                <h3
                  className={`text-xl md:text-2xl font-poppins font-semibold ${
                    theme === "dark" ? "text-[#111111]" : "text-[#222222]"
                  }`}
                >
                  <span className="text-[#FF6900] text-2xl md:text-3xl">
                    {" "}
                    ◆{" "}
                  </span>
                  {card.title}
                </h3>
                <p
                  className={`text-sm md:text-base font-inter leading-relaxed ${
                    theme === "dark" ? "text-[#1A1A1A]" : "text-[#444444]"
                  }`}
                >
                  {card.desc}
                </p>
                <Link to={card.link}>
                  <button className="mt-4 bg-[#FF6900] text-white font-poppins font-bold py-2 px-4 md:py-2.5 md:px-5 rounded-full transition-transform hover:scale-105 text-sm md:text-base">
                    {card.btn}
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Workflow Section - Increased side margins */}
        <section className="py-12 md:py-20 relative px-6 sm:px-8 md:px-12 lg:px-16">
          <div className="container mx-auto max-w-7xl text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-poppins font-bold mb-4">
              How <PrimaryAccentText text="Prepverse.AI" /> Works
            </h2>
            <p
              className={`text-lg md:text-xl font-inter max-w-2xl mx-auto mt-2 mb-8 leading-relaxed ${
                theme === "dark" ? "text-[#CCCCCC]" : "text-[#444444]"
              }`}
            >
              The smartest AI-powered career prep journey, designed to help you
              succeed.
            </p>

            <div className="relative">
              <div
                className="hidden md:block absolute top-8 left-0 w-full h-[2px] 
  bg-gradient-to-r from-[#FF6900] via-[#FF6900] to-[#FF6900] 
  shadow-[0_0_15px_#FF6900,0_0_30px_#FF6900]"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 relative z-10">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-2"
                  >
                    <div
                      className={`flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full mb-4 shadow-md ${
                        theme === "dark"
                          ? "bg-[#141414] border border-[#2A2A2A] text-[#FF6900] shadow-[#ff690050]"
                          : "bg-white border border-[#EAEAEA] text-[#FF6900]"
                      }`}
                    >
                      {step.icon}
                    </div>
                    <h3 className="text-base md:text-lg font-semibold font-poppins">
                      {step.title}
                    </h3>
                    <p
                      className={`text-xs md:text-sm font-inter leading-relaxed max-w-[160px] ${
                        theme === "dark" ? "text-[#CCCCCC]" : "text-[#444444]"
                      }`}
                    >
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Feature Detail Sections */}
        {featureSections.map((section, index) => (
          <section 
            key={section.id} 
            id={section.id}
            className={`py-12 md:py-20 ${index % 2 === 1 ? 'bg-gradient-to-r from-transparent via-[#FF6900]/5 to-transparent' : ''}`}
          >
            <div className="container mx-auto px-8 sm:px-12 md:px-16 lg:px-24">
              <div className={`grid md:grid-cols-2 gap-10 md:gap-16 items-center ${index % 2 === 1 ? 'md:direction-rtl' : ''}`}>
                <div className={index % 2 === 1 ? 'md:order-2' : ''}>
                  <div className="flex items-center mb-4">
                    <div className="mr-3 p-2 rounded-full bg-[#FF6900]/10">
                      {section.icon}
                    </div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-poppins font-bold text-[#FF6900]">
                      {section.title}
                    </h1>
                  </div>
                  <p
                    className={`text-sm md:text-base font-inter pt-6 mb-8 leading-relaxed ${
                      theme === "dark" ? "text-[#CCCCCC]" : "text-[#444444]"
                    }`}
                  >
                    {section.description}
                  </p>
                  <div className="space-y-6">
                    {section.features.map((item, i) => (
                      <div key={i} className="flex items-start space-x-4">
                        <span className="text-[#FF6900] text-xl font-poppins font-bold">
                          ◆
                        </span>
                        <div>
                          <h4
                            className={`text-lg md:text-xl font-poppins font-medium ${
                              theme === "dark" ? "text-white" : "text-[#1A1A1A]"
                            }`}
                          >
                            {item.title}
                          </h4>
                          <p
                            className={`text-sm md:text-base font-inter leading-relaxed ${
                              theme === "dark" ? "text-[#CCCCCC]" : "text-[#444444]"
                            }`}
                          >
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8">
                    <Link to={section.cta.link}>
                      <button className="px-6 py-3 md:px-8 md:py-3.5 rounded-2xl font-semibold bg-[#FF6900] text-white font-poppins transition-transform hover:scale-105 hover:shadow-[0_0_20px_#FF6900aa] text-sm md:text-base">
                        {section.cta.text}
                        <Rocket size={18} className="inline-block ml-2" />
                      </button>
                    </Link>
                  </div>
                </div>
                <div className={`relative ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                  {/* Multiple glow layers for depth */}
                  <div
                    className={`absolute -inset-4 rounded-lg blur-lg opacity-30 transition-all duration-700 ${
                      theme === "dark" ? "bg-[#FF6900]/5" : "bg-[#FF6900]/5"
                    }`}
                  ></div>

                  <div
                    className={`absolute -inset-2 rounded-lg blur-md opacity-50 transition-all duration-500 ${
                      theme === "dark" ? "bg-[#FF6900]/5" : "bg-[#FF6900]/10"
                    }`}
                  ></div>

                  {/* Main image container with glow */}
                  <div
                    className={`relative rounded-lg overflow-hidden flex items-center justify-center border transition-all duration-300 shadow-[0_0_10px_#FF6900,0_0_20px_#FF6900] ${
                      theme === "dark"
                        ? "bg-[#141414] border-[#2A2A2A]"
                        : "bg-[#F9F9F9] border-[#EAEAEA]"
                    }`}
                  >
                    <img
                      src={section.image}
                      alt={section.title}
                      className="w-full h-auto object-cover relative z-10 transform transition-transform duration-500 hover:scale-105"
                      style={{ maxHeight: "400px" }}
                    />

                    {/* Subtle gradient overlay */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br opacity-20 ${
                        theme === "dark"
                          ? "from-[#FF6900]/10 via-transparent to-[#FF6900]/5"
                          : "from-[#FF6900]/5 via-transparent to-[#FF6900]/5"
                      }`}
                    ></div>

                    {/* Edge glow */}
                    <div
                      className={`absolute inset-0 rounded-lg border-2 opacity-50 ${
                        theme === "dark"
                          ? "border-[#FF6900]/10"
                          : "border-[#FF6900]/10"
                      }`}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* Call to Action - Increased side margins */}
        <section className="py-12 md:py-20 text-center w-full px-6 sm:px-10 md:px-16">
          <div
            className={`relative p-6 md:p-10 lg:p-12 rounded-3xl max-w-4xl mx-auto shadow-lg ${
              theme === "dark"
                ? "bg-orange-100 border border-[#2A2A2A] shadow-black/30"
                : "bg-orange-50 border border-[#EAEAEA] shadow-md"
            }`}
          >
            <h2
              className={`text-2xl md:text-3xl lg:text-4xl font-extrabold mb-6 font-poppins ${
                theme === "dark" ? "text-[#222222]" : "text-[#222222]"
              }`}
            >
              Ready to enter the <PrimaryAccentText text="Prepverse?" />
            </h2>
            <p
              className={`text-base md:text-lg mb-8 md:mb-10 font-inter max-w-2xl mx-auto ${
                theme === "dark" ? "text-[#333333]" : "text-[#444444]"
              }`}
            >
              Start your AI-powered preparation today — mock interviews, resume
              help, and more!
            </p>
            <Link to="/mockInterviewLandingPage">
              <button className="px-5 py-3 md:px-8 md:py-3.5 rounded-2xl font-semibold bg-[#FF6900] text-white font-poppins transition-transform hover:scale-105 hover:shadow-[0_0_20px_#FF6900aa] text-sm md:text-base">
                Launch AI Interview
                <Rocket size={18} className="inline-block ml-2" />
              </button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home2;