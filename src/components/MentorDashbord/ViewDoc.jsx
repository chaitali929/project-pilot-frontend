import React, { useState, useEffect, useCallback } from 'react';

export const ProjectApprovalModal = ({
  isOpen,
  onClose,
  teamName = "Team Alpha",
  projectName = "ProjectPilot- Mini Project Manager",
  projectDescription = "ProjectPilot is a mini-project manager application designed for ease of project management and assessment."
}) => {
  const [feedback, setFeedback] = useState("");
  const [needsAttention, setNeedsAttention] = useState(false);

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

  if (!isOpen) return null;

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

        <div className="w-full md:w-[42%] bg-[#F1F3F6] p-6 md:p-10 flex flex-col items-center justify-center border-r border-gray-100">
          <div className="w-full bg-white rounded-2xl shadow-xl p-6 relative aspect-[3/4.2] overflow-hidden transform hover:scale-[1.02] transition-transform duration-500">
            <div className="flex items-center justify-between mb-6 border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {teamName} • Mid-term
                </span>
              </div>
            </div>

            <div className="space-y-5">
              <div className="h-5 w-3/4 bg-gray-100 rounded-md"></div>
              <div className="flex gap-2">
                <div className="h-7 w-20 bg-blue-50 border border-blue-100 rounded-lg"></div>
                <div className="h-7 w-16 bg-blue-50 border border-blue-100 rounded-lg"></div>
              </div>
              <div className="space-y-3 pt-2">
                <div className="h-2 w-full bg-gray-50 rounded-full"></div>
                <div className="h-2 w-full bg-gray-50 rounded-full"></div>
                <div className="h-2 w-4/5 bg-gray-50 rounded-full"></div>
              </div>
              
              <div className="flex items-center justify-center pt-10">
                <div className="relative w-28 h-28 rounded-full border-[12px] border-gray-50 border-t-blue-500 border-r-blue-500 transform -rotate-45">
                  <div className="absolute inset-0 flex items-center justify-center rotate-45">
                    <div className="w-3 h-3 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
          </div>

          <button className="w-full mt-8 py-4 px-6 border border-gray-200 bg-white rounded-2xl text-sm font-bold text-gray-700 hover:shadow-md hover:border-gray-300 transition-all active:scale-95 flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            View Full Document
          </button>
        </div>

        <div className="w-full md:w-[58%] p-8 md:p-12 flex flex-col">
          <div className="flex-grow">
            <header className="mb-10">
              <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest rounded-full mb-4">
                Reviewing Submission
              </span>
              <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">
                {projectName}
              </h1>
              <p className="text-gray-500 text-base leading-relaxed max-w-lg">
                {projectDescription}
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
              onClick={() => { console.log("Approved", { feedback, needsAttention }); onClose(); }}
              className="flex-grow bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 px-8 rounded-3xl transition-all active:scale-[0.98] shadow-xl shadow-blue-500/20 text-lg"
            >
              Approve Project Topic
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectApprovalModal;