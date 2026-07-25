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
      const sessionToken = localStorage.getItem('neuroux_session_token') || '';
      axiosInstance
        .post('/interactions', { productId, type, source, sessionToken })
        .catch(err => console.error('Interaction tracking failed:', err));
    }
  }, [productId, type, source]);
}
