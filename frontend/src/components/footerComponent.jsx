import React from "react";
import { FaTwitter, FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative z-20 w-screen bg-[#0D0D0D] border-t border-[#2A2A2A] overflow-hidden">
      
      {/* 🔶 Orange Smoky Animated Divider */}
<div className="relative w-full h-[6px] overflow-hidden">
  {/* Blurred smoky glow */}
  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FF6900] to-transparent blur-xl opacity-70 animate-pulse-slow" />

  {/* Core sharp glowing line */}
  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FF6900] to-transparent animate-flow" />
</div>


      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-12 grid md:grid-cols-2 gap-10 items-center">
        
        {/* Left Section */}
        <div className="space-y-4 text-center md:text-left">
          <h3 className="text-3xl font-bold text-white tracking-wide">
            <span className="text-[#FF6900] drop-shadow-[0_0_8px_rgba(255,105,0,0.6)]">
              Prepverse
            </span>
            .AI
          </h3>
          <p className="text-sm text-[#B3B3B3] max-w-sm leading-relaxed mx-auto md:mx-0">
            Step into the AI-powered career universe — mock interviews, quizzes, 
            and resume tools designed to help you shine.
          </p>
        </div>

        {/* Right Section */}
        <div className="flex flex-col items-center md:items-end space-y-6">
          {/* Links */}
          <div className="flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-3 text-sm font-medium">
            {["Privacy", "Terms", "Contact", "Careers"].map((link, i) => (
              <a
                key={i}
                href="#"
                className="text-[#B3B3B3] hover:text-[#FF6900] transition-colors"
              >
                {link}
              </a>
            ))}
          </div>

          {/* Social Icons */}
          <div className="flex space-x-5">
            {[
              { icon: <FaLinkedin />, href: "#" },
              { icon: <FaTwitter />, href: "#" },
              { icon: <FaGithub />, href: "#" },
              { icon: <FaEnvelope />, href: "#" },
            ].map((item, i) => (
              <a
                key={i}
                href={item.href}
                className="w-11 h-11 flex items-center justify-center rounded-full border border-[#2A2A2A] text-[#B3B3B3] transition-all duration-300 hover:text-[#FF6900] hover:border-[#FF6900] hover:shadow-[0_0_12px_#FF6900]"
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#2A2A2A] to-transparent" />

      {/* Copyright */}
      <p className="text-xs text-[#777] text-center py-4 tracking-wide">
        © {new Date().getFullYear()}{" "}
        <span className="text-[#FF6900] font-medium">Prepverse.AI</span> — All
        rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
