import React, { useState, useEffect, useContext } from "react";
import {
  DollarSign,
  Calendar,
  ArrowRight,
  Briefcase,
  Rocket,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import axios from 'axios'
import server from '../environment.js'
import { useNavigate } from "react-router-dom";
import useInternships from '../stateManage/useInternships.js';
import {toast} from 'react-hot-toast';

const InternshipCard = ({ internship, isTopPick }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <div
      className={`relative p-4 rounded-lg border flex flex-col justify-between
        ${theme === "dark"
          ? "bg-[#141414]/90 border-[#2A2A2A] shadow-sm"
          : "bg-white/90 border-[#EAEAEA] shadow-md"
        }
        transition-all duration-300 ease-out 
        hover:border-[#FF6900]/70 hover:shadow-md hover:-translate-y-1
      `}
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div
            className={`w-10 h-10 rounded-md flex items-center justify-center border 
              ${theme === "dark"
                ? "border-[#2A2A2A] bg-[#1f1f1f]"
                : "border-[#EAEAEA] bg-[#F5F5F5]"
              }`}
          >
            <span className="text-[#FF6900] text-xl font-poppins font-bold">◆</span>
          </div>
          {isTopPick && (
            <span className="px-2 py-0.5 text-[11px] font-medium rounded-md 
              bg-[#FF690010] text-[#FF6900] border border-[#FF690030]">
              Top Match
            </span>
          )}
        </div>

        {/* Job Info */}
        <h3
          className={`text-lg font-semibold mb-1 ${theme === "dark" ? "text-white" : "text-black"
            }`}
        >
          {internship.jobTitle}
        </h3>
        <p
          className={`text-sm mb-3 ${theme === "dark" ? "text-[#B3B3B3]" : "text-[#555555]"
            }`}
        >
          {internship.company}
        </p>

        {/* Topics */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {internship.jobTopic.split(",").map((topic, index) => (
            <span
              key={index}
              className={`px-2 py-0.5 rounded-md text-xs
                ${theme === "dark"
                  ? "text-[#E2E2E2] bg-[#1f1f1f] border border-[#2A2A2A]"
                  : "text-[#555] bg-[#F5F5F5] border border-[#EAEAEA]"
                }`}
            >
              {topic.trim()}
            </span>
          ))}
        </div>

        {/* Meta Info */}
        <div
          className={`flex flex-col space-y-2 text-xs mb-4 ${theme === "dark" ? "text-[#B3B3B3]" : "text-[#555555]"
            }`}
        >
          <div className="flex items-center">
            <Briefcase size={14} className="mr-2 text-[#FF6900]" />
            <span>
              {internship.jobType} • {internship.duration}
            </span>
          </div>
          <div className="flex items-center">
            <DollarSign size={14} className="mr-2 text-[#FF6900]" />
            <span>
              {internship.stipend === "0" ? "Unpaid" : internship.stipend}
            </span>
          </div>
          <div className="flex items-center">
            <Calendar size={14} className="mr-2 text-[#FF6900]" />
            <span>Apply by {internship.lastDate}</span>
          </div>
        </div>
      </div>

      {/* Action Button (fixed bottom) */}
      <Link to={`/internship/${internship._id}`}>
        <button
          className={`w-full py-2.5 text-sm font-medium rounded-md transition-colors duration-300
            ${isTopPick
              ? "bg-[#FF6900] text-white hover:bg-[#e65f00]"
              : "bg-transparent text-[#FF6900] border border-[#FF6900]/50 hover:bg-[#FF6900]/10"
            }`}
        >
          {isTopPick ? "Apply Now" : "View & Apply"}
          <ArrowRight size={14} className="inline-block ml-2" />
        </button>
      </Link>
    </div>
  );
};

const InternshipPage = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const { theme } = useContext(ThemeContext);
  const {internshipsData, setInternshipsData } = useInternships();
  const navigate = useNavigate();


  useEffect(() => {
    const internshipDetails = async () => {
      setLoading(true);
      try {
        const { data } = await axios.post(
          `${server}/internships/get-recomended-internships`,
          {},
          { withCredentials: true }
        );

        if(!data.recommend_internships){
          toast.error("Please complete your profile to access Internships!");
          return navigate("/profilePage");
        }

        const recommend_internships = data.recommend_internships;
        setInternships(recommend_internships);
        setInternshipsData(recommend_internships);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }finally{
        setLoading(false);
      }
    }

    internshipDetails();
  }, []);

  const topInternships = internships.slice(0, 3);
  const otherInternships = internships.slice(3);

  const handleResuggest = () => {
    setLoading(true);
    setTimeout(() => {
      // Simulate fetching new relevant internships
      setInternships([...internshipsData].sort(() => Math.random() - 0.5));
      setLoading(false);
      setShowAll(false);
    }, 1000);
  };

  return (
    <div
      className={`min-h-screen w-full font-inter overflow-x-hidden transition-colors duration-500
        ${theme === "dark" ? "bg-[#0D0D0D] text-white" : "bg-[#FFFFFF] text-[#1A1A1A]"}`}
    >
      <main className="w-full px-6">
        {/* Header Section */}
        <section className="text-center mb-16 pt-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 font-poppins">
            Find Your <span className="text-[#FF6900]">Next Opportunity</span>
          </h1>
          <p
            className={`text-base md:text-lg max-w-xl mx-auto ${theme === "dark" ? "text-[#B3B3B3]" : "text-[#555555]"
              }`}
          >
            Our intelligent system curates the best internships, tailored to
            your unique skills and aspirations.
          </p>

          {/* Resuggest Button */}
          <div className="mt-6">
            <button
              onClick={handleResuggest}
              className="px-6 py-2.5 rounded-md font-medium 
                bg-[#FF6900] text-white hover:bg-[#e65f00] 
                transition-colors duration-300 flex items-center justify-center mx-auto"
            >
              <RefreshCw size={16} className="mr-2" />
              Resuggest Internships
            </button>
          </div>
        </section>

        {/* Loader */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF6900]"></div>
          </div>
        ) : (
          <>
            {/* Top Matches */}
            <section className="mb-16">
              <h2 className="text-2xl font-semibold mb-8 text-center font-poppins">
                Top Matches for You
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topInternships.map((internship) => (
                  <InternshipCard
                    key={internship._id}
                    internship={internship}
                    isTopPick={true}
                  />
                ))}
              </div>
            </section>

            {!showAll && (
              <div className="text-center my-12">
                <button
                  onClick={() => setShowAll(true)}
                  className="px-6 py-2.5 rounded-md font-medium 
                    bg-[#FF6900] text-white hover:bg-[#e65f00] 
                    transition-colors duration-300"
                >
                  Load More Internships
                  <ArrowRight size={16} className="inline-block ml-2" />
                </button>
              </div>
            )}

            {showAll && (
              <section className="mt-16">
                <h2 className="text-2xl font-semibold mb-8 text-center font-poppins">
                  More <span className="text-[#FF6900]">Opportunities</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {otherInternships.map((internship) => (
                    <InternshipCard
                      key={internship._id}
                      internship={internship}
                      isTopPick={false}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* Call to Action */}
        <section className="py-16 text-center w-full">
          <div
            className={`p-8 rounded-xl max-w-4xl mx-auto shadow-md border 
              ${theme === "dark" ? "bg-[#141414] border-[#2A2A2A]" : "bg-white border-[#EAEAEA]"}`}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-poppins">
              Ready to <span className="text-[#FF6900]">Launch?</span>
            </h2>
            <p
              className={`text-base mb-8 max-w-lg mx-auto ${theme === "dark" ? "text-[#B3B3B3]" : "text-[#555555]"
                }`}
            >
              Don’t just look for a job, find the perfect launchpad for your
              career with Prepverse.AI.
            </p>
            <Link to="/internships">
              <button
                className="px-8 py-3 rounded-md font-medium 
                  bg-[#FF6900] text-white hover:bg-[#e65f00] 
                  transition-colors duration-300"
              >
                Get Started Now
                <Rocket size={18} className="inline-block ml-2" />
              </button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default InternshipPage;
