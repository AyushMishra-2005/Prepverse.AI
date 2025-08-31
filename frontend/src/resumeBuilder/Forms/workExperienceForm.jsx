import React, { useState } from 'react';
import { X } from 'lucide-react';
import useResumeStore from '../../stateManage/useResumeStore.js'

function WorkExperienceForm() {
  const {
    resumeData: { workExperience },
    updateArrayItemField,
    addArrayItem,
    removeArrayItem
  } = useResumeStore();


  const emptyWorkExperience = {
    company: "",
    role: "",
    startDate: "",
    endDate: "",
    description: ""
  }

  return (
    <div className="space-y-2 p-2 flex flex-col h-full">
      <div>
        <h2 className="text-xl font-semibold text-white mt-2 border-b border-white/10 pb-2">
          Work Experience
        </h2>
      </div>

      {workExperience?.map((exp, index) => (
        <div
          key={index}
          className="relative border border-white/10 rounded-lg p-4 space-y-4 bg-white/5"
        >
          {workExperience.length > 1 && (
            <button
              onClick={() => removeArrayItem('workExperience', index)}
              className="absolute top-2 right-2 text-red-400 hover:text-red-600"
              title="Remove this work experience"
            >
              <X size={18} />
            </button>
          )}


          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor={`company-${index}`} className="block text-sm font-medium text-gray-300 mb-1">
                Company
              </label>
              <input
                type="text"
                id={`company-${index}`}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg 
                         text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                         focus:ring-blue-500/50 focus:border-transparent transition-all"
                placeholder="ABC Company"
                onChange={(e) => {
                  updateArrayItemField('workExperience', index, 'company', e.target.value);
                }}
                value={exp.company}
              />
            </div>

            <div className="flex-1">
              <label htmlFor={`role-${index}`} className="block text-sm font-medium text-gray-300 mb-1">
                Role
              </label>
              <input
                type="text"
                id={`role-${index}`}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg 
                         text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                         focus:ring-blue-500/50 focus:border-transparent transition-all"
                placeholder="Frontend Developer"
                onChange={(e) => {
                  updateArrayItemField('workExperience', index, 'role', e.target.value);
                }}
                value={exp.role}
              />
            </div>
          </div>


          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor={`startDate-${index}`} className="block text-sm font-medium text-gray-300 mb-1">
                Start Date
              </label>
              <input
                type="date"
                id={`startDate-${index}`}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg 
                         text-white focus:outline-none focus:ring-2 
                         focus:ring-blue-500/50 focus:border-transparent transition-all"
                onChange={(e) => {
                  updateArrayItemField('workExperience', index, 'startDate', e.target.value);
                }}
                value={exp.startDate}
              />
            </div>

            <div className="flex-1">
              <label htmlFor={`endDate-${index}`} className="block text-sm font-medium text-gray-300 mb-1">
                End Date
              </label>
              <input
                type="date"
                id={`endDate-${index}`}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg 
                         text-white focus:outline-none focus:ring-2 
                         focus:ring-blue-500/50 focus:border-transparent transition-all"
                onChange={(e) => {
                  updateArrayItemField('workExperience', index, 'endDate', e.target.value);
                }}
                value={exp.endDate}
              />
            </div>
          </div>

          <div>
            <label htmlFor={`description-${index}`} className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              id={`description-${index}`}
              rows={4}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg 
                         text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                         focus:ring-blue-500/50 focus:border-transparent transition-all"
              placeholder="What did you do in this role?"
              onChange={(e) => {
                updateArrayItemField('workExperience', index, 'description', e.target.value);
              }}
              value={exp.description}
            />
          </div>
        </div>
      ))}

      <div className="mt-auto">
        <button
          onClick={() => addArrayItem('workExperience', emptyWorkExperience)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/40 text-blue-200 text-sm font-medium transition-all duration-200"
        >
          <span className="text-lg">+</span> Add Work Experience
        </button>
      </div>
    </div>
  );
}

export default WorkExperienceForm;
