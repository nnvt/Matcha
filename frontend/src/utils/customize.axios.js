import axios from 'axios';

console.log(process.env.REACT_APP_API_URL)
console.log(process.env.REACT_APP_BACKEND_URL);


// Create an Axios instance with default configurations
const api = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}`, // Base URL for your API
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
