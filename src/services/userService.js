import api from './api';

const userService = {
    // Admin: Get all users
    getAllUsers: async () => {
        const response = await api.get('/users');
        return response.data;
    },

    // Admin: Update role
    updateUserRole: async (id, role) => {
        const response = await api.patch(`/users/${id}/role`, { role });
        return response.data;
    },

    // Admin: Delete user
    deleteUser: async (id) => {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    }
};

export default userService;
