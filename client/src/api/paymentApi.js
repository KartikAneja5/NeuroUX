import axiosInstance from './axiosInstance';

export const createRazorpayOrder = async (amount, currency = 'INR') => {
  const response = await axiosInstance.post('/payment/create-order', { amount, currency });
  return response.data;
};

export const verifyRazorpayPayment = async (payload) => {
  const response = await axiosInstance.post('/payment/verify', payload);
  return response.data;
};
