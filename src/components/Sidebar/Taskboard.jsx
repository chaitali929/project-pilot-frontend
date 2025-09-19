import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";

const columns = [
  {
    title: "To Do",
    count: 2,
    color: "bg-yellow-400",
    tasks: [
      {
        title: "Implement User Authentication",
        description: "Set up Auth2 authentication flow with Google and GitHub",
        priority: "High",
        priorityColor: "bg-red-500",
        tag: "Feature",
        tagColor: "bg-blue-500",
        avatars: ["👩‍💻", "🧑‍💻", "👨‍💻"],
        date: "Aug 10",
      },
      {
        title: "Design System Updates",
        description: "Update component library with new design tokens",
        priority: "Medium",
        priorityColor: "bg-orange-500",
        tag: "UI",
        tagColor: "bg-purple-500",
        avatars: ["👩‍💻"],
        date: "Aug 10",
      },
    ],
  },
  {
    title: "In Progress",
    count: 1,
    color: "bg-blue-400",
    tasks: [
      {
        title: "API Integration",
        description: "Connect frontend with backend API endpoints",
        priority: "High",
        priorityColor: "bg-red-500",
        tag: "Feature",
        tagColor: "bg-blue-500",
        avatars: ["👩‍💻", "🧑‍💻"],
        date: "Aug 20",
      },
    ],
  },
  {
    title: "Completed",
    count: 1,
    color: "bg-green-400",
    tasks: [
      {
        title: "User Profile Page",
        description: "Create responsive dashboard layout",
        priority: "Medium",
        priorityColor: "bg-orange-500",
        tag: "UI",
        tagColor: "bg-purple-500",
        avatars: ["👩‍💻"],
        date: "Aug 20",
      },
    ],
  },
  {
    title: "On Hold",
    count: 1,
    color: "bg-red-400",
    tasks: [
      {
        title: "Payment Gateway",
        description: "Integrate payment processing system",
        priority: "High",
        priorityColor: "bg-red-500",
        tag: "Feature",
        tagColor: "bg-blue-500",
        avatars: ["👩‍💻", "🧑‍💻"],
        date: "Aug 20",
      },
    ],
  },
];

export default function Taskboard() {
  const [showModal, setShowModal] = useState(false);
  const [taskHeading, setTaskHeading] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskType, setTaskType] = useState("");
  const [taskDifficulty, setTaskDifficulty] = useState("");

  const handleAddTask = () => {
    if (taskHeading && taskDescription && taskType && taskDifficulty) {
      setShowModal(false);
    } else {
      alert("Please fill all fields before adding the task!");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        <main className="p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold">Task board</h1>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <Plus size={18} /> New Task
              </button>
            </div>

            {/* Kanban Board */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {columns.map((col) => (
                <div
                  key={col.title}
                  className="flex flex-col rounded-[1.25rem] overflow-hidden shadow"
                >
                  {/* Column Header */}
                  <div
                    className={`flex items-center justify-between px-4 py-2 text-white ${col.color}`}
                  >
                    <span className="font-semibold">
                      {col.title} ({col.count})
                    </span>
                    <button className="text-white hover:opacity-80">⋮</button>
                  </div>

                  {/* Tasks */}
                  <div className="bg-gray-50 p-3 space-y-4">
                    {col.tasks.map((task, idx) => (
                      <div
                        key={idx}
                        className="bg-white rounded-[1.25rem] p-4 shadow hover:shadow-md transition"
                      >
                        <h3 className="font-medium">{task.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {task.description}
                        </p>

                        {/* Tags */}
                        <div className="flex gap-2 mt-3">
                          <span
                            className={`text-white text-xs px-2 py-1 rounded ${task.priorityColor}`}
                          >
                            {task.priority}
                          </span>
                          <span
                            className={`text-white text-xs px-2 py-1 rounded ${task.tagColor}`}
                          >
                            {task.tag}
                          </span>
                        </div>

                        {/* Avatars & Date */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex -space-x-2">
                            {task.avatars.map((avatar, i) => (
                              <div
                                key={i}
                                className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-lg"
                              >
                                {avatar}
                              </div>
                            ))}
                          </div>
                          <span className="text-xs text-gray-400">
                            {task.date}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

    {/* Modal */}
{showModal && (
  <div
    className="fixed inset-0 flex items-center justify-center z-50"
    onClick={() => setShowModal(false)} // Close when background clicked
  >
    <div
      className="bg-white rounded-[1.25rem] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.15)] w-full max-w-lg"
      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
    >
      <h2 className="text-xl font-semibold mb-4">Create New Task</h2>

      {/* Task Heading */}
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Task Heading
      </label>
      <input
        type="text"
        placeholder="Enter task heading"
        className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Small Description */}
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Small Description
      </label>
      <textarea
        placeholder="Describe your task"
        className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Task Type */}
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Task Type
      </label>
      <select className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option>Select task type</option>
      </select>

      {/* Task Difficulty */}
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Task Difficulty
      </label>
      <select className="w-full border rounded-lg px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option>Select task difficulty</option>
      </select>

      {/* Assignee */}
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Assignee
      </label>
      <div className="flex gap-2 mb-6">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">👩‍💻</div>
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">🧑‍💻</div>
        <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center">+</button>
      </div>

      {/* Button with shadow */}
      <button
        className="w-full bg-blue-600 text-white py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
        onClick={() => setShowModal(false)} // Close after submit
      >
        Add New Task
      </button>
    </div>
  </div>
)}

    </div>
  );
}
