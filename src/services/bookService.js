import api from './api';

const bookService = {
    getAllBooks: async (params) => {
        const response = await api.get('/books', { params });
        return response.data;
    },
    getBookById: async (id) => {
        const response = await api.get(`/books/${id}`);
        return response.data.data;
    },
    createBook: async (formData) => {
        const response = await api.post('/books', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },
    updateBook: async (id, formData) => {
        const response = await api.patch(`/books/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },
    deleteBook: async (id) => {
        const response = await api.delete(`/books/${id}`);
        return response.data;
    }
};

export default bookService;
