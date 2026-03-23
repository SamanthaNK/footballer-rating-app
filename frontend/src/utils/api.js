import axios from 'axios';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:5000/api';

const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 12000,
    headers: { 'Content-Type': 'application/json' },
});

export const setAuthToken = (token) => {
    if (token) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete apiClient.defaults.headers.common['Authorization'];
    }
};

export const authApi = {
    register: (data) => apiClient.post('/auth/register', data),
    verifyEmail: (data) => apiClient.post('/auth/verify-email', data),
    resendVerification: (data) => apiClient.post('/auth/resend-verification', data),
    login: (data) => apiClient.post('/auth/login', data),
    forgotPassword: (data) => apiClient.post('/auth/forgot-password', data),
    verifyResetCode: (data) => apiClient.post('/auth/verify-reset-code', data),
    resetPassword: (data) => apiClient.post('/auth/reset-password', data),
};

export default apiClient;