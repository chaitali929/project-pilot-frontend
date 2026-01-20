import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useUserStore from "../../store/userStore";
import { authAPI } from "../../api";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login, isLoading, error, clearError } = useUserStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData);
    if (result.success) {
      window.location.href = '/onboarding1';
    }
  };

  const handleOAuthLogin = (provider) => {
    const url = provider === 'google' ? authAPI.googleAuth() : authAPI.githubAuth();
    window.location.href = url;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md px-8 py-10">
        
        {/* Logo */}
        <div className="flex flex-col items-center">
          <img src="/logo.png" alt="ProjectPilot" className="w-16 h-16 mb-2" />
          <h1 className="text-xl font-bold text-gray-800">ProjectPilot</h1>
        </div>

        {/* Welcome Text */}
        <h2 className="mt-6 text-2xl font-semibold text-center text-gray-900">
          Welcome to ProjectPilot
        </h2>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
            <button onClick={clearError} className="float-right font-bold">×</button>
          </div>
        )}

        {/* Google Button */}
        <button 
          onClick={() => handleOAuthLogin('google')}
          className="flex items-center justify-center w-full px-4 py-2 mt-6 border border-black-300 rounded-md hover:bg-gray-100"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/4/4f/Google_%22G%22_Logo.svg"
            alt="Google"
            className="w-5 h-5 mr-2"
          />
          Google
        </button>

        {/* GitHub Button */}
        <button 
          onClick={() => handleOAuthLogin('github')}
          className="flex items-center justify-center w-full px-4 py-2 mt-3 border border-black-300 rounded-md hover:bg-gray-100"
        >
          <img
            src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
            alt="GitHub"
            className="w-5 h-5 mr-2"
          />
          GitHub
        </button>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-3 text-black-400 text-sm">Or</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        <form onSubmit={handleSubmit}>
        {/* Email Input */}
        <input
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-2 mb-4 border border-black-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        {/* Password Input */}
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-4 py-2 border border-black-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <span
            className="absolute right-3 top-3 cursor-pointer text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Login Button */}
        <button 
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isLoading ? 'Logging in...' : 'Log in'}
        </button>
        </form>

        {/* Forgot Password */}
        <p className="mt-3 text-sm text-center text-blue-500 cursor-pointer hover:underline">
          Forgot password?
        </p>

        {/* Signup Link */}
        <p className="mt-3 text-sm text-center text-gray-600">
          Don’t have an account yet?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Create one
          </Link>
        </p>

        {/* Footer Note */}
        <p className="mt-6 text-xs text-center text-gray-400">
          We use end-to-end encryption to protect your data 🔒
        </p>
      </div>
    </div>
  );
}
