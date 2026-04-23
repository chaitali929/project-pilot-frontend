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

export const coordinatorAPI = {
  getGroups: () => api.get('/api/coordinator/groups'),
  getMentors: () => api.get('/api/coordinator/mentors'),
  assignMentors:(groupId,mentorId)=>api.post('/api/coordinator/assign-mentor',{groupId,mentorId}),
  removeGroup:(groupId)=>api.post(`/api/coordinator/remove-group/${groupId}`),
  getStats: () => api.get('/api/coordinator/stats'),
  getStudents: () => api.get('/api/coordinator/students'),
  postTopic: (topicData) => api.post('/api/topics/post-topic', topicData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getTopics: (groupId) => api.get(`/api/topics/${groupId}`),
  respondToTopic: (topicId, status, mentorFeedback) => api.post(`/api/topics/respond/${topicId}`, {status, mentorFeedback}),
  postReport: (reportData) => api.post('/api/reports/submit-report', reportData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  addReportVersion: (reportId, formData) => api.post(`/api/reports/add-version/${reportId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getReports: (groupId) => api.get(`/api/reports/${groupId}`),
  respondToReport: (reportId, status, mentorFeedback) => api.post(`/api/reports/respond/${reportId}`, {status, mentorFeedback}),
  // Admin routes
  adminGetUsers: () => api.get('/api/coordinator/admin/users'),
  adminChangeRole: (userId, role) => api.patch(`/api/coordinator/admin/users/${userId}/role`, { role }),
  adminDeleteUser: (userId) => api.delete(`/api/coordinator/admin/users/${userId}`),
  adminGetGroups: () => api.get('/api/coordinator/admin/groups'),
  adminChangeMentor: (groupId, mentorId) => api.patch(`/api/coordinator/admin/groups/${groupId}/mentor`, { mentorId }),
  adminDeleteGroup: (groupId) => api.delete(`/api/coordinator/admin/groups/${groupId}`),
  adminRemoveMember: (groupId, userId) => api.delete(`/api/coordinator/admin/groups/${groupId}/members/${userId}`),
  adminGetTopics: () => api.get('/api/coordinator/admin/topics'),
  adminUpdateTopicStatus: (topicId, status) => api.patch(`/api/coordinator/admin/topics/${topicId}/status`, { status }),
  adminGetReports: () => api.get('/api/coordinator/admin/reports'),
};


export const mentorAPI = {
  getStats: () => api.get('/api/mentor/stats'),
  getGroups: () => api.get('/api/mentor/groups'),
  getTopics: () => api.get('/api/mentor/topics'),
  getTopicsByGroup: (groupId) => api.get(`/api/mentor/topics/group/${groupId}`),
  respondToTopic: (topicId, status, mentorFeedback) => api.post(`/api/topics/respond/${topicId}`, {status, mentorFeedback}),
  getReports: () => api.get('/api/mentor/reports'),
  getReportsByGroup: (groupId) => api.get(`/api/mentor/reports/group/${groupId}`),
  respondToReport: (reportId, status, mentorFeedback) => api.post(`/api/reports/respond/${reportId}`, {status, mentorFeedback}),
  markReportViewed: (reportId) => api.post(`/api/mentor/reports/mark-viewed/${reportId}`),
  getDiaries: () => api.get('/api/mentor/diaries'),
  getDiary: (diaryId) => api.get(`/api/mentor/diaries/${diaryId}`),
  submitDiaryFeedback: (diaryId, mentorFeedback, grade) => api.post(`/api/mentor/diaries/feedback/${diaryId}`, {mentorFeedback, grade}),
};

export const TopicAPI = {
  postTopic:(topicData)=>api.post('/api/topics/post-topic',topicData),
  getTopics:(mentorId)=>api.get(`/api/mentor/topics/${mentorId}`),
};

export const chatAPI = {
  sendMessage: (message, history, workspaceContext, documentContext) =>
    api.post('/api/chat/chat', { message, history, workspaceContext, documentContext }),
  getWorkspaces: () => api.get('/api/chat/workspaces'),
  getWorkspaceContext: (workspaceId) => api.get(`/api/chat/workspace-context/${workspaceId}`),
  uploadDoc: (file) => {
    const form = new FormData();
    form.append('file', file);
    return api.post('/api/chat/upload-doc', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
};

export const notificationAPI = {
  getStudentNotifications: () => api.get('/api/notifications/student'),
  getMentorNotifications: () => api.get('/api/notifications/mentor'),
};

export default api;