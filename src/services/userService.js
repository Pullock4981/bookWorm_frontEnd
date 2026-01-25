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
};

export default userService;
