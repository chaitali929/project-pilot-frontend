import { create } from 'zustand';
import { taskAPI } from '../api';

const useTaskStore = create((set, get) => ({
  tasks: [],
  loading: false,
  error: null,

  // Create task
  createTask: async (taskData) => {
    set({ loading: true, error: null });
    try {
      const response = await taskAPI.createTask(taskData);
      set(state => ({ 
        tasks: [...state.tasks, response.data.task], 
        loading: false 
      }));
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to create task', loading: false });
      throw error;
    }
  },

  // Get group tasks
  getGroupTasks: async (groupId) => {
    set({ loading: true, error: null });
    try {
      const response = await taskAPI.getGroupTasks(groupId);
      set({ tasks: response.data.tasks, loading: false });
      return response.data.tasks;
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to fetch tasks', loading: false });
      throw error;
    }
  },

  // Invite assignees
  inviteAssignees: async (taskId, userIds) => {
    try {
      const response = await taskAPI.inviteAssignees(taskId, userIds);
      set(state => ({
        tasks: state.tasks.map(task => 
          task._id === taskId ? response.data.task : task
        )
      }));
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to invite assignees' });
      throw error;
    }
  },

  // Update task status
  updateTaskStatus: async (taskId, status) => {
    try {
      const response = await taskAPI.updateTaskStatus(taskId, status);
      set(state => ({
        tasks: state.tasks.map(task => 
          task._id === taskId ? response.data.task : task
        )
      }));
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to update status' });
      throw error;
    }
  },

  clearError: () => set({ error: null })
}));

export default useTaskStore;