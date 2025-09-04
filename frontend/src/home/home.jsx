import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom"; 
import { Lightbulb, Bot, FileText, Rocket } from "lucide-react"; // ✅ Added Rocket
import { BackgroundLines } from "../components/ui/background-lines.jsx";
import { ColourfulText } from "../components/ui/colourful-text.jsx";
import { ImagesSlider } from "../components/ui/images-slider.jsx";
import { ScrollerComponent } from "./scrollerComponent.jsx";
import WorkFlow from "./WorkFlow.jsx";

function HomeComponent() {
  const imageRef = useRef(null);

  const images = [
    "https://sbscyber.com/hs-fs/hubfs/Images/BlogImages/AdobeStock_604631734.jpeg?width=8000&height=4064&name=AdobeStock_604631734.jpeg",
    "https://www.ttnews.com/sites/default/files/2023-09/iTECH-Dysart-1200.jpg",
    "https://media.licdn.com/dms/image/v2/D4E12AQHKzw6UvrCJ3Q/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1735926830143?e=2147483647&v=beta&t=dILdJD0aBd3IJOnt13DwQ6oR4heH4FIqHc2CBp8lzks",
  ];

  useEffect(() => {
    const imageElement = imageRef.current;

    const handleScroll = () => {
      if (!imageElement) return;
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        imageElement.classList.add("scrolled");
      } else {
        imageElement.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex flex-col items-center justify-start w-full min-h-[200vh] bg-black text-white overflow-x-hidden">
      {/* Hero Section */}
      <div className="h-[70vh] flex flex-col justify-center items-center px-4">
        <BackgroundLines className="flex items-center justify-center w-full flex-col gap-6">
          <h1 className="text-2xl md:text-5xl lg:text-7xl font-bold text-center relative z-20 font-sans">
            Welcome to <ColourfulText text="Prepverse.AI" /> <br /> Your
            AI-powered career universe
          </h1>
          <p className="max-w-xl mx-auto text-sm md:text-lg text-neutral-400 text-center">
            Step into the multiverse of preparation — AI-powered mock
            interviews, resume scoring, ATS analysis, and personalized quizzes.
            Everything tailored just for your career success.
          </p>
        </BackgroundLines>
      </div>

      {/* Hero Image */}
      <div className="hero-image-wrapper md:mt-0 w-[100vw] flex justify-center h-[50rem]">
        <div ref={imageRef} className="hero-image w-[80vw] transition-all duration-500">
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

      {/* Workflow Section */}
      <div className="mb-10">
        <WorkFlow />
      </div>

      {/* Scroller Section */}
      <div className="mb-10">
        <ScrollerComponent />
      </div>

      {/* Features Promotion Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4"> {/* ✅ narrowed width */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-center mb-6">
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Supercharge Your Career Journey
              </span>
            </h2>
            <p className="text-gray-300 text-lg">
              Everything you need to ace interviews and build your career
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="p-8 rounded-3xl border border-gray-800 backdrop-blur-sm bg-gradient-to-br from-gray-900/50 to-gray-800/50 transition-all duration-300 hover:transform hover:-translate-y-2 hover:border-blue-500/30">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                  <Lightbulb size={28} />
                </div>
                <h3 className="text-2xl font-bold ml-4 text-white">
                  AI Skill Quiz
                </h3>
              </div>
              <p className="text-neutral-400 mb-6">
                Discover your strengths with our AI-powered quizzes and get
                personalized recommendations to sharpen your skills for success.
              </p>
              <Link to="/quiz">
                <button className="px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white transition-all duration-300 transform hover:-translate-y-0.5">
                  Take a Quiz
                </button>
              </Link>
            </div>

            {/* Card 2 */}
            <div className="p-8 rounded-3xl border border-gray-800 backdrop-blur-sm bg-gradient-to-br from-gray-900/50 to-gray-800/50 transition-all duration-300 hover:transform hover:-translate-y-2 hover:border-purple-500/30">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                  <Bot size={28} />
                </div>
                <h3 className="text-2xl font-bold ml-4 text-white">
                  Mock Interviews
                </h3>
              </div>
              <p className="text-neutral-400 mb-6">
                Prepare for the real deal. Our AI gives you instant,
                constructive feedback to help you ace your next interview.
              </p>
              <Link to="/mockInterviewLandingPage">
                <button className="px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transition-all duration-300 transform hover:-translate-y-0.5">
                  Practice Now
                </button>
              </Link>
            </div>

            {/* Card 3 */}
            <div className="p-8 rounded-3xl border border-gray-800 backdrop-blur-sm bg-gradient-to-br from-gray-900/50 to-gray-800/50 transition-all duration-300 hover:transform hover:-translate-y-2 hover:border-green-500/30">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br from-green-500 to-teal-500 text-white">
                  <FileText size={28} />
                </div>
                <h3 className="text-2xl font-bold ml-4 text-white">
                  Resume Builder
                </h3>
              </div>
              <p className="text-neutral-400 mb-6">
                Craft a professional resume that gets noticed. Our smart builder
                guides you to create a perfect resume in minutes.
              </p>
              <Link to="/resume">
                <button className="px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white transition-all duration-300 transform hover:-translate-y-0.5">
                  Build My Resume
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 text-center w-full">
        <div className="relative p-12 rounded-3xl bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/30 backdrop-blur-sm max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Ready to enter the Prepverse?
            </span>
          </h2>
          <p className="text-lg text-neutral-400 mb-10">
            Start your AI-powered preparation today — mock interviews, resume
            help, and more!
          </p>
          <Link to="/mockInterviewLandingPage">
            <button className="px-12 py-5 rounded-full font-bold bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">
              Launch AI Interview
              <Rocket size={20} className="inline-block ml-2" />
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HomeComponent;