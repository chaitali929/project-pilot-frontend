import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api';

const useDiaryStore = create(
  persist(
    (set) => ({
      diaries: [],
      isLoading: false,
      error: null,

      submitDiary: async (diaryData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/api/diary/submit', diaryData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          set({ isLoading: false });
          return response.data;
        } catch (error) {
          set({
            error: error.response?.data?.error || 'Failed to submit diary',
            isLoading: false
          });
          throw error;
        }
      },

      fetchDiaries: async (groupId) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get(`/api/diary/${groupId}`);
          set({ diaries: response.data.diaries, isLoading: false });
        } catch (error) {
          set({
            error: error.response?.data?.error || 'Failed to fetch diaries',
            isLoading: false
          });
        }
      },

      clearError: () => set({ error: null })
    }),
    {
      name: 'diary-storage',
    }
  )
);

export default useDiaryStore;
