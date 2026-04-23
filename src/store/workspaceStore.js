import { create } from 'zustand';
import { workspaceAPI } from '../api';
import api from '../api';

const useWorkspaceStore = create((set, get) => ({
  workspaces: [],
  currentWorkspace: null,
  loading: false,
  error: null,

  createWorkspace: async (workspaceData) => {
    set({ loading: true, error: null });
    try {
      const response = await workspaceAPI.createWorkspace(workspaceData);
      set(state => ({ 
        workspaces: [response.data.workspace, ...state.workspaces], 
        loading: false 
      }));
      return { success: true, workspace: response.data.workspace };
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to create workspace', loading: false });
      return { success: false, error: error.response?.data?.error };
    }
  },

  uploadFiles: async (workspaceId, files) => {
    set({ loading: true, error: null });
    try {
      const response = await workspaceAPI.uploadFiles(workspaceId, files);
      set(state => ({
        workspaces: state.workspaces.map(w => 
          w._id === workspaceId ? response.data.workspace : w
        ),
        currentWorkspace: response.data.workspace,
        loading: false
      }));
      return { success: true, workspace: response.data.workspace };
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to upload files', loading: false });
      return { success: false, error: error.response?.data?.error };
    }
  },

  getGroupWorkspaces: async (groupId) => {
    set({ loading: true, error: null });
    try {
      const response = await workspaceAPI.getGroupWorkspaces(groupId);
      set({ workspaces: response.data.workspaces, loading: false });
      return response.data.workspaces;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch workspaces';
      set({ error: errorMessage, loading: false, workspaces: [] });
      throw error;
    }
  },

  getAllGroupWorkspaces: async (groupIds) => {
    set({ loading: true, error: null });
    try {
      const allWorkspaces = [];
      for (const groupId of groupIds) {
        const response = await workspaceAPI.getGroupWorkspaces(groupId);
        allWorkspaces.push(...response.data.workspaces);
      }
      set({ workspaces: allWorkspaces, loading: false });
      return allWorkspaces;
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to fetch workspaces', loading: false });
      throw error;
    }
  },

  getWorkspaceById: async (workspaceId) => {
    set({ loading: true, error: null });
    try {
      const response = await workspaceAPI.getWorkspaceById(workspaceId);
      const workspace = response.data.workspace;
      set({ currentWorkspace: workspace, loading: false });
      
      if (workspace.status === 'ready') {
        get().loadWorkspaceFiles(workspaceId);
      }
      
      return workspace;
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to fetch workspace', loading: false });
      throw error;
    }
  },

  loadWorkspaceFiles: async (workspaceId) => {
    try {
      const response = await workspaceAPI.getWorkspaceFiles(workspaceId);
      const files = response.data.files;
      
      set(state => ({
        currentWorkspace: {
          ...state.currentWorkspace,
          files: files || []
        }
      }));
      
      return files;
    } catch (error) {
      return [];
    }
  },

  refreshComments: async (workspaceId) => {
    try {
      const response = await workspaceAPI.getWorkspaceById(workspaceId);
      set(state => ({
        currentWorkspace: state.currentWorkspace ? {
          ...state.currentWorkspace,
          comments: response.data.workspace.comments
        } : response.data.workspace
      }));
      return response.data.workspace.comments;
    } catch (error) {
      // Silently fail to avoid disrupting the UI
      return null;
    }
  },

  addComment: async (workspaceId, message) => {
    try {
      const response = await workspaceAPI.addComment(workspaceId, message);
      // Update both currentWorkspace and workspaces array
      set(state => {
        const updatedWorkspace = response.data.workspace;
        return {
          currentWorkspace: updatedWorkspace,
          workspaces: state.workspaces.map(w => 
            w._id === workspaceId ? updatedWorkspace : w
          )
        };
      });
      return { success: true };
    } catch (error) {
      console.error('Add comment error:', error);
      set({ error: error.response?.data?.error || 'Failed to add comment' });
      return { success: false, error: error.response?.data?.error };
    }
  },

  deleteComment: async (workspaceId, commentId) => {
    try {
      const response = await workspaceAPI.deleteComment(workspaceId, commentId);
      set(state => {
        const updatedWorkspace = response.data.workspace;
        return {
          currentWorkspace: updatedWorkspace,
          workspaces: state.workspaces.map(w => 
            w._id === workspaceId ? updatedWorkspace : w
          )
        };
      });
      return { success: true };
    } catch (error) {
      console.error('Delete comment error:', error);
      set({ error: error.response?.data?.error || 'Failed to delete comment' });
      return { success: false, error: error.response?.data?.error };
    }
  },

  clearError: () => set({ error: null }),
  clearCurrentWorkspace: () => set({ currentWorkspace: null }),
  updateCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),
}));

export default useWorkspaceStore;