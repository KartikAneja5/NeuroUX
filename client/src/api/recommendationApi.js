import axiosInstance from './axiosInstance';
export const getRecommendations = (productId) => {
  const sessionToken = localStorage.getItem('neuroux_session_token') || '';
  return axiosInstance.get(`/products/${productId}/recommendations`, {
    params: { session_token: sessionToken }
  });
};
