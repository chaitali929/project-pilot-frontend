import React from "react";

const Onboarding3 = () => {
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
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white z-10">
          3
        </div>
      </div>

      {/* Heading */}
      <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
        Where do you study or teach?
      </h2>

      {/* Form Fields */}
      <div className="w-full max-w-md space-y-6">
        {/* College Name */}
        <div>
          <label className="block text-gray-800 font-medium mb-1">
            College Name
          </label>
          <input
            type="text"
            placeholder="Search your college name"
            className="w-full border rounded-lg px-4 py-2"
          />
          <p className="text-sm text-blue-600 mt-1 cursor-pointer">
            Can’t find your college?
          </p>
        </div>

        {/* Department */}
        <div>
          <label className="block text-gray-800 font-medium mb-1">
            Department
          </label>
          <select className="w-full border rounded-lg px-4 py-2">
            <option>Select your department</option>
          </select>
        </div>
      </div>

      {/* Continue Button */}
      <button className="mt-8 bg-blue-600 text-white py-2 px-12 rounded-lg text-lg font-medium hover:bg-blue-700 transition">
        Continue
      </button>
    </div>
  );
};

export default Onboarding3;
