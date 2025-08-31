import React, { useState } from 'react';
import RatingInput from '../ratingInput.jsx';
import { X } from 'lucide-react';
import useResumeStore from '../../stateManage/useResumeStore.js'

function SkillInfoForm() {
  const {
    resumeData: { skills, languages },
    updateArrayItemField,
    addArrayItem,
    removeArrayItem
  } = useResumeStore();

  const emptySkill = {
    name: "",
    progress: 0
  }

  const emptyLanguage = {
    name: "",
    progress: 0
  }

  const handleRatingChangeSkill = (index, newValue) => {
    updateArrayItemField('skills', index, 'progress', newValue);
  };

  const handleRatingChangeLanguages = (index, newValue) => {
    updateArrayItemField('languages', index, 'progress', newValue);
  };


  return (
    <div className="space-y-4 p-4 flex flex-col h-full">
      <div>
        <h2 className="text-xl font-semibold text-white border-b border-white/10 pb-2">
          Skills & Languages
        </h2>
      </div>

      {skills.map((skill, index) => (
        <div
          key={index}
          className="relative border border-white/10 rounded-lg p-6 space-y-4 bg-white/5"
        >
          {skills.length > 1 && (
            <button
              onClick={() => removeArrayItem('skills', index)}
              className="absolute top-2 right-2 text-red-400 hover:text-red-600"
              title="Remove this skill"
            >
              <X size={18} />
            </button>
          )}

          <div className="flex flex-col md:flex-row gap-6 md:items-center">
            <div className="flex-1">
              <label htmlFor={`skillName-${index}`} className="block text-sm font-medium text-gray-300 mb-1">
                Skill Name
              </label>
              <input
                type="text"
                id={`skillName-${index}`}
                className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-lg 
                         text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                         focus:ring-blue-500/50 focus:border-transparent transition-all"
                placeholder="TypeScript"
                onChange={(e) => {
                  updateArrayItemField('skills', index, 'name', e.target.value);
                }}
                value={skill.name}
              />
            </div>


            <div className="flex-1">
              <label htmlFor={`skillRating-${index}`} className="block text-sm font-medium text-gray-300 mb-1">
                Rating: {(skill.progress || 0) / 20}/5
              </label>
              <div className="w-full h-12 flex items-center">
                <RatingInput
                  value={skill.progress}
                  onChange={(newValue) => handleRatingChangeSkill(index, newValue)}
                />
              </div>
            </div>
          </div>
        </div>
      ))}



      <div className="mt-auto">
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/40 text-blue-200 text-sm font-medium transition-all duration-200"
          onClick={() => addArrayItem('skills', emptySkill)}
        >
          <span className="text-lg">+</span> Add Skill
        </button>
      </div>

      {languages.map((language, index) => (
        <div
          key={index}
          className="relative border border-white/10 rounded-lg p-6 space-y-4 bg-white/5"
        >
          {languages.length > 1 && (
            <button
              onClick={() => removeArrayItem('languages', index)}
              className="absolute top-2 right-2 text-red-400 hover:text-red-600"
              title="Remove this language"
            >
              <X size={18} />
            </button>
          )}

          <div className="flex flex-col md:flex-row gap-6 md:items-center">
            <div className="flex-1">
              <label htmlFor={`language-${index}`} className="block text-sm font-medium text-gray-300 mb-1">
                Language
              </label>
              <input
                type="text"
                id={`language-${index}`}
                className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-lg 
                         text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                         focus:ring-blue-500/50 focus:border-transparent transition-all"
                placeholder="TypeScript"
                onChange={(e) => {
                  updateArrayItemField('languages', index, 'name', e.target.value);
                }}
                value={language.name}
              />
            </div>


            <div className="flex-1">
              <label htmlFor={`languageRating-${index}`} className="block text-sm font-medium text-gray-300 mb-1">
                Rating: {(language.progress || 0) / 20}/5
              </label>
              <div className="w-full h-12 flex items-center">
                <RatingInput
                  value={language.progress}
                  onChange={(newValue) => handleRatingChangeLanguages(index, newValue)}
                />
              </div>
            </div>
          </div>
        </div>
      ))}



      <div className="mt-auto">
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/40 text-blue-200 text-sm font-medium transition-all duration-200"
          onClick={() => addArrayItem('languages', emptyLanguage)}
        >
          <span className="text-lg">+</span> Add Language
        </button>
      </div>
    </div>
  );
}

export default SkillInfoForm;
