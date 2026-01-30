import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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

export default api;