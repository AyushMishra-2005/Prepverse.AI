import React, { useEffect, useRef, useContext } from "react";
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
} from "react-icons/fa";
import { motion } from "framer-motion";

import globeAnimation from "../assets/Globe1.json";
import Button from "./Button.jsx";
import { ThemeContext } from "../context/ThemeContext";
import { ImagesSlider } from "../components/ui/images-slider.jsx";

// ---------------- Workflow Steps ----------------
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
  const imageRef = useRef(null);
  const { theme } = useContext(ThemeContext);

  const images = [
    "https://sbscyber.com/hs-fs/hubfs/Images/BlogImages/AdobeStock_604631734.jpeg?width=8000&height=4064&name=AdobeStock_604631734.jpeg",
    "https://www.ttnews.com/sites/default/files/2023-09/iTECH-Dysart-1200.jpg",
    "https://media.licdn.com/dms/image/v2/D4E12AQHKzw6UvrCJ3Q/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1735926830143?e=2147483647&v=beta&t=dILdJD0aBd3IJOnt13DwQ6oR4heH4FIqHc2CBp8lzks",
  ];

  // Effect for Particles.js
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

  // Effect for scroll handling
  useEffect(() => {
    const handleScroll = () => {
      if (!imageRef.current) return;
      const scrollThreshold = 100;
      if (window.scrollY > scrollThreshold) {
        imageRef.current.classList.add("scrolled");
      } else {
        imageRef.current.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ---------------- Accent Text Component ----------------
  const PrimaryAccentText = ({ text }) => (
    <span className="text-[#FF6900]">{text}</span>
  );

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
          theme === "dark"
            ? "bg-[#0e0805] bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)]"
            : "bg-[#F9F9F9] bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)]"
        } bg-[length:30px_30px]`}
      ></div>

      {/* Main Page Content */}
      <div className="relative z-10 font-inter flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-6 md:px-12 lg:px-20 py-28 mt-12 grid md:grid-cols-2 gap-16 items-center">
          {/* Left - Text */}
          <div className="flex flex-col justify-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold font-poppins leading-tight">
              Welcome to <br />
              <PrimaryAccentText text="Prepverse.AI" /> <br />
              Your AI-powered career universe
            </h1>
            <p
              className={`text-base font-inter max-w-md leading-relaxed ${
                theme === "dark" ? "text-[#B3B3B3]" : "text-[#555]"
              }`}
            >
              Step into the multiverse of preparation — mock interviews, resume
              scoring, ATS analysis, and personalized quizzes.
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

        {/* Hero Image */}
        <div className="hero-image-wrapper md:mt-0 w-[100vw] flex justify-center h-[50rem]">
          <div
            ref={imageRef}
            className="hero-image w-[80vw] transition-all duration-500"
          >
            <ImagesSlider className="h-[40rem]" images={images}>
              <motion.div
                initial={{ opacity: 0, y: -80 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="z-50 flex flex-col justify-center items-center"
              >
                <motion.p className="font-bold text-xl md:text-6xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 py-4">
                  Mock. Score. Improve. <br /> Prep like never before with AI.
                </motion.p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 backdrop-blur-sm border bg-emerald-300/10 border-emerald-500/20 text-white mx-auto text-center rounded-full relative mt-4"
                >
                  <span>Join now →</span>
                  <div className="absolute inset-x-0 h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-emerald-500 to-transparent" />
                </motion.button>
              </motion.div>
            </ImagesSlider>
          </div>
        </div>

        {/* Features Section */}
        <section className="container mx-auto py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-poppins font-bold">
              Supercharge Your <PrimaryAccentText text="Career Journey" />
            </h2>
            <p
              className={`text-sm font-inter max-w-xl mx-auto mt-2 leading-relaxed ${
                theme === "dark" ? "text-[#B3B3B3]" : "text-[#555]"
              }`}
            >
              Everything you need to ace interviews and build your career
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Mock Interviews",
                desc: "Prepare for the real deal with instant AI feedback.",
                link: "/mockInterviewLandingPage",
                btn: "Practice Now",
              },
              {
                title: "AI Skill Quiz",
                desc: "Discover strengths with AI-powered quizzes & insights.",
                link: "/quiz",
                btn: "Take a Quiz",
              },
              {
                title: "Resume Builder",
                desc: "Craft a professional resume that gets noticed.",
                link: "/resume",
                btn: "Build My Resume",
              },
            ].map((card, i) => (
              <div
                key={i}
                className={`p-8 rounded-lg border flex flex-col space-y-4 transition-all hover:-translate-y-1 ${
                  theme === "dark"
                    ? "bg-[#141414] border-[#2A2A2A] hover:border-[#FF6900] hover:shadow-[0_0_25px_#FF690040]"
                    : "bg-[#FFFFFF] border-[#EAEAEA] shadow-md hover:border-[#FF6900] hover:shadow-[0_0_25px_#FF690020]"
                }`}
              >
                <span className="text-[#FF6900] text-3xl">◆</span>
                <h3 className="text-lg font-poppins font-semibold">
                  {card.title}
                </h3>
                <p
                  className={`text-base font-inter leading-relaxed ${
                    theme === "dark" ? "text-[#B3B3B3]" : "text-[#555]"
                  }`}
                >
                  {card.desc}
                </p>
                <Link to={card.link}>
                  <button className="mt-4 bg-[#FF6900] text-white font-poppins font-bold py-3 px-6 rounded-full transition-transform hover:scale-105">
                    {card.btn}
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Workflow Section */}
        <section className="py-20 relative">
          <div className="container mx-auto px-6 max-w-7xl text-center">
            <h2 className="text-2xl md:text-3xl font-poppins font-bold mb-4">
              How <PrimaryAccentText text="Prepverse.AI" /> Works
            </h2>
            <p
              className={`font-inter max-w-2xl mx-auto mb-16 leading-relaxed ${
                theme === "dark" ? "text-[#B3B3B3]" : "text-[#555]"
              }`}
            >
              The smartest AI-powered career prep journey, designed to help you
              succeed.
            </p>

            <div className="relative">
              <div className="hidden md:block absolute top-8 left-0 w-full h-[2px] bg-gradient-to-r from-[#FF6900] via-orange-400 to-[#FF6900] opacity-50 blur-[2px]" />
              <div className="grid grid-cols-1 md:grid-cols-6 gap-10 relative z-10">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-2"
                  >
                    <div
                      className={`flex items-center justify-center w-16 h-16 rounded-full mb-4 shadow-md ${
                        theme === "dark"
                          ? "bg-[#141414] border border-[#2A2A2A] text-[#FF6900] shadow-[#ff690050]"
                          : "bg-white border border-[#EAEAEA] text-[#FF6900]"
                      }`}
                    >
                      {step.icon}
                    </div>
                    <h3 className="text-lg font-semibold font-poppins">
                      {step.title}
                    </h3>
                    <p
                      className={`text-sm font-inter leading-relaxed max-w-[180px] ${
                        theme === "dark" ? "text-[#B3B3B3]" : "text-[#555]"
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

        {/* ---------------- AI Hire ---------------- */}
        <section className="container mx-auto py-20">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h1 className="text-5xl font-poppins font-extrabold text-[#FF6900]">
                AI Hire
              </h1>
              <h2
                className={`text-4xl font-poppins mt-2 mb-6 font-bold ${
                  theme === "dark" ? "text-white" : "text-[#1A1A1A]"
                }`}
              >
                Smarter recruitment
              </h2>
              <p
                className={`text-base font-inter mb-8 leading-relaxed ${
                  theme === "dark" ? "text-[#B3B3B3]" : "text-[#555]"
                }`}
              >
                Empower your hiring process with AI-driven interview design,
                seamless candidate invites, and performance evaluation.
              </p>
              <div className="space-y-6">
                {[
                  {
                    title: "Custom Interview Design",
                    desc: "Easily create structured interview processes tailored to your company’s needs.",
                  },
                  {
                    title: "Candidate Insights",
                    desc: "Analyze candidate performance with AI-powered evaluation and actionable feedback.",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start space-x-4">
                    <span className="text-[#FF6900] text-xl font-poppins font-bold">
                      ◆
                    </span>
                    <div>
                      <h4
                        className={`text-xl font-poppins font-medium ${
                          theme === "dark" ? "text-white" : "text-[#1A1A1A]"
                        }`}
                      >
                        {item.title}
                      </h4>
                      <p
                        className={`text-base font-inter leading-relaxed ${
                          theme === "dark" ? "text-[#B3B3B3]" : "text-[#555]"
                        }`}
                      >
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div
              className={`rounded-lg p-6 flex items-center justify-center border transition-all duration-300 ${
                theme === "dark"
                  ? "bg-[#141414] border-[#2A2A2A] shadow-black/30 hover:shadow-[0_0_40px_#FF6900]"
                  : "bg-[#F9F9F9] border-[#EAEAEA] shadow-md hover:shadow-[0_0_40px_rgba(255,105,0,0.4)]"
              }`}
            >
              <div className="text-center">
                <span className="text-[#FF6900] text-6xl font-poppins font-bold">
                  90%
                </span>
                <p
                  className={`text-base font-inter ${
                    theme === "dark" ? "text-[#B3B3B3]" : "text-[#555]"
                  }`}
                >
                  Faster hiring efficiency
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 text-center w-full">
          <div
            className={`relative p-12 rounded-3xl max-w-5xl mx-auto shadow-lg ${
              theme === "dark"
                ? "bg-[#141414] border border-[#2A2A2A] shadow-black/30"
                : "bg-white border border-[#EAEAEA] shadow-md"
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 font-poppins">
              Ready to enter the <PrimaryAccentText text="Prepverse?" />
            </h2>
            <p
              className={`text-lg mb-10 font-inter max-w-2xl mx-auto ${
                theme === "dark" ? "text-[#B3B3B3]" : "text-[#555]"
              }`}
            >
              Start your AI-powered preparation today — mock interviews, resume
              help, and more!
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
