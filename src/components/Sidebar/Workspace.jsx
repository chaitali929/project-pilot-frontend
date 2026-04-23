// src/pages/Workspace.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import { useNavigate } from "react-router-dom";
import useWorkspaceStore from "../../store/workspaceStore";
import useGroupStore from "../../store/groupStore";

const Workspace = () => {
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    type: 'blank',
    gitUrl: ''
  });
  const navigate = useNavigate();
  
  const { workspaces, loading, error, createWorkspace, getGroupWorkspaces, uploadFiles, clearError } = useWorkspaceStore();
  const { groups, fetchGroups } = useGroupStore();

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    if (groups.length > 0) {
      // Clear any previous errors
      clearError();
      
      // Fetch workspaces from the first group with timeout
      const firstGroupId = groups[0]._id;
      console.log('Fetching workspaces for group:', firstGroupId);
      
      const fetchWithTimeout = async () => {
        try {
          await getGroupWorkspaces(firstGroupId);
        } catch (err) {
          console.error('Failed to fetch workspaces:', err);
        }
      };
      
      fetchWithTimeout();
    }
  }, [groups]);

  const validateGitUrl = (url) => {
    const gitUrlPattern = /^https:\/\/github\.com\/[\w\-\.]+\/[\w\-\.]+(?:\.git)?$/;
    return gitUrlPattern.test(url);
  };

  const handleCreateWorkspace = async () => {
    if (!projectData.name.trim()) {
      alert('Please enter a project name');
      return;
    }

    if (projectData.type === 'git' && !validateGitUrl(projectData.gitUrl)) {
      alert('Please enter a valid GitHub URL (e.g., https://github.com/user/repo)');
      return;
    }

    if (projectData.type === 'upload' && !projectData.files?.length) {
      alert('Please select files to upload');
      return;
    }

    if (groups.length === 0) {
      alert('Please join a group first');
      return;
    }

    const result = await createWorkspace({
      name: projectData.name,
      description: projectData.description,
      type: projectData.type,
      gitUrl: projectData.type === 'git' ? projectData.gitUrl : undefined,
      groupId: groups[0]._id
    });

    if (result.success) {
      // If upload type, upload files after workspace creation
      if (projectData.type === 'upload' && projectData.files?.length) {
        await uploadFiles(result.workspace._id, projectData.files);
      }
      
      // Navigate to workspace view
      navigate(`/StudentDashboard/Workspace/view/${result.workspace._id}`);
    }
  };

  // Remove auto-redirect - let user choose which workspace to open
  // useEffect(() => {
  //   if (workspaces.length > 0 && !showCreateProject) {
  //     navigate(`/StudentDashboard/Workspace/view/${workspaces[0]._id}`);
  //   }
  // }, [workspaces, showCreateProject]);

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
                <h2 className="text-lg font-semibold items-center mb-4">Workspace</h2>
                <div className="grid gap-6 ">
                  <div className="bg-white w-full rounded-xl border p-6 shadow-sm hover:shadow-md transition text-center">
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
                  {/* <div className="bg-white rounded-xl border p-6 shadow-sm hover:shadow-md transition">
                    <p className="text-gray-600 mb-2">
                      Drag & drop your folder here or click to browse
                    </p>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                      Open Folder
                    </button>
                  </div> */}
                </div>
              </section>

              {/* History Section */}
              <section className="mt-10">
                <h2 className="text-lg font-semibold mb-4">Recent Workspaces</h2>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading your workspaces...</p>
                    <p className="text-xs text-gray-400 mt-2">This may take a few seconds</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <p className="text-red-600 font-medium mb-2">Failed to load workspaces</p>
                      <p className="text-red-500 text-sm mb-4">{error}</p>
                      <div className="space-x-2">
                        <button 
                          onClick={() => {
                            clearError();
                            if (groups.length > 0) {
                              getGroupWorkspaces(groups[0]._id);
                            }
                          }}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                          Retry
                        </button>
                        <button 
                          onClick={() => {
                            console.log('Debug info:');
                            console.log('Groups:', groups);
                            console.log('Token:', localStorage.getItem('token') ? 'Present' : 'Missing');
                            console.log('API Base URL:', import.meta.env.VITE_API_URL || 'http://localhost:3000');
                          }}
                          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                        >
                          Debug Info
                        </button>
                      </div>
                    </div>
                  </div>
                ) : workspaces.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No workspaces created yet
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {workspaces.map((workspace) => (
                      <div
                        key={workspace._id}
                        onClick={() => navigate(`/StudentDashboard/Workspace/view/${workspace._id}`)}
                        className="bg-white rounded-xl border p-6 shadow-sm hover:shadow-md transition cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{workspace.name}</h3>
                          <span className={`px-2 py-1 text-xs rounded ${
                            workspace.status === 'ready' ? 'bg-green-100 text-green-700' :
                            workspace.status === 'cloning' ? 'bg-blue-100 text-blue-700' :
                            workspace.status === 'error' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {workspace.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          {workspace.description || 'No description'}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {workspace.type === 'git' ? 'Git Repository' :
                             workspace.type === 'upload' ? 'Uploaded Files' : 'Blank Project'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {workspace.files?.length || 0} files
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          ) : (
            /* Create Project Form UI */
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
                    value={projectData.name}
                    onChange={(e) => setProjectData({...projectData, name: e.target.value})}
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
                    value={projectData.description}
                    onChange={(e) => setProjectData({...projectData, description: e.target.value})}
                    placeholder="Describe your project"
                    className="w-full border rounded-lg p-3"
                  />
                  <p className="text-xs text-gray-400 text-right">{projectData.description.length}/500</p>
                </div>

                {/* Project Type */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Project Type
                  </label>
                  <select 
                    value={projectData.type}
                    onChange={(e) => setProjectData({...projectData, type: e.target.value})}
                    className="w-full border rounded-lg p-3"
                  >
                    <option value="blank">Blank Project</option>
                    <option value="git">From Git Repository</option>
                    <option value="upload">Upload Files</option>
                  </select>
                </div>

                {/* Git URL Input */}
                {projectData.type === 'git' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      GitHub Repository URL
                    </label>
                    <input
                      type="url"
                      value={projectData.gitUrl}
                      onChange={(e) => setProjectData({...projectData, gitUrl: e.target.value})}
                      placeholder="https://github.com/username/repository"
                      className="w-full border rounded-lg p-3"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter a valid GitHub repository URL
                    </p>
                  </div>
                )}

                {/* File Upload */}
                {projectData.type === 'upload' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Upload Project Files
                    </label>
                    <input
                      type="file"
                      multiple
                      webkitdirectory=""
                      onChange={(e) => setProjectData({...projectData, files: e.target.files})}
                      className="w-full border rounded-lg p-3"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Select a folder to upload all files
                    </p>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex justify-between">
                  <button
                    onClick={() => setShowCreateProject(false)}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                 <button
                  onClick={handleCreateWorkspace}
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Project'}
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