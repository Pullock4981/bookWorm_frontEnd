import api from './api';

const socialService = {
    // Get activity feed (followed users or global)
    getFeed: async () => {
        const response = await api.get('/social/feed');
        return response.data;
    },

    // Follow a user
    followUser: async (userId) => {
        const response = await api.post(`/social/follow/${userId}`);
        return response.data;
    },

    // Unfollow a user
    unfollowUser: async (userId) => {
        const response = await api.post(`/social/unfollow/${userId}`);
        return response.data;
    },

    // Get users to follow
    getSuggestedUsers: async () => {
        const response = await api.get('/social/users-to-follow');
        return response.data;
    },

    // Get following list
    getFollowing: async () => {
        const response = await api.get('/social/following');
        return response.data;
    },

    // Get specific user's activity
    getUserActivity: async (userId) => {
        const response = await api.get(`/social/activity/${userId}`);
        return response.data;
    },

    toggleLike: async (activityId) => {
        const response = await api.post(`/social/activity/${activityId}/like`);
        return response.data;
    },

    addComment: async (activityId, text) => {
        const response = await api.post(`/social/activity/${activityId}/comment`, { text });
        return response.data;
    }
};

export default socialService;
