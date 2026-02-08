import { create } from 'zustand';
import api, { coordinatorAPI } from '../api';


const useTopicStore = create((set, get) => ({
    topics: [], 

    isLoading: false,
    error: null,

    postTopic:async(topicData)=>{
        set({ isLoading: true, error: null });
        try{
            const response = await coordinatorAPI.postTopic(topicData);
            set({ isLoading: false });
            const groupId = topicData.get('groupId');
            if (groupId) {
                get().fetchTopics(groupId);
            }
        }
        catch(error){
            set({ 
                error: error.response?.data?.error || 'Failed to post topic',
                isLoading: false 
              });
        }
    },

    fetchTopics:async(groupId)=>{
        set({ isLoading: true, error: null });
        try{
            const response = await coordinatorAPI.getTopics(groupId);
            set({ topics: response.data.topics, isLoading: false });
        }
        catch(error){
            set({ 
                error: error.response?.data?.error || 'Failed to fetch topics',
                isLoading: false 
              });
        }
    },

    respondToTopic: async(topicId, status, mentorFeedback) => {
        set({ isLoading: true, error: null });
        try {
            await coordinatorAPI.respondToTopic(topicId, status, mentorFeedback);
            set({ isLoading: false });
            get().fetchTopics();
        }
        catch(error) {
            set({ 
                error: error.response?.data?.error || 'Failed to respond to topic',
                isLoading: false 
            });
        }
    },

    clearError: () => set({ error: null }),
}));

export default useTopicStore;