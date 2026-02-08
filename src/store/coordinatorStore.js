import { create } from 'zustand';
import api, { coordinatorAPI } from '../api';

const useCoordinatorStore = create((set, get) => ({
  groupsByYear: {
    SE: [],
    TE: [],
    BE: []
  },
  mentors: [],
  isLoading: false,
  error: null,

  fetchGroups: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/api/coordinator/groups');
      set({ 
        groupsByYear: response.data.groupsByYear,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error.response?.data?.error || 'Failed to fetch groups',
        isLoading: false 
      });
    }
  },

  assignMentor: async (groupId, mentorId) => {
    set({ isLoading: true, error: null });
    try {
      await coordinatorAPI.assignMentors(groupId, mentorId);
      get().fetchGroups();
    } catch (error) {
      set({ 
        error: error.response?.data?.error || 'Failed to assign mentor',
        isLoading: false 
      });
    }
  },


  removeGroup: async (groupId) => {
    set({ isLoading: true, error: null });
    try {
      await coordinatorAPI.removeGroup(groupId);
      get().fetchGroups();
    } catch (error) {
      set({ 
        error: error.response?.data?.error || 'Failed to remove group',
        isLoading: false 
      });
    }
  },

  fetchMentors: async () => {
    try {
      const response = await coordinatorAPI.getMentors();
      set({ mentors: response.data.mentors });
    } catch (error) {
      set({ 
        error: error.response?.data?.error || 'Failed to fetch mentors'
      });
    }
  },

  clearError: () => set({ error: null }),
}));



export default useCoordinatorStore;