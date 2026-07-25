import { useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

/**
 * useTrackInteraction — logs a discrete interaction event.
 * @param {string} productId - MongoDB product _id
 * @param {string} type - 'view' | 'cart' | 'purchase'
 * @param {string} [source='browse'] - 'browse' | 'recommendation'
 */
export default function useTrackInteraction(productId, type, source = 'browse') {
  useEffect(() => {
    if (productId && type) {
      axiosInstance
        .post('/interactions', { productId, type, source })
        .catch(err => console.error('Interaction tracking failed:', err));
    }
  }, [productId, type, source]);
}
