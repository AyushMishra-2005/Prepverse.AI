import React, { useState } from "react";
import { motion } from "framer-motion";

function ProfilePage() {
  const [resumeLink, setResumeLink] = useState(""); 
  const [resumeDetails, setResumeDetails] = useState({
    Education: "B.Tech in CSE from VIT-AP University",
    Skills: "React, Node.js, MongoDB, TailwindCSS",
    Projects: "AI Interview Assistant, Resume Builder, Gas Detection System",
    Experience: "Intern at Discount Fabrics Limited as Web Developer",
  });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeLink(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 text-white overflow-x-hidden p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto rounded-xl bg-slate-800/50 backdrop-blur-sm border border-slate-700 mt-8 md:mt-16 p-6 md:p-8"
      >
        <div className="flex flex-col md:flex-row items-center">
          <div className="flex-shrink-0 mb-6 md:mb-0">
            <div className="relative">
              <img
                src="https://t4.ftcdn.net/jpg/03/83/25/83/360_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg"
                alt="User"
                className="h-32 w-32 rounded-full object-cover border-4 border-slate-600"
              />
            </div>
          </div>
          
          <div className="md:ml-8 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Ayush Mishra
            </h1>
            <p className="text-slate-300 mt-1">@ayushm</p>
            <p className="text-slate-300">ayush@example.com</p>
            
            <div className="mt-4">
              {resumeLink ? (
                <motion.a
                  whileHover={{ scale: 1.03 }}
                  href={resumeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                >
                  <span>View Resume</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </motion.a>
              ) : (
                <p className="text-red-400 flex items-center justify-center md:justify-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  No resume uploaded
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="max-w-4xl mx-auto mt-6 mb-12"
      >
        {!resumeLink ? (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 text-center">
            <div className="flex justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Complete Your Profile</h3>
            <p className="text-slate-300 mb-6">
              Upload your resume to complete your profile and unlock all features.
            </p>
            
            <motion.label 
              whileHover={{ scale: 1.03 }}
              className="inline-flex items-center px-6 py-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium cursor-pointer transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Upload Resume
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
            </motion.label>
            <p className="text-slate-400 text-sm mt-2">Supported formats: PDF, DOC, DOCX</p>
          </div>
        ) : (
          <div>
            <div className="flex flex-col md:flex-row items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white mb-4 md:mb-0">
                Resume Details
              </h2>
              
              <motion.label 
                whileHover={{ scale: 1.03 }}
                className="inline-flex items-center px-4 py-2 rounded-md bg-slate-700 border border-slate-600 text-slate-200 text-sm cursor-pointer hover:bg-slate-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Update Resume
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </motion.label>
            </div>
            
            {/* All resume details inside one box */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              {Object.entries(resumeDetails).map(([field, content], index) => (
                <motion.div 
                  key={field}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="mb-4 last:mb-0"
                >
                  <h3 className="text-lg font-semibold text-white">{field}</h3>
                  <p className="text-slate-300 mt-1">{content}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default ProfilePage;
