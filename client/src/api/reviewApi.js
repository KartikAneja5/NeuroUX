import axiosInstance from './axiosInstance';

export const getProductReviews = (productId) => axiosInstance.get(`/products/${productId}/reviews`);

export const submitProductReview = (productId, { rating, comment }) =>
  axiosInstance.post(`/products/${productId}/reviews`, { rating, comment });
