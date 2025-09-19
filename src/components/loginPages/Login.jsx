import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

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

        {/* Google Button */}
        <button className="flex items-center justify-center w-full px-4 py-2 mt-6 border border-black-300 rounded-md hover:bg-gray-100">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/4/4f/Google_%22G%22_Logo.svg"
            alt="Google"
            className="w-5 h-5 mr-2"
          />
          Google
        </button>

        {/* GitHub Button */}
        <button className="flex items-center justify-center w-full px-4 py-2 mt-3 border border-black-300 rounded-md hover:bg-gray-100">
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

        {/* Email Input */}
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full px-4 py-2 mb-4 border border-black-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Password Input */}
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="w-full px-4 py-2 border border-black-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span
            className="absolute right-3 top-3 cursor-pointer text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Login Button */}
        <button className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
          Log in
        </button>

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
