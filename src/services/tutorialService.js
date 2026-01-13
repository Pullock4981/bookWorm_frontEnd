import api from './api';

const tutorialService = {
    // Get all tutorials
    getAllTutorials: async () => {
        const response = await api.get('/tutorials');
        return response.data;
    },

    // Create a new tutorial
    createTutorial: async (tutorialData) => {
        const response = await api.post('/tutorials', tutorialData);
        return response.data;
    },

    // Update a tutorial
    updateTutorial: async (id, tutorialData) => {
        const response = await api.patch(`/tutorials/${id}`, tutorialData);
        return response.data;
    },

    // Delete a tutorial
    deleteTutorial: async (id) => {
        const response = await api.delete(`/tutorials/${id}`);
        return response.data;
    }
};

export default tutorialService;
