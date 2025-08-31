import React from "react";
import { GitHub, LinkedIn, Twitter, Mail } from "@mui/icons-material";

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-gray-300 py-10 px-6 border-t border-gray-800 w-[100vw]">
      <div className="max-w-7xl mx-auto flex flex-col items-center space-y-6">

        
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white">InterviewAI</h3>
          <p className="text-sm text-gray-500 mt-1">
            Master your interviews with AI-driven feedback and guidance.
          </p>
        </div>

        
        <div className="flex space-x-4">
          <a href="#" className="bg-gray-800 hover:bg-blue-600 text-gray-300 hover:text-white p-2 rounded-full transition">
            <LinkedIn fontSize="small" />
          </a>
          <a href="#" className="bg-gray-800 hover:bg-sky-500 text-gray-300 hover:text-white p-2 rounded-full transition">
            <Twitter fontSize="small" />
          </a>
          <a href="#" className="bg-gray-800 hover:bg-gray-600 text-gray-300 hover:text-white p-2 rounded-full transition">
            <GitHub fontSize="small" />
          </a>
          <a href="#" className="bg-gray-800 hover:bg-red-500 text-gray-300 hover:text-white p-2 rounded-full transition">
            <Mail fontSize="small" />
          </a>
        </div>

        
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
          <a href="#" className="hover:text-white transition-colors">Careers</a>
        </div>

        <div className="w-full h-px bg-gray-800" />

        
        <p className="text-gray-500 text-xs text-center">
          © {new Date().getFullYear()} InterviewAI. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
