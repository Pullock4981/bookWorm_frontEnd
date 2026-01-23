import axios from 'axios';

const getBaseURL = () => {
    const rawURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    return rawURL.endsWith('/api') ? rawURL : `${rawURL}/api`;
};

const api = axios.create({
    baseURL: getBaseURL(),
    withCredentials: true,
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// User-friendly error message mapping
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || 'Something went wrong. Please try again.';
        return Promise.reject(message);
    }
);

export default api;
