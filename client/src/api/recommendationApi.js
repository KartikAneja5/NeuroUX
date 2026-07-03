import axiosInstance from './axiosInstance';
export const getRecommendations = (productId) => axiosInstance.get(`/products/${productId}/recommendations`);
