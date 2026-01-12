import api from './api';

const getUserStats = async () => {
    return await api.get('/stats/me');
};

const updateGoal = async (targetCount) => {
    return await api.post('/stats/goal', { targetCount });
};

const getAdminStats = async () => {
    return await api.get('/stats/admin');
};

const statsService = {
    getUserStats,
    updateGoal,
    getAdminStats
};

export default statsService;
