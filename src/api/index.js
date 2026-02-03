import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  signup: (userData) => api.post('/auth/signup', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  getProfile: () => api.get('/auth/profile'),
  googleAuth: () => `${API_BASE_URL}/auth/google?prompt=select_account`,
  githubAuth: () => `${API_BASE_URL}/auth/github`,
};

export const groupAPI = {
  createGroup: (groupData) => api.post('/api/groups/CreateGroups', groupData),
  inviteUsers: (groupId, userIds) => api.post(`/api/groups/invite/${groupId}`, { userIds }),
  respondToInvite: (groupId, response) => api.post(`/api/groups/respond/${groupId}`, { response }),
  respondToJoinRequest: (groupId, response, userId) => api.post(`/api/groups/respond-request/${groupId}`, { response, userId }),
  joinGroup: (groupId) => api.post(`/api/groups/join/${groupId}`),
  leaveGroup: (groupId) => api.post(`/api/groups/leave/${groupId}`),
  removeMember: (groupId, userId) => api.post(`/api/groups/remove-member/${groupId}`, { userId }),
  deleteGroup: (groupId) => api.delete(`/api/groups/${groupId}`),
  getUsers: () => api.get('/api/groups/users'),
  getGroups: () => api.get('/api/groups/my-groups'),
  getAllGroups: () => api.get('/api/groups'),
  getGroupById: (groupId) => api.get(`/api/groups/${groupId}`),
};

export const taskAPI = {
  createTask: (taskData) => api.post('/api/tasks/CreateTask', taskData),
  getGroupTasks: (groupId) => api.get(`/api/tasks/group/${groupId}`),
  inviteAssignees: (taskId, userIds) => api.post(`/api/tasks/invite/${taskId}`, { userIds }),
  updateTaskStatus: (taskId, status) => api.patch(`/api/tasks/status/${taskId}`, { status }),
};

export const workspaceAPI = {
  createWorkspace: (workspaceData) => api.post('/api/workspaces/create', workspaceData),
  uploadFiles: (workspaceId, files) => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    return api.post(`/api/workspaces/upload/${workspaceId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000 // 2 minutes for file uploads
    });
  },
  addComment: (workspaceId, message) => api.post(`/api/workspaces/${workspaceId}/comments`, { message }),
  deleteComment: (workspaceId, commentId) => api.delete(`/api/workspaces/${workspaceId}/comments/${commentId}`),
  getGroupWorkspaces: (groupId) => api.get(`/api/workspaces/group/${groupId}`),
  getWorkspaceById: (workspaceId) => api.get(`/api/workspaces/${workspaceId}`),
  getWorkspaceFiles: (workspaceId) => api.get(`/api/workspaces/${workspaceId}/files`),
  retryClone: (workspaceId) => api.post(`/api/workspaces/${workspaceId}/retry-clone`),
};

export default api;