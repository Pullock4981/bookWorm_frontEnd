import api from './api';

const getMyFavorites = async () => {
    return await api.get('/favorites');
};

const toggleFavorite = async (bookId) => {
    return await api.post('/favorites/toggle', { bookId });
};

const checkFavoriteStatus = async (bookId) => {
    return await api.get(`/favorites/check/${bookId}`);
};

const favoriteService = {
    getMyFavorites,
    toggleFavorite,
    checkFavoriteStatus
};

export default favoriteService;
