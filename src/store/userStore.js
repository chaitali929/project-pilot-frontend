import { create } from 'zustand';
import { authAPI } from '../api';

const useUserStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,

  signup: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.signup(userData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      set({ user, token, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ error: error.response?.data?.message || 'Signup failed', isLoading: false });
      return { success: false, error: error.response?.data?.message };
    }
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.login(credentials);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      set({ user, token, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ error: error.response?.data?.message || 'Login failed', isLoading: false });
      return { success: false, error: error.response?.data?.message };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, error: null });
  },

  handleOAuthSuccess: (token) => {
    localStorage.setItem('token', token);
    set({ token });
  },

  updateProfile: async (profileData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.updateProfile(profileData);
      const { user } = response.data;
      set({ user, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ error: error.response?.data?.message || 'Update failed', isLoading: false });
      return { success: false, error: error.response?.data?.message };
    }
  },

  clearError: () => set({ error: null }),
}));

export default useUserStore;