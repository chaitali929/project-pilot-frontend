import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../store/userStore';
import colleges from '../data/colleges';

const Onboarding = () => {
  const [formData, setFormData] = useState({
    collegeName: '',
    department: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { updateProfile, user } = useUserStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const result = await updateProfile(formData);
    if (result.success) {
      navigate('/onboarding2');
    }
    setIsLoading(false);
  };

  const handleCollegeChange = (e) => {
    setFormData({
      ...formData,
      collegeName: e.target.value,
      department: '' // Reset department when college changes
    });
  };

  const selectedCollege = colleges.find(college => college.name === formData.collegeName);
  const departments = selectedCollege ? selectedCollege.departments : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome!</h1>
          <p className="text-gray-600">Let's complete your profile to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              College Name *
            </label>
            <select
              value={formData.collegeName}
              onChange={handleCollegeChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select your college</option>
              {colleges.map((college) => (
                <option key={college.name} value={college.name}>
                  {college.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department *
            </label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={!formData.collegeName}
            >
              <option value="">Select your department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading || !formData.collegeName || !formData.department}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Saving...' : 'Continue to Dashboard'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Signed in as: <span className="font-medium">{user?.email}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;