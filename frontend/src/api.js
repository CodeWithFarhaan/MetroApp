import axios from 'axios';

export const API_URL = 'http://localhost:3000/api';

// Create an Axios instance
const api = axios.create({
    baseURL: API_URL,
});

// Set up an interceptor to add the Authorization header if a token is present
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api; // Export api as the default export

// Auth API requests
export const registerUser = (userData) => api.post('/register', userData);
export const loginUser = (userData) => api.post('/login', userData);
export const logoutUser = (userData) => api.post('/logout', userData);

export const initiatePayment = (paymentData) => api.post('/buy-ticket', paymentData, {
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
});