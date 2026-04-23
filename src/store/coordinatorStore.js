import { create } from 'zustand';
import api, { coordinatorAPI } from '../api';

const useCoordinatorStore = create((set, get) => ({
  groupsByYear: { SE: [], TE: [], BE: [] },
  mentors: [],
  students: [],
  stats: null,
  // admin
  adminUsers: [],
  adminGroups: [],
  adminTopics: [],
  adminReports: [],
  isLoading: false,
  error: null,

  fetchGroups: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/api/coordinator/groups');
      set({ groupsByYear: response.data.groupsByYear, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to fetch groups', isLoading: false });
    }
  },

  fetchStats: async () => {
    try {
      const res = await coordinatorAPI.getStats();
      set({ stats: res.data });
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to fetch stats' });
    }
  },

  fetchStudents: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await coordinatorAPI.getStudents();
      set({ students: res.data.students, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to fetch students', isLoading: false });
    }
  },

  assignMentor: async (groupId, mentorId) => {
    set({ isLoading: true, error: null });
    try {
      await coordinatorAPI.assignMentors(groupId, mentorId);
      get().fetchGroups();
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to assign mentor', isLoading: false });
    }
  },

  removeGroup: async (groupId) => {
    set({ isLoading: true, error: null });
    try {
      await coordinatorAPI.removeGroup(groupId);
      get().fetchGroups();
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to remove group', isLoading: false });
    }
  },

  fetchMentors: async () => {
    try {
      const response = await coordinatorAPI.getMentors();
      set({ mentors: response.data.mentors });
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to fetch mentors' });
    }
  },

  // ── Admin actions ──────────────────────────────────────────────────────────

  fetchAdminUsers: async () => {
    set({ isLoading: true });
    try {
      const res = await coordinatorAPI.adminGetUsers();
      set({ adminUsers: res.data.users, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to fetch users', isLoading: false });
    }
  },

  changeUserRole: async (userId, role) => {
    try {
      await coordinatorAPI.adminChangeRole(userId, role);
      set(s => ({ adminUsers: s.adminUsers.map(u => u._id === userId ? { ...u, role } : u) }));
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to change role' });
    }
  },

  deleteUser: async (userId) => {
    try {
      await coordinatorAPI.adminDeleteUser(userId);
      set(s => ({ adminUsers: s.adminUsers.filter(u => u._id !== userId) }));
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to delete user' });
    }
  },

  fetchAdminGroups: async () => {
    set({ isLoading: true });
    try {
      const res = await coordinatorAPI.adminGetGroups();
      set({ adminGroups: res.data.groups, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to fetch groups', isLoading: false });
    }
  },

  adminChangeMentor: async (groupId, mentorId) => {
    try {
      await coordinatorAPI.adminChangeMentor(groupId, mentorId);
      get().fetchAdminGroups();
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to change mentor' });
    }
  },

  adminDeleteGroup: async (groupId) => {
    try {
      await coordinatorAPI.adminDeleteGroup(groupId);
      set(s => ({ adminGroups: s.adminGroups.filter(g => g._id !== groupId) }));
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to delete group' });
    }
  },

  adminRemoveMember: async (groupId, userId) => {
    try {
      await coordinatorAPI.adminRemoveMember(groupId, userId);
      get().fetchAdminGroups();
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to remove member' });
    }
  },

  fetchAdminTopics: async () => {
    set({ isLoading: true });
    try {
      const res = await coordinatorAPI.adminGetTopics();
      set({ adminTopics: res.data.topics, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to fetch topics', isLoading: false });
    }
  },

  adminUpdateTopicStatus: async (topicId, status) => {
    try {
      await coordinatorAPI.adminUpdateTopicStatus(topicId, status);
      set(s => ({ adminTopics: s.adminTopics.map(t => t._id === topicId ? { ...t, status } : t) }));
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to update topic' });
    }
  },

  fetchAdminReports: async () => {
    set({ isLoading: true });
    try {
      const res = await coordinatorAPI.adminGetReports();
      set({ adminReports: res.data.reports, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to fetch reports', isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));

export default useCoordinatorStore;
