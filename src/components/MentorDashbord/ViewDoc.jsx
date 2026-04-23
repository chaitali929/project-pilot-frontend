import React, { useState, useEffect, useCallback } from 'react';
import useMentorStore from '../../store/mentorStore';

export const ProjectApprovalModal = ({
  isOpen,
  onClose,
  teamName = "Team Alpha",
  topic
}) => {
  const { respondToTopic, fetchTopicsByGroup } = useMentorStore();
  const [feedback, setFeedback] = useState("");
  const [needsAttention, setNeedsAttention] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (topic) {
      setFeedback(topic.mentorFeedback || "");
      setNeedsAttention(topic.status === 'rejected');
    }
  }, [topic]);

  const handleApprove = async () => {
    if (!topic) return;
    setIsSubmitting(true);
    try {
      const status = needsAttention ? 'rejected' : 'accepted';
      await respondToTopic(topic._id, status, feedback);
      await fetchTopicsByGroup(topic.groupId);
      onClose();
    } catch (error) {
      console.error('Failed to approve topic:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewDocument = () => {
    if (topic?.abstract) {
      window.open(`http://localhost:3000/uploads/abstracts/${topic.abstract}`, '_blank');
    }
  };

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape' && onClose) onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !topic) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10">
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300" 
        onClick={onClose}
      />

      <div className="relative z-20 w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[650px]">
        
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-gray-400 hover:text-gray-600 transition-colors z-30 p-2 hover:bg-gray-100 rounded-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <div className="w-full md:w-[42%] bg-[#F1F3F6] p-6 md:p-10 flex flex-col border-r border-gray-100">
          {topic?.abstract ? (
            topic.abstract.endsWith('.pdf') ? (
              <iframe
                src={`http://localhost:3000/uploads/abstracts/${topic.abstract}`}
                className="w-full flex-1 rounded-2xl shadow-xl"
                title="PDF Preview"
              />
            ) : (
              <div className="w-full flex-1 flex flex-col items-center justify-center bg-white rounded-2xl shadow-xl p-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-4">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <p className="text-gray-600 font-medium mb-2">DOCX Document</p>
                <p className="text-sm text-gray-500 mb-6 text-center">Click below to download and view</p>
                <a
                  href={`http://localhost:3000/uploads/abstracts/${topic.abstract}`}
                  download
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                  Download Document
                </a>
              </div>
            )
          ) : (
            <div className="w-full bg-white rounded-2xl shadow-xl p-6 relative aspect-[3/4.2] overflow-hidden">
              <p className="text-center text-gray-500">No document available</p>
            </div>
          )}
        </div>

        <div className="w-full md:w-[58%] p-8 md:p-12 flex flex-col">
          <div className="flex-grow">
            <header className="mb-10">
              <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest rounded-full mb-4">
                Reviewing Submission
              </span>
              <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">
                {topic.projectTitle}
              </h1>
              <p className="text-gray-500 text-base leading-relaxed max-w-lg">
                {topic.description}
              </p>
            </header>

            <div className="space-y-8">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">
                  Feedback for Team
                </label>
                <div className="relative group">
                  <textarea 
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value.slice(0, 500))}
                    className="w-full min-h-[200px] p-6 bg-gray-50 border border-gray-100 rounded-[2rem] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white text-gray-800 placeholder-gray-400 transition-all outline-none resize-none text-base" 
                    placeholder="Provide specific feedback or requested changes..."
                  />
                  <div className="absolute bottom-5 right-6 text-[10px] font-bold text-gray-400 bg-white px-2 py-1 rounded-md">
                    {feedback.length} / 500
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-5 border border-gray-100 rounded-3xl bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${needsAttention ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-400'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Flag for Revision</p>
                    <p className="text-xs text-gray-500">Student must address feedback before approval</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={needsAttention}
                    onChange={() => setNeedsAttention(!needsAttention)}
                    className="sr-only peer" 
                  />
                  <div className="w-14 h-7 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[20px] after:w-[20px] after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="mt-12 flex gap-4">
            <button 
              onClick={handleApprove}
              disabled={isSubmitting}
              className="flex-grow bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 px-8 rounded-3xl transition-all active:scale-[0.98] shadow-xl shadow-blue-500/20 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : needsAttention ? 'Request Revision' : 'Approve Project Topic'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectApprovalModal;