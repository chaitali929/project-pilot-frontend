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
  createGroup: (groupData) => api.post('/groups/CreateGroups', groupData),
  inviteUsers: (groupId, userIds) => api.post(`/groups/invite/${groupId}`, { userIds }),
  respondToInvite: (groupId, response) => api.post(`/groups/respond/${groupId}`, { response }),
  respondToJoinRequest: (groupId, response, userId) => api.post(`/groups/respond-request/${groupId}`, { response, userId }),
  joinGroup: (groupId) => api.post(`/groups/join/${groupId}`),
  leaveGroup: (groupId) => api.post(`/groups/leave/${groupId}`),
  removeMember: (groupId, userId) => api.post(`/groups/remove-member/${groupId}`, { userId }),
  deleteGroup: (groupId) => api.delete(`/groups/${groupId}`),
  getUsers: () => api.get('/groups/users'),
  getGroups: () => api.get('/groups'),
  getGroupById: (groupId) => api.get(`/groups/${groupId}`),
};

export default api;