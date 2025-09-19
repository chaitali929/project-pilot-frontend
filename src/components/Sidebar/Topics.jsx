// src/pages/Topics.jsx
import React from "react";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import { MdUploadFile } from "react-icons/md";

export default function Topics() {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* ✅ Sidebar */}
      <Sidebar />

      {/* ✅ Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* ✅ Topbar */}
        <Topbar />

        {/* ✅ Page Content */}
        <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-y-auto">
          {/* Left Section - Submit Topic Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Submit Your Topics</h2>
            <form className="space-y-5">
              {/* Project Title */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  placeholder="Enter project title"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Project Description */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Project Description
                </label>
                <textarea
                  placeholder="Describe your project"
                  rows="4"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              {/* Project Category */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Project Category
                </label>
                <select className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option>Select Category</option>
                  <option>Web Development</option>
                  <option>AI / ML</option>
                  <option>Cyber Security</option>
                  <option>Finance</option>
                </select>
              </div>

              {/* Attach File */}
              <div className="border-2 border-dashed p-6 rounded-lg flex flex-col items-center text-gray-500 cursor-pointer hover:bg-gray-50">
                <MdUploadFile className="text-3xl mb-2" />
                <p>Drag & drop your PDF here or click to browse</p>
                <p className="text-sm">Supported format: PDF (max 10MB)</p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
              >
                Submit Topic
              </button>
            </form>
          </div>

          {/* Right Section - Mentor’s Approval & Topics List */}
          <div className="space-y-6">
            {/* Mentor’s Approval */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Mentor’s Approval</h2>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Mentor’s Feedback</span>
                <span className="text-yellow-500 font-medium">● Pending</span>
              </div>
              <textarea
                placeholder="Mentor’s feedback..."
                rows="3"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            {/* Topics List */}
            <div className="bg-white rounded-2xl shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Topics</h2>
                <span className="text-sm text-gray-500">
                  Due Date: 21 August 2025
                </span>
              </div>

              {/* Topic Items */}
              <ul className="space-y-3">
                {[
                  {
                    name: "Event Management",
                    status: "Rejected",
                    img: "/images/event.png",
                  },
                  {
                    name: "Quick Legal ChatBot",
                    status: "Rejected",
                    img: "/images/chatbot.png",
                  },
                  {
                    name: "Banking and Finance",
                    status: "Rejected",
                    img: "/images/banking.png",
                  },
                  {
                    name: "PrePlacement Hub",
                    status: "Rejected",
                    img: "/images/hub.png",
                  },
                  {
                    name: "ProjectPilot",
                    status: "Accepted",
                    img: "/images/project.png",
                  },
                ].map((topic, i) => (
                  <li
                    key={i}
                    className="flex justify-between items-center p-3 border rounded-lg"
                  >
                    {/* Avatar + Name */}
                    <div className="flex items-center gap-3">
                      <img
                        src={topic.img}
                        alt={topic.name}
                        className="w-8 h-8 rounded-full border"
                      />
                      <span>{topic.name}</span>
                    </div>

                    {/* Status */}
                    <span
                      className={`font-medium ${
                        topic.status === "Accepted"
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {topic.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
