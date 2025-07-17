import React from 'react'
import useResumeStore from '../../stateManage/useResumeStore';

function ContactInfoForm() {

  const {resumeData, updateResumeField} = useResumeStore();

  return (
    <div className="space-y-6 p-2 flex flex-col justify-evenly">

      <div>
        <h2 className="text-xl font-semibold text-white mt-2">
          Contact Information
        </h2>
      </div>

      <div className="flex-1">
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">
          Address
        </label>
        <input
          type="text"
          id="fullName"
          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg 
                      text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                      focus:ring-blue-500/50 focus:border-transparent transition-all"
          placeholder="Short Address"
          onChange={(e) => {
            updateResumeField('contactInfo', 'location', e.target.value);
          }}
          value={resumeData.contactInfo?.location}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">
            Email
          </label>
          <input
            type="text"
            id="email"
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg 
                      text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                      focus:ring-blue-500/50 focus:border-transparent transition-all"
            placeholder="John@gmail.com"
            onChange={(e) => {
              updateResumeField('contactInfo', 'email', e.target.value);
            }}
            value={resumeData.contactInfo?.email}
          />
        </div>


        <div className="flex-1">
          <label htmlFor="designation" className="block text-sm font-medium text-gray-300 mb-1">
            Phone Number
          </label>
          <input
            type="text"
            id="phoneNumber"
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg 
                      text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                      focus:ring-blue-500/50 focus:border-transparent transition-all"
            placeholder="9078343277"
            onChange={(e) => {
              updateResumeField('contactInfo', 'phone', e.target.value);
            }}
            value={resumeData.contactInfo?.phone}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">
            LinkedIn
          </label>
          <input
            type="text"
            id="linkedIn"
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg 
                      text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                      focus:ring-blue-500/50 focus:border-transparent transition-all"
            placeholder="https://linkedin.com/in/username"
            onChange={(e) => {
              updateResumeField('contactInfo', 'linkedin', e.target.value);
            }}
            value={resumeData.contactInfo?.linkedin}
          />
        </div>

        <div className="flex-1">
          <label htmlFor="designation" className="block text-sm font-medium text-gray-300 mb-1">
            GitHub
          </label>
          <input
            type="text"
            id="gitHub"
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg 
                      text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                      focus:ring-blue-500/50 focus:border-transparent transition-all"
            placeholder="https://github.com/username"
            onChange={(e) => {
              updateResumeField('contactInfo', 'github', e.target.value);
            }}
            value={resumeData.contactInfo?.github}
          />
        </div>
      </div>

      <div className="flex-1">
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">
          Portfolio / Website
        </label>
        <input
          type="text"
          id="Portfolio"
          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg 
                      text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                      focus:ring-blue-500/50 focus:border-transparent transition-all"
          placeholder="https://yourwebsite.com"
          onChange={(e) => {
            updateResumeField('contactInfo', 'website', e.target.value);
          }}
          value={resumeData.contactInfo?.website}
        />
      </div>

    </div>
  )
}

export default ContactInfoForm