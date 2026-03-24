import api from './axiosInstance';

export const getSearchHistory = () => api.get('/api/searches');

export const getStats = () => api.get('/api/stats');
