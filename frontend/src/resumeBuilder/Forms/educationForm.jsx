import React, { useState } from 'react';
import { X } from 'lucide-react';
import useResumeStore from '../../stateManage/useResumeStore.js'

function EducationForm() {
  const {
    resumeData: { education },
    updateArrayItemField,
    addArrayItem,
    removeArrayItem
  } = useResumeStore();

  const emptyEducation = {
    degree: "",
    institution: "",
    startDate: "",
    endDate: ""
  }

  return (
    <div className="space-y-4 p-2 flex flex-col h-full">
      <div>
        <h2 className="text-xl font-semibold text-white mt-2 border-b border-white/10 pb-2">
          Education
        </h2>
      </div>

      {education.map((edu, index) => (
        <div
          key={index}
          className="border border-white/10 rounded-lg p-4 space-y-4 bg-white/5 relative"
        >
          {education.length > 1 && (
            <button
              onClick={() => removeArrayItem('education', index)}
              className="absolute top-2 right-2 text-red-400 hover:text-red-600 cursor-pointer"
              title="Remove this education"
            >
              <X size={18} />
            </button>
          )}

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor={`degree-${index}`} className="block text-sm font-medium text-gray-300 mb-1">
                Degree
              </label>
              <input
                type="text"
                id={`degree-${index}`}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                placeholder="B.Tech in Computer Science"
                onChange={(e) => {
                  updateArrayItemField('education', index, 'degree', e.target.value);
                }}
                value={edu.degree}
              />
            </div>

            <div className="flex-1">
              <label htmlFor={`institution-${index}`} className="block text-sm font-medium text-gray-300 mb-1">
                Institution
              </label>
              <input
                type="text"
                id={`institution-${index}`}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                placeholder="IIT Delhi"
                onChange={(e) => {
                  updateArrayItemField('education', index, 'institution', e.target.value);
                }}
                value={edu.institution}
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
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                onChange={(e) => {
                  updateArrayItemField('education', index, 'startDate', e.target.value);
                }}
                value={edu.startDate}
              />
            </div>

            <div className="flex-1">
              <label htmlFor={`endDate-${index}`} className="block text-sm font-medium text-gray-300 mb-1">
                End Date
              </label>
              <input
                type="date"
                id={`endDate-${index}`}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                onChange={(e) => {
                  updateArrayItemField('education', index, 'endDate', e.target.value);
                }}
                value={edu.endDate}
              />
            </div>
          </div>
        </div>
      ))}

      <div className="mt-auto">
        <button
          onClick={() => addArrayItem('education', emptyEducation)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/40 text-blue-200 text-sm font-medium transition-all duration-200"
        >
          <span className="text-lg">+</span> Add Education
        </button>
      </div>
    </div>
  );
}

export default EducationForm;
