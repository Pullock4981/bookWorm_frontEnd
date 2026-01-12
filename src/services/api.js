import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    withCredentials: true,
});

// User-friendly error message mapping
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || 'Something went wrong. Please try again.';
        return Promise.reject(message);
    }
);

export default api;
