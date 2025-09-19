// components/Sidebar/Notifications.jsx
import React, { useState } from "react";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import { MdClose } from "react-icons/md";

export default function Notifications() {
  const [activeTab, setActiveTab] = useState("All");

  const tabs = [
    { name: "All", count: 24 },
    { name: "Deadlines", count: 4 },
    { name: "Tasks", count: 12 },
    { name: "Commits", count: 4 },
    { name: "Mentor", count: 4 },
  ];

  const notifications = [
    {
      date: "Today",
      items: [
        {
          id: 1,
          icon: "📅",
          text: "Project Submission Due: Advanced UI/UX Design",
          time: "2 hours ago",
        },
        {
          id: 2,
          icon: "👩‍🏫",
          text: "Professor Williams left feedback on your Weekly Report",
          time: "4 hours ago",
        },
      ],
    },
    {
      date: "4 August 2025",
      items: [
        {
          id: 3,
          icon: "👨‍💻",
          text: "Anuj Dighe added new task in taskboard",
          time: "",
        },
      ],
    },
    {
      date: "1 August 2025",
      items: [
        {
          id: 4,
          icon: "🧑‍🔬",
          text: "New commit pushed to main branch by Om Waghmare",
          time: "",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <Topbar />

        {/* Tabs */}
        <div className="flex space-x-6 border-b px-6 bg-white">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`py-3 text-sm font-medium border-b-2 ${
                activeTab === tab.name
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.name} ({tab.count})
            </button>
          ))}
        </div>

        {/* Notifications list */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {notifications.map((section) => (
            <div key={section.date}>
              <h2 className="text-gray-500 text-sm font-medium mb-3">
                {section.date}
              </h2>
              <div className="space-y-3">
                {section.items.map((n) => (
                  <div
                    key={n.id}
                    className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-xl">
                        {n.icon}
                      </div>
                      <div>
                        <p className="text-gray-800">{n.text}</p>
                        {n.time && (
                          <p className="text-sm text-gray-500">{n.time}</p>
                        )}
                      </div>
                    </div>
                    <MdClose className="text-gray-400 cursor-pointer hover:text-red-500" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
