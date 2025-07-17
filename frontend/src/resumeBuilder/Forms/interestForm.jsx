import React, { useState } from 'react';
import { X } from 'lucide-react';
import useResumeStore from '../../stateManage/useResumeStore.js'

function InterestForm() {
  const {
    resumeData: { interest },
    updateArrayItemField,
    addArrayItem,
    removeArrayItem
  } = useResumeStore();

  const emptyInterest = {
    name:""
  }

  return (
    <div className="space-y-4 p-2 flex flex-col h-full">
      <div>
        <h2 className="text-xl font-semibold text-white mt-2 border-b border-white/10 pb-2">
          Interest
        </h2>
      </div>

      {interest.map((data, index) => (
        <div
          key={index}
          className="border border-white/10 rounded-lg p-4 space-y-4 bg-white/5 relative"
        >
          {interest.length > 1 && (
            <button
              onClick={() => removeArrayItem('interest', index)}
              className="absolute top-2 right-2 text-red-400 hover:text-red-600 cursor-pointer"
              title="Remove this interest"
            >
              <X size={18} />
            </button>
          )}

          <div className="flex-1">
            <label htmlFor={`interest-${index}`} className="block text-sm font-medium text-gray-300 mb-1">
              Interest
            </label>
            <input
              type="text"
              id={`degree-${index}`}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
              placeholder="React Developer Certificate"
              onChange={(e) => {
                updateArrayItemField('interest', index, 'name', e.target.value);
              }}
              value={data.name}
            />
          </div>

        </div>
      ))}

      <div className="mt-auto">
        <button
          onClick={() => addArrayItem('interest', emptyInterest)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/40 text-blue-200 text-sm font-medium transition-all duration-200"
        >
          <span className="text-lg">+</span> Add Interest
        </button>
      </div>
    </div>
  );
}

export default InterestForm;
