import React from "react";
import { useNavigate } from "react-router-dom";

const Onboarding2 = () => {
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
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white z-10">
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
      <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
        Cool! What should we call you?
      </h2>

      {/* Form Fields */}
      <div className="w-full max-w-md space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-gray-800 font-medium mb-1">
            Full Name
          </label>
          <input
            type="text"
            placeholder="Enter your full name"
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {/* Mobile Number */}
        <div>
          <label className="block text-gray-800 font-medium mb-1">
            Mobile Number <span className="text-gray-500 text-sm">(optional)</span>
          </label>
          <input
            type="text"
            placeholder="Enter your Mobile number"
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {/* Username */}
        <div>
          <label className="block text-gray-800 font-medium mb-1">
            Username
          </label>
          <input
            type="text"
            placeholder="Enter your Username"
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>
      </div>

      {/* Next Button */}
      <button
        onClick={() => navigate("/onboarding3")}
        className="mt-8 bg-blue-600 text-white py-2 px-12 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
      >
        Next
      </button>
    </div>
  );
};

export default Onboarding2;
