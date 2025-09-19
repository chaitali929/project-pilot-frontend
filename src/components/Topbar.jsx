import React from "react";

export default function Topbar() {
  return (
    <header className="border-b bg-white px-6 py-4.5 flex items-center justify-between">
      <div className="flex items-center gap-4 w-1/2">
        <div className="flex items-center bg-gray-50 border rounded px-3 py-2 w-full max-w-lg">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15z"
            />
          </svg>
          <input
            className="ml-2 bg-transparent outline-none text-sm"
            placeholder="Search for anything"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-600">Active</div>
        <div className="flex items-center gap-3">
          {/* profile image */}
          <img
            src="/images/anuj-dighe.jpg" // path to profile image
            alt="Anuj Dighe"
            className="w-10 h-10 rounded-full object-cover border border-gray-200"
          />
          <div className="text-sm">
            <div className="font-medium">Anuj Dighe</div>
            <div className="text-xs text-gray-500">Student</div>
          </div>
        </div>
      </div>
    </header>
  );
}
