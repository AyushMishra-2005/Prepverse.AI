// InternshipPage.jsx
import React, { useState, useEffect } from "react";
import {
  MapPin,
  DollarSign,
  Calendar,
  ArrowRight,
  Rocket,
} from "lucide-react";
import { ColourfulText } from "../components/ui/colourful-text.jsx";
import TechCorpLogo from "../assets/TechCrop.png";
import DataVisionLogo from "../assets/images.png";
import CreativeStudiosLogo from "../assets/cs.png";
import { Link } from "react-router-dom";

const generateInternships = () => {
  return [
    {
      id: 1,
      title: "Frontend Developer Intern",
      company: "TechCorp Inc.",
      skills: ["React", "JavaScript", "CSS"],
      location: "San Francisco, CA",
      salary: "$25-35/hr",
      posted: "2 days ago",
      top3: true,
      logo: TechCorpLogo,
    },
    {
      id: 2,
      title: "Data Science Intern",
      company: "DataVision Analytics",
      skills: ["Python", "Machine Learning", "SQL"],
      location: "Remote",
      salary: "$22-30/hr",
      posted: "5 days ago",
      top3: true,
      logo: DataVisionLogo,
    },
    {
      id: 3,
      title: "UX Design Intern",
      company: "Creative Studios",
      skills: ["Figma", "UI/UX", "Wireframing"],
      location: "New York, NY",
      salary: "$24-32/hr",
      posted: "1 week ago",
      top3: true,
      logo: CreativeStudiosLogo,
    },
    {
      id: 4,
      title: "Backend Developer Intern",
      company: "ServerStack Solutions",
      skills: ["Node.js", "Python", "API"],
      location: "Austin, TX",
      salary: "$26-34/hr",
      posted: "3 days ago",
      top3: false,
      logo: DataVisionLogo,
    },
    {
      id: 5,
      title: "Marketing Intern",
      company: "Growth Hackers",
      skills: ["SEO", "Content", "Social Media"],
      location: "Chicago, IL",
      salary: "$20-28/hr",
      posted: "4 days ago",
      top3: false,
      logo: CreativeStudiosLogo,
    },
    {
      id: 6,
      title: "DevOps Intern",
      company: "CloudInfra Inc.",
      skills: ["Docker", "Kubernetes", "AWS"],
      location: "Remote",
      salary: "$28-36/hr",
      posted: "6 days ago",
      top3: false,
      logo: TechCorpLogo,
    },
    {
      id: 7,
      title: "Mobile App Developer Intern",
      company: "AppWorks",
      skills: ["React Native", "iOS", "Android"],
      location: "Seattle, WA",
      salary: "$26-34/hr",
      posted: "1 day ago",
      top3: false,
      logo: DataVisionLogo,
    },
    {
      id: 8,
      title: "Product Management Intern",
      company: "Innovate Labs",
      skills: ["Strategy", "Research", "Analysis"],
      location: "Boston, MA",
      salary: "$24-30/hr",
      posted: "1 week ago",
      top3: false,
      logo: CreativeStudiosLogo,
    },
    {
      id: 9,
      title: "Cybersecurity Intern",
      company: "SecureNet",
      skills: ["Security", "Networking", "Encryption"],
      location: "Washington, DC",
      salary: "$27-35/hr",
      posted: "3 days ago",
      top3: false,
      logo: DataVisionLogo,
    },
    {
      id: 10,
      title: "AI Research Intern",
      company: "NeuralMind",
      skills: ["Python", "TensorFlow", "NLP"],
      location: "Remote",
      salary: "$30-40/hr",
      posted: "2 days ago",
      top3: false,
      logo: TechCorpLogo,
    },
  ];
};

const InternshipCard = ({ internship, isTopPick }) => (
  <div
    className={`
      relative p-6 rounded-3xl border border-gray-800 backdrop-blur-sm
      hover:border-indigo-500/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl
      bg-gradient-to-br from-gray-900/20 to-gray-800/20
    `}
  >
    <div className="flex items-center justify-between mb-4">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden border border-gray-700 bg-gray-800">
        <img
          src={internship.logo}
          alt="Company Logo"
          className="w-full h-full object-cover"
        />
      </div>
      {isTopPick && (
        <span className="px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/30">
          Top Match
        </span>
      )}
    </div>
    <h3 className="text-xl font-bold mb-1 text-white">{internship.title}</h3>
    <p className="text-gray-400 mb-4">{internship.company}</p>

    <div className="flex flex-wrap gap-2 mb-6">
      {internship.skills.map((skill, index) => (
        <span
          key={index}
          className="px-3 py-1 rounded-full text-xs font-medium text-gray-300 bg-gray-800/70 backdrop-blur-sm"
        >
          {skill}
        </span>
      ))}
    </div>

    <div className="flex flex-col space-y-3 text-sm text-gray-400 mb-6">
      <div className="flex items-center">
        <MapPin size={16} className="mr-2 text-indigo-400" />
        <span>{internship.location}</span>
      </div>
      <div className="flex items-center">
        <DollarSign size={16} className="mr-2 text-indigo-400" />
        <span>{internship.salary}</span>
      </div>
      <div className="flex items-center">
        <Calendar size={16} className="mr-2 text-indigo-400" />
        <span>Posted {internship.posted}</span>
      </div>
    </div>

    <button
      className={`w-full py-3 font-semibold rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg
        ${
          isTopPick
            ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
            : "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
        }
      `}
    >
      {isTopPick ? "Apply Now" : "View & Apply"}
      <ArrowRight size={16} className="inline-block ml-2" />
    </button>
  </div>
);

const InternshipPage = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setInternships(generateInternships());
      setLoading(false);
    }, 1000);
  }, []);

  const handleLoadMore = () => {
    setShowAll(true);
  };

  const topInternships = internships.filter((i) => i.top3);
  const otherInternships = internships.filter((i) => !i.top3);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black to-gray-900 text-white font-sans overflow-x-hidden">
      <main className="w-full px-8 py-16">
        {/* Header Section */}
        <section className="text-center mb-20 pt-20">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4 leading-tight">
            Find Your <ColourfulText text="Next Opportunity" />
          </h1>
          <p className="text-lg md:text-xl text-neutral-400 mb-8">
            Our intelligent system curates the best internships, tailored to your unique skills and aspirations.
          </p>
        </section>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
          </div>
        ) : (
          <>
            {/* Top Matches Section */}
            <section className="mb-20">
              <h2 className="text-4xl font-bold mb-12 text-center text-white">
                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Top Matches for You
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                {topInternships.map((internship) => (
                  <InternshipCard
                    key={internship.id}
                    internship={internship}
                    isTopPick={true}
                  />
                ))}
              </div>
            </section>

            {!showAll && (
              <div className="text-center my-16">
                <button
                  onClick={handleLoadMore}
                  className="px-10 py-5 rounded-full font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
                >
                  Load More Internships
                  <ArrowRight size={20} className="inline-block ml-2" />
                </button>
              </div>
            )}

            {showAll && (
              <section className="mt-20">
                <h2 className="text-4xl font-bold mb-12 text-center text-white">
                  <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    More Opportunities
                  </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                  {otherInternships.map((internship) => (
                    <InternshipCard
                      key={internship.id}
                      internship={internship}
                      isTopPick={false}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* Call to Action section */}
        <section className="py-20 text-center w-full">
          <div className="relative p-12 rounded-3xl bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/30 backdrop-blur-sm max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Ready to find your future?
              </span>
            </h2>
            <p className="text-lg text-neutral-400 mb-10">
              Don't just look for a job, find the perfect launchpad for your career with Prepverse.AI.
            </p>
            <Link to="/">
              <button className="px-12 py-5 rounded-full font-bold bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">
                Get Started Now
                <Rocket size={20} className="inline-block ml-2" />
              </button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default InternshipPage;