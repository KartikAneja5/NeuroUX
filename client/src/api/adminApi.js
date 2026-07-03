import axiosInstance from './axiosInstance';
export const getAdminUsers = () => axiosInstance.get('/admin/users');
export const getAdminOrders = () => axiosInstance.get('/admin/orders');
export const getAdminAnalytics = () => axiosInstance.get('/admin/analytics');
