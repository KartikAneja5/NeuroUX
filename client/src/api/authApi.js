import axiosInstance from './axiosInstance';
export const login = (data) => axiosInstance.post('/auth/login', data);
export const register = (data) => axiosInstance.post('/auth/register', data);
export const verifyEmail = (token) => axiosInstance.post(`/auth/verify/${token}`);
export const forgotPassword = (data) => axiosInstance.post('/auth/forgot-password', data);
export const resetPassword = (token, data) => axiosInstance.post(`/auth/reset-password/${token}`, data);
