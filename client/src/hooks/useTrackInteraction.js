import { useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
export default function useTrackInteraction(productId, type) {
  useEffect(() => {
    if (productId && type) {
      axiosInstance.post('/interactions', { productId, type }).catch(err => console.error(err));
    }
  }, [productId, type]);
}
