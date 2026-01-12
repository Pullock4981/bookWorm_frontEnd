import api from './api';

const bookService = {
    getAllBooks: async (params) => {
        const res = await api.get('/books', { params });
        return res.data;
    },
    getBookById: async (id) => {
        const res = await api.get(`/books/${id}`);
        return res.data.data;
    },
    createBook: async (bookData) => {
        const res = await api.post('/books', bookData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return res.data;
    },
    updateBook: async (id, bookData) => {
        const res = await api.patch(`/books/${id}`, bookData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return res.data;
    },
    deleteBook: async (id) => {
        const res = await api.delete(`/books/${id}`);
        return res.data;
    },
    getGenres: async () => {
        const res = await api.get('/genres');
        return res.data.data;
    }
};

export default bookService;
