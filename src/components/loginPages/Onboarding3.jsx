import React, { useState } from "react";
import useUserStore from "../../store/userStore";
import { authAPI } from "../../api";

const Onboarding3 = () => {
  const [formData, setFormData] = useState({
    collegeName: '',
    department: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useUserStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.collegeName || !formData.department) {
      alert('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await authAPI.updateProfile(formData);
      window.location.href = '/StudentDashboard';
    } catch (error) {
      alert('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };
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
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
        {/* College Name */}
        <div>
          <label className="block text-gray-800 font-medium mb-1">
            College Name
          </label>
          <input
            type="text"
            placeholder="Search your college name"
            value={formData.collegeName}
            onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
            className="w-full border rounded-lg px-4 py-2"
            required
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
          <input
            type="text"
            placeholder="Enter your department"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            className="w-full border rounded-lg px-4 py-2"
            required
          />
        </div>
      </form>

      {/* Continue Button */}
      <button 
        onClick={handleSubmit}
        disabled={isLoading}
        className="mt-8 bg-blue-600 text-white py-2 px-12 rounded-lg text-lg font-medium hover:bg-blue-700 transition disabled:bg-gray-400"
      >
        {isLoading ? 'Saving...' : 'Continue'}
      </button>
    </div>
  );
};

export default Onboarding3;
