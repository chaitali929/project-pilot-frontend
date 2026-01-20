import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useUserStore from "../store/userStore";
import { authAPI } from "../api";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    collegeName: '',
    department: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();
  const { signup, isLoading, error, clearError } = useUserStore();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    const { confirmPassword, ...signupData } = formData;
    const result = await signup(signupData);
    if (result.success) {
      navigate("/onboarding1");
    }
  };

  const handleOAuthLogin = (provider) => {
    const url = provider === 'google' ? authAPI.googleAuth() : authAPI.githubAuth();
    window.location.href = url;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-6">
        {/* Logo */}
        <div className="flex flex-col items-center">
          <img src="/assets/logo.png" alt="ProjectPilot Logo" className="w-12 h-12 mb-2" />
          <h1 className="text-2xl font-bold">ProjectPilot</h1>
        </div>

        {/* Title */}
        <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
          Welcome to ProjectPilot
        </h2>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
            <button onClick={clearError} className="float-right font-bold">×</button>
          </div>
        )}

        {/* Social Login */}
        <div className="mt-6 space-y-3">
          <button 
            onClick={() => handleOAuthLogin('google')}
            className="w-full flex items-center justify-center border rounded-md py-2 text-gray-700 hover:bg-gray-50"
          >
            <img src="/assets/google-icon.png" alt="Google" className="w-5 h-5 mr-2" />
            Google
          </button>
          <button 
            onClick={() => handleOAuthLogin('github')}
            className="w-full flex items-center justify-center border rounded-md py-2 text-gray-700 hover:bg-gray-50"
          >
            <img src="/assets/github-icon.png" alt="GitHub" className="w-5 h-5 mr-2" />
            GitHub
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-3 text-sm text-gray-500">Or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-4">
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

          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
              required
            >
              <option value="student">Student</option>
              <option value="mentor">Mentor</option>
              <option value="coordinator">Coordinator</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300 pr-10"
                required
              />
              <span
                className="absolute right-3 top-3 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300 pr-10"
                required
              />
              <span
                className="absolute right-3 top-3 cursor-pointer text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* Sign up button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading ? 'Signing up...' : 'Sign up'}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>

        <p className="mt-2 text-center text-xs text-gray-400">
          We use end-to-end encryption to protect your data 🔒
        </p>
      </div>
    </div>
  );
};

export default Signup;
