import axiosInstance from './axiosInstance';
export const getCart = () => axiosInstance.get('/cart');
export const addToCart = (data) => axiosInstance.post('/cart', data);
export const updateCartItem = (data) => axiosInstance.put('/cart', data);
export const removeFromCart = (id) => axiosInstance.delete(`/cart/${id}`);
