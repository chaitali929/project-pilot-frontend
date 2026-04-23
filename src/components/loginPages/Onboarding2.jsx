import React from "react";
import { useNavigate } from "react-router-dom";

const Onboarding2 = () => {
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
        <div className="flex-grow border-t-2 border-gray-300"></div>
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300 text-gray-600 z-10">
          3
        </div>
      </div>

      {/* Content */}
      <div className="text-center max-w-md">
        <div className="w-32 h-32 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-16 h-16 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Team Collaboration
        </h2>
        
        <p className="text-gray-600 mb-8">
          Work seamlessly with your team members, share files, assign tasks, and communicate effectively on your projects.
        </p>
      </div>

      <button 
        onClick={() => navigate('/onboarding3')}
        className="bg-blue-600 text-white py-3 px-8 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
      >
        Continue
      </button>
    </div>
  );
};

export default Onboarding2;