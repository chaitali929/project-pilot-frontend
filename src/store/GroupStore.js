import { create } from 'zustand';
import { groupAPI } from '../api';

const useGroupStore = create((set, get) => ({
  groups: [],
  currentGroup: null,
  users: [],
  isLoading: false,
  error: null,

  createGroup: async (groupData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await groupAPI.createGroup(groupData);
      set({ isLoading: false });
      get().fetchGroups(); // Refresh groups list
      return { success: true, group: response.data.group };
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to create group', isLoading: false });
      return { success: false, error: error.response?.data?.error };
    }
  },

  fetchGroups: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await groupAPI.getGroups();
      set({ groups: response.data.groups, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to fetch groups', isLoading: false });
    }
  },

  fetchGroupById: async (groupId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await groupAPI.getGroupById(groupId);
      set({ currentGroup: response.data.group, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to fetch group', isLoading: false });
    }
  },

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await groupAPI.getUsers();
      set({ users: response.data.users, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to fetch users', isLoading: false });
    }
  },

  inviteUsers: async (groupId, userIds) => {
    set({ isLoading: true, error: null });
    try {
      await groupAPI.inviteUsers(groupId, userIds);
      set({ isLoading: false });
      get().fetchGroupById(groupId); // Refresh current group
      return { success: true };
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to send invitations', isLoading: false });
      return { success: false, error: error.response?.data?.error };
    }
  },

  joinGroup: async (groupId) => {
    set({ isLoading: true, error: null });
    try {
      await groupAPI.joinGroup(groupId);
      set({ isLoading: false });
      get().fetchGroups(); // Refresh groups list
      return { success: true };
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to send join request', isLoading: false });
      return { success: false, error: error.response?.data?.error };
    }
  },

  respondToInvite: async (groupId, response) => {
    set({ isLoading: true, error: null });
    try {
      await groupAPI.respondToInvite(groupId, response);
      set({ isLoading: false });
      get().fetchGroups(); // Refresh groups list
      return { success: true };
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to respond to invitation', isLoading: false });
      return { success: false, error: error.response?.data?.error };
    }
  },

  removeMember: async (groupId, userId) => {
    set({ isLoading: true, error: null });
    try {
      await groupAPI.removeMember(groupId, userId);
      set({ isLoading: false });
      get().fetchGroups();
      return { success: true };
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to remove member', isLoading: false });
      return { success: false, error: error.response?.data?.error };
    }
  },

  deleteGroup: async (groupId) => {
    set({ isLoading: true, error: null });
    try {
      await groupAPI.deleteGroup(groupId);
      set({ isLoading: false });
      get().fetchGroups();
      return { success: true };
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to delete group', isLoading: false });
      return { success: false, error: error.response?.data?.error };
    }
  },

  leaveGroup: async (groupId) => {
    set({ isLoading: true, error: null });
    try {
      await groupAPI.leaveGroup(groupId);
      set({ isLoading: false });
      get().fetchGroups();
      return { success: true };
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to leave group', isLoading: false });
      return { success: false, error: error.response?.data?.error };
    }
  },

  respondToJoinRequest: async (groupId, response, userId) => {
    set({ isLoading: true, error: null });
    try {
      await groupAPI.respondToJoinRequest(groupId, response, userId);
      set({ isLoading: false });
      get().fetchGroups(); // Refresh groups list
      return { success: true };
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to respond to join request', isLoading: false });
      return { success: false, error: error.response?.data?.error };
    }
  },

  clearError: () => set({ error: null }),
  clearCurrentGroup: () => set({ currentGroup: null }),
}));

export default useGroupStore;