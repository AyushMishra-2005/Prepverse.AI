import React, { useState } from 'react';
import { X } from 'lucide-react';
import useResumeStore from '../../stateManage/useResumeStore.js'

function ProjectDetailsForm() {
  const {
    resumeData: { projects },
    updateArrayItemField,
    addArrayItem,
    removeArrayItem
  } = useResumeStore();

  const emptyProject = {
    title: "",
    description: "",
    github: "",
    liveDemo: ""
  };

  return (
    <div className="space-y-2 p-2 flex flex-col h-full">
      <div>
        <h2 className="text-xl font-semibold text-white mt-2 border-b border-white/10 pb-2">
          Projects
        </h2>
      </div>

      {projects.map((project, index) => (
        <div
          key={index}
          className="relative border border-white/10 rounded-lg p-4 space-y-4 bg-white/5"
        >

          {projects.length > 1 && (
            <button
              onClick={() => removeArrayItem('projects', index)}
              className="absolute top-2 right-2 text-red-400 hover:text-red-600"
              title="Remove this project"
            >
              <X size={18} />
            </button>
          )}


          <div className="flex-1">
            <label htmlFor={`projectTitle-${index}`} className="block text-sm font-medium text-gray-300 mb-1">
              Project Title
            </label>
            <input
              type="text"
              id={`projectTitle-${index}`}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg 
                         text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                         focus:ring-blue-500/50 focus:border-transparent transition-all"
              placeholder="AIspire"
              onChange={(e) => {
                updateArrayItemField('projects', index, 'title', e.target.value);
              }}
              value={project.title}
            />
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
              placeholder="Short description about the project"
              onChange={(e) => {
                updateArrayItemField('projects', index, 'description', e.target.value);
              }}
              value={project.description}
            />
          </div>


          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor={`githubLink-${index}`} className="block text-sm font-medium text-gray-300 mb-1">
                GitHub Link
              </label>
              <input
                type="text"
                id={`githubLink-${index}`}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg 
                           text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                           focus:ring-blue-500/50 focus:border-transparent transition-all"
                placeholder="https://github.com/username/project"
                onChange={(e) => {
                  updateArrayItemField('projects', index, 'github', e.target.value);
                }}
                value={project.github}
              />
            </div>

            <div className="flex-1">
              <label htmlFor={`demoUrl-${index}`} className="block text-sm font-medium text-gray-300 mb-1">
                Live Demo URL
              </label>
              <input
                type="text"
                id={`demoUrl-${index}`}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg 
                           text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                           focus:ring-blue-500/50 focus:border-transparent transition-all"
                placeholder="https://yourwebsite.com"
                onChange={(e) => {
                  updateArrayItemField('projects', index, 'liveDemo', e.target.value);
                }}
                value={project.liveDemo}
              />
            </div>
          </div>
        </div>
      ))}


      <div className="mt-auto">
        <button
          onClick={() => addArrayItem('projects', emptyProject)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/40 text-blue-200 text-sm font-medium transition-all duration-200"
        >
          <span className="text-lg">+</span> Add Project
        </button>
      </div>
    </div>
  );
}

export default ProjectDetailsForm;
