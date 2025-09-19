import React from "react";
import { useNavigate } from "react-router-dom";

const Onboarding1 = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      {/* Progress Steps */}
      <div className="flex items-center w-full max-w-sm mb-8">
        {/* Step 1 */}
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white z-10">
          1
        </div>

        {/* Line */}
        <div className="flex-grow border-t-2 border-gray-300"></div>

        {/* Step 2 */}
        <div className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-400 text-gray-500 z-10">
          2
        </div>

        {/* Line */}
        <div className="flex-grow border-t-2 border-gray-300"></div>

        {/* Step 3 */}
        <div className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-400 text-gray-500 z-10">
          3
        </div>
      </div>

      {/* Heading */}
      <h2 className="text-xl font-semibold text-gray-800 mb-2 text-center">
        Let’s set up your space. Who are you joining as?
      </h2>

      {/* Role Selection */}
      <div className="grid grid-cols-3 gap-4 mt-6 w-full max-w-md">
        <button className="flex flex-col items-center border rounded-lg p-6 hover:shadow-lg transition">
          <img src="/assets/student-icon.png" alt="Student" className="w-8 h-8 mb-2" />
          <span className="text-gray-800 font-medium">Student</span>
        </button>

        <button className="flex flex-col items-center border rounded-lg p-6 hover:shadow-lg transition">
          <img src="/assets/professor-icon.png" alt="Professor" className="w-8 h-8 mb-2" />
          <span className="text-gray-800 font-medium">Professor</span>
        </button>

        <button className="flex flex-col items-center border rounded-lg p-6 hover:shadow-lg transition">
          <img src="/assets/solo-icon.png" alt="Solo" className="w-8 h-8 mb-2" />
          <span className="text-gray-800 font-medium">Solo</span>
        </button>
      </div>

      {/* Next Button */}
      <button
        onClick={() => navigate("/onboarding2")}
        className="mt-8 bg-blue-600 text-white py-2 px-12 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
      >
        Next
      </button>

      {/* Footer */}
      <p className="mt-4 text-xs text-gray-400 text-center">
        We use end-to-end encryption to protect your data 🔒
      </p>
    </div>
  );
};

export default Onboarding1;
