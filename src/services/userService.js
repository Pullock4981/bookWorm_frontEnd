import api from './api';

const userService = {
    /**
     * Update current user profile
     * @param {FormData} formData - Profile data including files
     */
    updateProfile: async (formData) => {
        const response = await api.patch('/users/me', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    getMe: async () => {
        return await api.get('/auth/me'); // Or /users/me depending on backend route, assuming /auth/me exists based on curl command
    },

    getAllUsers: async () => {
        return await api.get('/users');
    },

    /**
     * Get public user profile
     * @param {string} userId 
     */
    getUserById: async (userId) => {
        return await api.get(`/users/${userId}`);
    },

    /**
     * Update user role (Admin only)
     * @param {string} userId 
     * @param {string} role 
     */
    updateUserRole: async (userId, role) => {
        return await api.patch(`/users/${userId}/role`, { role });
    },

    /**
     * Delete user (Admin only)
     * @param {string} userId 
     */
    deleteUser: async (userId) => {
        return await api.delete(`/users/${userId}`);
    }
};

export default userService;
