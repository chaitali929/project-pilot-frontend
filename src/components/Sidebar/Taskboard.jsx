import React, { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import useTaskStore from "../../store/taskStore";
import useGroupStore from "../../store/groupStore";

const getStatusColor = (status) => {
  switch (status) {
    case 'pending': return 'bg-yellow-400';
    case 'accepted': return 'bg-blue-400';
    case 'rejected': return 'bg-red-400';
    default: return 'bg-gray-400';
  }
};

const getDifficultyColor = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case 'high': return 'bg-red-500';
    case 'medium': return 'bg-orange-500';
    case 'low': return 'bg-green-500';
    default: return 'bg-gray-500';
  }
};

const getTypeColor = (type) => {
  switch (type?.toLowerCase()) {
    case 'feature': return 'bg-blue-500';
    case 'bug': return 'bg-red-500';
    case 'ui': return 'bg-purple-500';
    default: return 'bg-gray-500';
  }
};

export default function Taskboard() {
  const [showModal, setShowModal] = useState(false);
  const [taskHeading, setTaskHeading] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskType, setTaskType] = useState("");
  const [taskDifficulty, setTaskDifficulty] = useState("");
  const [selectedAssignees, setSelectedAssignees] = useState([]);
  const [showDropdown, setShowDropdown] = useState(null);

  const navigate = useNavigate();
  const { tasks, loading, createTask, getGroupTasks, updateTaskStatus } = useTaskStore();
  const { groups, fetchGroups, currentGroup, fetchGroupById, isLoading } = useGroupStore();

  useEffect(() => {
    fetchGroups();
  }, []);

  // Debug groups and currentGroup
  useEffect(() => {
    console.log('Groups loaded:', groups);
    console.log('Groups length:', groups.length);
    console.log('Current group:', currentGroup);
    console.log('Current group members:', currentGroup?.members);
  }, [groups, currentGroup]);

  // Auto-select first group if available
  useEffect(() => {
    if (groups.length > 0) {
      const firstGroup = groups[0];
      getGroupTasks(firstGroup._id);
      fetchGroupById(firstGroup._id);
    }
  }, [groups]);

  const handleAddTask = async () => {
    if (taskHeading && taskDescription && taskType && taskDifficulty) {
      try {
        const assignees = selectedAssignees.map(userId => ({
          userId
        }));
        
        await createTask({
          heading: taskHeading,
          description: taskDescription,
          type: taskType,
          difficulty: taskDifficulty,
          assignes: assignees
        });
        setShowModal(false);
        setTaskHeading("");
        setTaskDescription("");
        setTaskType("");
        setTaskDifficulty("");
        setSelectedAssignees([]);
      } catch (error) {
        alert("Failed to create task");
      }
    } else {
      alert("Please fill all fields before adding the task!");
    }
  };

  const toggleAssignee = (userId) => {
    setSelectedAssignees(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleStatusUpdate = async (taskId, status) => {
    try {
      await updateTaskStatus(taskId, status);
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const organizeTasksByStatus = () => {
    const columns = [
      { title: "To-Do", status: "To-Do", color: "bg-yellow-400" },
      { title: "In Progress", status: "In Progress", color: "bg-blue-400" },
      { title: "On Hold", status: "On Hold", color: "bg-red-400" },
      { title: "Completed", status: "Completed", color: "bg-green-400" }
    ];

    return columns.map(col => ({
      ...col,
      tasks: tasks.filter(task => task.status === col.status),
      count: tasks.filter(task => task.status === col.status).length
    }));
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
            </div>

            {/* No Groups Message */}
            {isLoading ? (
              <div className="text-center py-8">Loading groups...</div>
            ) : groups.length === 0 ? (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <h2 className="text-xl text-gray-600 mb-4">Join the group to access the taskboard</h2>
                  <button
                    onClick={() => navigate('/StudentDashboard/Groups')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Go to Groups
                  </button>
                </div>
              </div>
            ) : loading ? (
              <div className="text-center py-8">Loading tasks...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {organizeTasksByStatus().map((col) => (
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
                    </div>

                    {/* Tasks */}
                    <div className="bg-gray-50 p-3 space-y-4" style={{ minHeight: col.count > 0 ? 'auto' : '100px' }}>
                      {col.tasks.map((task) => (
                        <div
                          key={task._id}
                          className="bg-white rounded-[1.25rem] p-4 shadow hover:shadow-md transition relative"
                        >
                          {/* Three dots menu */}
                          <div className="absolute top-3 right-3">
                            <button
                              onClick={() => setShowDropdown(showDropdown === task._id ? null : task._id)}
                              className="text-gray-400 hover:text-gray-600 p-1"
                            >
                              ⋮
                            </button>
                            {showDropdown === task._id && (
                              <div className="absolute right-0 mt-1 bg-white border rounded-lg shadow-lg z-10 min-w-[120px]">
                                <button
                                  onClick={() => {
                                    handleStatusUpdate(task._id, 'To-Do');
                                    setShowDropdown(null);
                                  }}
                                  className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                                >
                                  To-Do
                                </button>
                                <button
                                  onClick={() => {
                                    handleStatusUpdate(task._id, 'In Progress');
                                    setShowDropdown(null);
                                  }}
                                  className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                                >
                                  In Progress
                                </button>
                                <button
                                  onClick={() => {
                                    handleStatusUpdate(task._id, 'On Hold');
                                    setShowDropdown(null);
                                  }}
                                  className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                                >
                                  On Hold
                                </button>
                                <button
                                  onClick={() => {
                                    handleStatusUpdate(task._id, 'Completed');
                                    setShowDropdown(null);
                                  }}
                                  className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                                >
                                  Completed
                                </button>
                              </div>
                            )}
                          </div>

                          <h3 className="font-medium pr-8">{task.heading}</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {task.description}
                          </p>

                          {/* Tags */}
                          <div className="flex gap-2 mt-3">
                            <span
                              className={`text-white text-xs px-2 py-1 rounded ${getDifficultyColor(task.difficulty)}`}
                            >
                              {task.difficulty}
                            </span>
                            <span
                              className={`text-white text-xs px-2 py-1 rounded ${getTypeColor(task.type)}`}
                            >
                              {task.type}
                            </span>
                          </div>

                          {/* Assignees & Date */}
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex -space-x-2">
                              {task.assignes?.slice(0, 3).map((assignee, i) => {
                                console.log('Assignee data:', assignee);
                                return (
                                  <div
                                    key={i}
                                    className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs"
                                  >
                                    {assignee.userId?.name?.[0] || assignee.userId?.email?.[0] || '?'}
                                  </div>
                                );
                              })}
                            </div>
                            <span className="text-xs text-gray-400">
                              {new Date(task.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Create Task Button - Fixed at bottom */}
            {groups.length > 0 && (
              <div className="fixed bottom-6 right-6">
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
                >
                  <Plus size={20} /> New Task
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

    {/* Modal */}
{showModal && (
  <div
    className="fixed inset-0 flex items-center justify-center z-50"
    onClick={() => setShowModal(false)}
  >
    <div
      className="bg-white rounded-[1.25rem] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.15)] w-full max-w-lg"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-xl font-semibold mb-4">Create New Task</h2>

      {/* Task Heading */}
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Task Heading
      </label>
      <input
        type="text"
        value={taskHeading}
        onChange={(e) => setTaskHeading(e.target.value)}
        placeholder="Enter task heading"
        className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Small Description */}
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Small Description
      </label>
      <textarea
        value={taskDescription}
        onChange={(e) => setTaskDescription(e.target.value)}
        placeholder="Describe your task"
        className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Task Type */}
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Task Type
      </label>
      <select 
        value={taskType}
        onChange={(e) => setTaskType(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select task type</option>
        <option value="feature">Feature</option>
        <option value="bug">Bug</option>
        <option value="ui">UI</option>
        <option value="testing">Testing</option>
      </select>

      {/* Task Difficulty */}
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Task Difficulty
      </label>
      <select 
        value={taskDifficulty}
        onChange={(e) => setTaskDifficulty(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select task difficulty</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      {/* Assignees */}
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Assignees
      </label>
      <div className="max-h-32 overflow-y-auto border rounded-lg p-2 mb-6">
        {currentGroup?.members?.filter(member => member.status === 'accepted').map((member) => (
          <div key={member.userId._id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
            <input
              type="checkbox"
              checked={selectedAssignees.includes(member.userId._id)}
              onChange={() => toggleAssignee(member.userId._id)}
              className="rounded"
            />
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">
              {member.userId.name?.[0] || member.userId.email?.[0] || '?'}
            </div>
            <span className="text-sm">{member.userId.name || member.userId.email}</span>
          </div>
        )) || (
          <p className="text-gray-500 text-sm">No members available</p>
        )}
      </div>

      {/* Button with shadow */}
      <button
        className="w-full bg-blue-600 text-white py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
        onClick={handleAddTask}
      >
        Add New Task
      </button>
    </div>
  </div>
)}

    </div>
  );
}