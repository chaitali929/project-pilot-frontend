import React, { useState, useEffect } from 'react';
import useUserStore from '../store/userStore';
import { authAPI } from '../api';

const CompleteProfile = () => {
  const [formData, setFormData] = useState({
    collegeName: '',
    department: ''
  });
  const { user, token, updateProfile, isLoading } = useUserStore();

  useEffect(() => {
    if (!token) {
      window.location.href = '/login';
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await updateProfile(formData);
    if (result.success) {
      window.location.href = '/onboarding1';
    }
  };

  if (!token) return null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-6">
        <div className="flex flex-col items-center">
          <img src="/logo.png" alt="ProjectPilot" className="w-16 h-16 mb-2" />
          <h1 className="text-xl font-bold text-gray-800">ProjectPilot</h1>
        </div>

        <h2 className="mt-6 text-2xl font-semibold text-center text-gray-900">
          Complete Your Profile
        </h2>
        
        <p className="mt-2 text-center text-gray-600">
          Please provide your college and department information
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">College Name</label>
            <input
              type="text"
              placeholder="Enter your college name"
              value={formData.collegeName}
              onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
              className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <input
              type="text"
              placeholder="Enter your department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading ? 'Updating...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;