import api from './api';

const userService = {
    // Admin: Get all users
    getAllUsers: async () => {
        const response = await api.get('/admin/users');
        return response.data;
    },

    // Admin: Update role
    updateUserRole: async (id, role) => {
        const response = await api.patch(`/admin/users/${id}/role`, { role });
        return response.data;
    },

    // Admin: Delete user
    deleteUser: async (id) => {
        const response = await api.delete(`/admin/users/${id}`);
        return response.data;
    }
};

export default userService;
