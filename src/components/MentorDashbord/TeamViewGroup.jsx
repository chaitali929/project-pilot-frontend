import React, { useState, useEffect } from 'react';
import { ProjectApprovalModal } from './ViewDoc';
import useMentorStore from '../../store/mentorStore';

const ProjectModal = ({ isOpen, onClose, team }) => {
  const { topics, fetchTopicsByGroup, isLoading } = useMentorStore();
  const [showViewDoc, setShowViewDoc] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  
  useEffect(() => {
    if (isOpen && team?.id) {
      fetchTopicsByGroup(team.id);
    }
  }, [isOpen, team?.id, fetchTopicsByGroup]);
  
  if (!isOpen || !team) return null;
  
  const { name: teamName, id: teamId } = team;

  const handleProjectClick = (topic) => {
    setSelectedProject(topic);
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
          {isLoading ? (
            <div className="py-16 text-center text-gray-400">
              <p>Loading topics...</p>
            </div>
          ) : topics.length > 0 ? (
            topics.map((topic) => (
              <div 
                key={topic._id} 
                className="py-6 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50 transition-colors rounded-lg px-4"
                onClick={() => handleProjectClick(topic)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">{topic.projectTitle}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    topic.status === 'accepted' ? 'bg-green-100 text-green-700' :
                    topic.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {topic.status}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mb-2">{topic.description}</p>
                <span className="inline-block px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-md">
                  {topic.projectCategory}
                </span>
              </div>
            ))
          ) : (
            <div className="py-16 text-center text-gray-400">
              <p className="text-lg font-medium">No topics submitted yet</p>
              <p className="text-sm">This team hasn't submitted any project topics.</p>
            </div>
          )}
        </div>
      </div>
      
      {showViewDoc && selectedProject && (
        <ProjectApprovalModal 
          isOpen={showViewDoc}
          onClose={handleCloseViewDoc}
          teamName={teamName}
          topic={selectedProject}
        />
      )}
    </div>
  );
};

export default ProjectModal;