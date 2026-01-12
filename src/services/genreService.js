import api from './api';

const genreService = {
    getAllGenres: async () => {
        const response = await api.get('/genres');
        return response.data; // Assuming response structure { status: 'success', results: n, data: [...] } or just array based on backend
    },
    createGenre: async (data) => {
        const response = await api.post('/genres', data);
        return response.data;
    },
    updateGenre: async (id, data) => {
        const response = await api.patch(`/genres/${id}`, data);
        return response.data;
    },
    deleteGenre: async (id) => {
        const response = await api.delete(`/genres/${id}`);
        return response.data;
    }
};

export default genreService;
