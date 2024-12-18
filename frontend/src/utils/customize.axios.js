import axios from 'axios';

// Create an Axios instance with default configurations
const api = axios.create({
    baseURL: 'https://matchaa-backend-7bfca7ce8452.herokuapp.com/api', // Base URL for your API
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor to add token to headers if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor to handle errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Handle specific status codes or messages here
            console.error('API Error:', error.response);
        }
        return Promise.reject(error.response ? error.response.data : error);
    }
);

export default api;
