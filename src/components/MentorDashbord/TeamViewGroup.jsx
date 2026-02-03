import React, { useState } from 'react';
import { ProjectApprovalModal } from './ViewDoc';

const PROJECTS_DATA = [
  {
    title: "ProjectPilot- Mini Project Manager",
    description: "ProjectPilot is a mini-project manager application designed for ease of project management and assessment"
  },
  {
    title: "BankTalk- Smart Banking application", 
    description: "Smart banking solution with AI-powered features for modern financial management"
  },
  {
    title: "PocketLaw- Ai powered legal chatbot",
    description: "AI-powered legal assistant providing instant legal advice and document analysis"
  },
  {
    title: "HealthTrack- Fitness Dashboard",
    description: "Comprehensive health and fitness tracking platform with personalized insights"
  }
];

const ProjectModal = ({ isOpen, onClose, team }) => {
  const [showViewDoc, setShowViewDoc] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  
  if (!isOpen || !team) return null;
  
  const { name: teamName, id: teamId } = team;

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setShowViewDoc(true);
  };

  const handleCloseViewDoc = () => {
    setShowViewDoc(false);
    setSelectedProject(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900">{teamName}</h2>
            <span className="text-gray-300 text-lg">•</span>
            <span className="text-gray-500 font-medium">#{teamId}</span>
          </div>
          
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </header>

        <div className="px-6 py-4 max-h-96 overflow-y-auto">
          {PROJECTS_DATA.map((project, index) => (
            <div 
              key={index} 
              className="py-6 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50 transition-colors rounded-lg px-4"
              onClick={() => handleProjectClick(project)}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">{project.title}</h3>
              <p className="text-gray-500 text-sm">{project.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      {showViewDoc && (
        <ProjectApprovalModal 
          isOpen={showViewDoc}
          onClose={handleCloseViewDoc}
          teamName={teamName}
          projectName={selectedProject?.title || ""}
          projectDescription={selectedProject?.description || ""}
        />
      )}
    </div>
  );
};

export default ProjectModal;