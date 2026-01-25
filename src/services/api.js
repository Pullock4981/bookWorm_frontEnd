import axios from 'axios';

const getBaseURL = () => {
    let rawURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    // Remove trailing slash if present
    if (rawURL.endsWith('/')) {
        rawURL = rawURL.slice(0, -1);
    }
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
            // Check if token exists and is not a string "null" or "undefined"
            if (token && token !== 'null' && token !== 'undefined') {
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
        console.error("API Error:", error.response?.config?.url, error.response?.status, error.response?.data);
        const message = error.response?.data?.message || 'Something went wrong. Please try again.';
        return Promise.reject(message);
    }
);

export default api;
