import api from './api';

const chatService = {
    uploadImage: async (formData) => {
        const response = await api.post('/chat/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    /**
     * Get all conversations for the current user
     */
    getConversations: async () => {
        const response = await api.get('/chat/conversations');
        return response.data;
    },

    /**
     * Get message history for a specific conversation
     */
    getMessages: async (conversationId, limit = 50, skip = 0) => {
        const response = await api.get(`/chat/messages/${conversationId}`, {
            params: { limit, skip }
        });
        return response.data;
    },

    /**
     * Create or fetch a conversation with a recipient
     */
    startConversation: async (recipientId) => {
        const response = await api.post('/chat/conversations', { recipientId });
        return response.data;
    },

    /**
     * Search for users to start a conversation
     */
    searchUsers: async (query) => {
        const response = await api.get('/social/search', {
            params: { q: query }
        });
        return response.data.data;
    }
};

export default chatService;
