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

export const footballerApi = {
    getAll: (limit = 20, cursor = null) => apiClient.get('/footballers', { params: { limit, cursor } }),
    search: (params) => apiClient.get('/footballers/search', { params }),
    getById: (id) => apiClient.get(`/footballers/${id}`),
};

export const ratingApi = {
    submit: (data) => apiClient.post('/ratings', data),
    update: (ratingId, data) => apiClient.put(`/ratings/${ratingId}`, data),
    delete: (ratingId) => apiClient.delete(`/ratings/${ratingId}`),
};

export const userApi = {
    getProfile: (userId) => apiClient.get(`/users/${userId}`),
};

export const leaderboardApi = {
    getTop20: () => apiClient.get('/leaderboard'),
};

export default apiClient;