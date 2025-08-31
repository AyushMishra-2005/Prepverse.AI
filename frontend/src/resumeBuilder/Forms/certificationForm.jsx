import React, { useState } from 'react';
import { X } from 'lucide-react';
import useResumeStore from '../../stateManage/useResumeStore.js'

function CertificationForm() {
  const {
    resumeData: { certifications },
    updateArrayItemField,
    addArrayItem,
    removeArrayItem
  } = useResumeStore();

  const emptyCertification = {
    title: "",
    issuer: "",
    year: ""
  }

  return (
    <div className="space-y-4 p-2 flex flex-col h-full">
      <div>
        <h2 className="text-xl font-semibold text-white mt-2 border-b border-white/10 pb-2">
          Certification
        </h2>
      </div>

      {certifications.map((certification, index) => (
        <div
          key={index}
          className="border border-white/10 rounded-lg p-4 space-y-4 bg-white/5 relative"
        >
          {certifications.length > 1 && (
            <button
              onClick={() => removeArrayItem('certifications', index)}
              className="absolute top-2 right-2 text-red-400 hover:text-red-600 cursor-pointer"
              title="Remove this education"
            >
              <X size={18} />
            </button>
          )}

          <div className="flex-1">
            <label htmlFor={`title-${index}`} className="block text-sm font-medium text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              id={`degree-${index}`}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
              placeholder="React Developer Certificate"
              onChange={(e) => {
                updateArrayItemField('certifications', index, 'title', e.target.value);
              }}
              value={certification.title}
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor={`issuer-${index}`} className="block text-sm font-medium text-gray-300 mb-1">
                Issuer
              </label>
              <input
                type="text"
                id={`degree-${index}`}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                placeholder="Coursera"
                onChange={(e) => {
                  updateArrayItemField('certifications', index, 'issuer', e.target.value);
                }}
                value={certification.issuer}
              />
            </div>

            <div className="flex-1">
              <label htmlFor={`year-${index}`} className="block text-sm font-medium text-gray-300 mb-1">
                Issue Date
              </label>
              <input
                type="date"
                id={`year-${index}`}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                onChange={(e) => {
                  updateArrayItemField('certifications', index, 'year', e.target.value);
                }}
                value={certification.year}
              />
            </div>
          </div>
        </div>
      ))}

      <div className="mt-auto">
        <button
          onClick={() => addArrayItem('certifications', emptyCertification)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/40 text-blue-200 text-sm font-medium transition-all duration-200"
        >
          <span className="text-lg">+</span> Add Certification
        </button>
      </div>
    </div>
  );
}

export default CertificationForm;
