import api from './api';

const libraryService = {
    addToLibrary: async (bookId, shelf) => {
        const response = await api.post('/library/add', { bookId, shelf });
        return response.data.data;
    },
    getMyLibrary: async () => {
        const response = await api.get('/library');
        return response.data.data;
    },
    updateProgress: async (id, pagesRead) => {
        const response = await api.patch(`/library/progress/${id}`, { pagesRead });
        return response.data.data;
    },
    removeFromLibrary: async (id) => {
        const response = await api.delete(`/library/${id}`);
        return response.data;
    }
};

export default libraryService;
