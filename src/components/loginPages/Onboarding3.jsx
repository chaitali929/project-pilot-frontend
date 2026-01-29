import React from "react";
import { useNavigate } from "react-router-dom";

const Onboarding3 = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      {/* Progress Steps */}
      <div className="flex items-center w-full max-w-sm mb-8">
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white z-10">
          1
        </div>
        <div className="flex-grow border-t-2 border-blue-600"></div>
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white z-10">
          2
        </div>
        <div className="flex-grow border-t-2 border-blue-600"></div>
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white z-10">
          3
        </div>
      </div>

      {/* Content */}
      <div className="text-center max-w-md">
        <div className="w-32 h-32 mx-auto mb-6 bg-purple-100 rounded-full flex items-center justify-center">
          <svg className="w-16 h-16 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Track Progress & Reports
        </h2>
        
        <p className="text-gray-600 mb-8">
          Monitor project milestones, generate reports, and keep track of deadlines to ensure successful project completion.
        </p>
      </div>

      <button 
        onClick={() => navigate('/StudentDashboard')}
        className="bg-blue-600 text-white py-3 px-8 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
      >
        Get Started
      </button>
    </div>
  );
};

export default Onboarding3;