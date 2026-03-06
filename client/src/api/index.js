import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5001/api' });

API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export const login = (formData) => API.post('/auth/login', formData);
export const register = (formData) => API.post('/auth/register', formData);
export const verifyEmail = (token) => API.get('/auth/verify', { params: { token } });
export const resendVerification = (email) => API.post('/auth/resend-verification', { email });
export const forgotPassword = (email) => API.post('/auth/forgot-password', { email });
export const verifyResetOtp = (email, otp) => API.post('/auth/verify-reset-otp', { email, otp });
export const resetPassword = (data) => API.post('/auth/reset-password', data);
export const getReports = () => API.get('/reports');
export const createReport = (formData) => API.post('/reports', formData);
export const getReportDetails = (id) => API.get(`/reports/${id}`);
export const updateReportStatus = (id, status) => API.put(`/reports/${id}`, { status });
export const addReportMessage = (id, content) => API.post(`/reports/${id}/message`, { content });
export const getProfile = () => API.get('/profile');
export const updateProfile = (data) => API.put('/profile', data);
export const getLoginHistory = () => API.get('/profile/login-history');
export const getInvestigations = () => API.get('/investigations');
export const updatePassword = (passwords) => API.put('/profile/change-password', passwords);
export const setup2FA = () => API.post('/profile/2fa/setup');
export const verify2FA = (code) => API.post('/profile/2fa/verify', { code });
export const disable2FA = () => API.post('/profile/2fa/disable');
export const addInvestigationNote = (id, content) => API.post(`/investigations/${id}/note`, { content });
export const addInvestigationTask = (id, taskData) => API.post(`/investigations/${id}/task`, taskData);
export const toggleTaskCompletion = (id, index) => API.patch(`/investigations/${id}/task/${index}`);
export const setFinalOutcome = (id, outcome) => API.post(`/investigations/${id}/outcome`, { outcome });
export const assignInvestigator = (reportId, investigatorId) => API.post(`/investigations/${reportId}/assign`, { investigatorId });

export { API };

// Admin Endpoints
export const getAdminStats = () => API.get('/admin/stats');
export const getPendingUsers = () => API.get('/admin/users/pending');
export const getAllUsers = () => API.get('/admin/users');
export const verifyUser = (id) => API.put(`/admin/users/${id}/verify`);
export const blockUser = (id) => API.delete(`/admin/users/${id}`);
export const escalateReport = (id) => API.put(`/reports/${id}/escalate`);

// Analytics
export const getPerformance = () => API.get('/analytics/performance');
export const getHeatmap = () => API.get('/analytics/heatmap');
export const getPredictive = () => API.get('/analytics/predictive');

// Privacy
export const exportData = (format) => API.get(`/privacy/export?format=${format}`, { responseType: 'blob' });
export const deleteAccount = () => API.delete('/privacy/account');

// Notifications
export const getNotifications = () => API.get('/notifications');
export const markNotificationAsRead = (id) => API.put(`/notifications/${id}/read`);
