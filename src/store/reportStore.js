import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { coordinatorAPI } from '../api';

const useReportStore = create(
  persist(
    (set, get) => ({
      reports: [], 
      isLoading: false,
      error: null,

      postReport: async (reportData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await coordinatorAPI.postReport(reportData);
          set({ isLoading: false });
          const groupId = reportData.get('groupId');
          if (groupId) {
            get().fetchReports(groupId);
          }
        } catch (error) {
          set({ 
            error: error.response?.data?.error || 'Failed to post report',
            isLoading: false 
          });
        }
      },

      fetchReports: async (groupId) => {
        set({ isLoading: true, error: null });
        try {
          const response = await coordinatorAPI.getReports(groupId);
          set({ reports: response.data.reports, isLoading: false });
        } catch (error) {
          set({ 
            error: error.response?.data?.error || 'Failed to fetch reports',
            isLoading: false 
          });
        }
      },

      respondToReport: async (reportId, status, mentorFeedback) => {
        set({ isLoading: true, error: null });
        try {
          await coordinatorAPI.respondToReport(reportId, status, mentorFeedback);
          set({ isLoading: false });
        } catch (error) {
          set({ 
            error: error.response?.data?.error || 'Failed to respond to report',
            isLoading: false 
          });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'report-storage',
    }
  )
);

export default useReportStore;
