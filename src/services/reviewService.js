import api from './api';

const reviewService = {
    // Public: Fetch reviews for a specific book
    getBookReviews: async (bookId) => {
        const response = await api.get(`/reviews/book/${bookId}`);
        return response.data;
    },

    // User: Submit a new review
    createReview: async (reviewData) => {
        const response = await api.post('/reviews', reviewData);
        return response.data;
    },

    // Admin: Get pending reviews
    getPendingReviews: async () => {
        const response = await api.get('/reviews/pending');
        return response.data;
    },

    // Admin: Approve review
    approveReview: async (id) => {
        const response = await api.patch(`/reviews/${id}/approve`);
        return response.data;
    },

    // Admin: Delete review
    deleteReview: async (id) => {
        const response = await api.delete(`/reviews/${id}`);
        return response.data;
    }
};

export default reviewService;
