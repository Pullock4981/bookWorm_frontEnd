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
    }
};

export default socialService;
