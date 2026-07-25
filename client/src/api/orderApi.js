import axiosInstance from './axiosInstance';
export const checkout = (data) => axiosInstance.post('/orders/checkout', data);
export const getMyOrders = () => axiosInstance.get('/orders/mine');
export const downloadOrderInvoice = (orderId) => axiosInstance.get(`/orders/${orderId}/invoice`, { responseType: 'blob' });
