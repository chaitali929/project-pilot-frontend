// src/pages/Workspace.jsx
import React, { useState } from "react";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import { useNavigate } from "react-router-dom";

const Workspace = () => {
  const [showCreateProject, setShowCreateProject] = useState(false);
    const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <Topbar />

        {/* Content Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          {!showCreateProject ? (
            <>
              {/* Workspace Section */}
              <section>
                <h2 className="text-lg font-semibold mb-4">Workspace</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl border p-6 shadow-sm hover:shadow-md transition">
                    <p className="text-gray-600 mb-2">Start Coding in editor</p>
                    <p className="text-sm text-gray-500 mb-4">
                      Create a folder and start your code
                    </p>
                    <button
                      onClick={() => setShowCreateProject(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                      Create New Project
                    </button>
                  </div>
                  <div className="bg-white rounded-xl border p-6 shadow-sm hover:shadow-md transition">
                    <p className="text-gray-600 mb-2">
                      Drag & drop your folder here or click to browse
                    </p>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                      Open Folder
                    </button>
                  </div>
                </div>
              </section>

              {/* History Section */}
              <section className="mt-10">
                <h2 className="text-lg font-semibold mb-4">History</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      title: "Project Pilot",
                      desc: "A streamlined mini project manager for students, mentors, and coordinators......",
                    },
                    {
                      title: "Women’s Safety",
                      desc: "A mobile app designed for quick access to security features for women with great UI ......",
                    },
                    {
                      title: "Women’s Safety",
                      desc: "A mobile app designed for quick access to security features for women with great UI ......",
                    },
                  ].map((project, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl border p-6 shadow-sm hover:shadow-md transition"
                    >
                      <h3 className="font-semibold">{project.title}</h3>
                      <p className="text-sm text-gray-600 mt-2">{project.desc}</p>
                      <div className="flex mt-3 -space-x-2">
                        <img
                          src="/images/profile1.jpg"
                          alt="Profile 1"
                          className="h-8 w-8 rounded-full border object-cover"
                        />
                        <img
                          src="/images/profile2.jpg"
                          alt="Profile 2"
                          className="h-8 w-8 rounded-full border object-cover"
                        />
                        <img
                          src="/images/profile3.jpg"
                          alt="Profile 3"
                          className="h-8 w-8 rounded-full border object-cover"
                        />
                        <img
                          src="/images/profile4.jpg"
                          alt="Profile 4"
                          className="h-8 w-8 rounded-full border object-cover"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          ) : (
            /* ✅ Create Project Form UI */
            <section className="flex justify-center items-center">
              <div className="bg-white w-full max-w-lg rounded-xl border p-8 shadow-md">
                <h2 className="text-2xl font-semibold mb-6 text-center">
                  Create a new Project
                </h2>

                {/* Project Title */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Project Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter project title"
                    className="w-full border rounded-lg p-3"
                  />
                </div>

                {/* Project Description */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Project Description
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Describe your project"
                    className="w-full border rounded-lg p-3"
                  ></textarea>
                  <p className="text-xs text-gray-400 text-right">0/500</p>
                </div>

                {/* Project Branch */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Project Branch
                  </label>
                  <select className="w-full border rounded-lg p-3">
                    <option>Main</option>
                  </select>
                </div>

                {/* Project Type */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">
                    Project Type
                  </label>
                  <select className="w-full border rounded-lg p-3">
                    <option>Personal</option>
                    <option>Team</option>
                  </select>
                </div>

                {/* Buttons */}
                <div className="flex justify-between">
                  <button
                    onClick={() => setShowCreateProject(false)}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                 <button
                  onClick={() => navigate("/StudentDashboard/Workspace/NewProject")} // 👈 redirect
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Create a New Project
                </button>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default Workspace;
