import { create } from 'zustand';
import { mentorAPI } from '../api';

const useMentorStore = create((set, get) => ({
    groups: [],
    topics: [],
    reports: [],
    isLoading: false,
    error: null,

    fetchGroups: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await mentorAPI.getGroups();
            set({ groups: response.data.groups, isLoading: false });
        } catch (error) {
            set({ 
                error: error.response?.data?.error || 'Failed to fetch groups',
                isLoading: false 
            });
        }
    },

    fetchTopicsByGroup: async (groupId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await mentorAPI.getTopicsByGroup(groupId);
            set({ topics: response.data.topics, isLoading: false });
        } catch (error) {
            set({ 
                error: error.response?.data?.error || 'Failed to fetch topics',
                isLoading: false 
            });
        }
    },

    respondToTopic: async (topicId, status, mentorFeedback) => {
        set({ isLoading: true, error: null });
        try {
            await mentorAPI.respondToTopic(topicId, status, mentorFeedback);
            set({ isLoading: false });
        } catch (error) {
            set({ 
                error: error.response?.data?.error || 'Failed to respond to topic',
                isLoading: false 
            });
        }
    },

    fetchReports: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await mentorAPI.getReports();
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
            await mentorAPI.respondToReport(reportId, status, mentorFeedback);
            set({ isLoading: false });
        } catch (error) {
            set({ 
                error: error.response?.data?.error || 'Failed to respond to report',
                isLoading: false 
            });
        }
    },

    markReportViewed: async (reportId) => {
        try {
            await mentorAPI.markReportViewed(reportId);
        } catch (error) {
            console.error('Failed to mark report as viewed:', error);
        }
    },

    clearError: () => set({ error: null }),
}));

export default useMentorStore;
