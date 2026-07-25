import { useEffect, useRef } from 'react';
import axiosInstance from '../api/axiosInstance';

function getOrCreateSessionToken() {
  let token = localStorage.getItem('neuroux_session_token');
  if (!token) {
    token = 'sess_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem('neuroux_session_token', token);
  }
  return token;
}

export function useTrackBehavior(currentCategory = 'General') {
  const dwellStartTime = useRef(Date.now());
  const maxScrollDepth = useRef(0);
  const filterClickMap = useRef({});

  const trackFilterClick = (filterName) => {
    if (!filterName) return;
    filterClickMap.current[filterName] = (filterClickMap.current[filterName] || 0) + 1;
  };

  useEffect(() => {
    dwellStartTime.current = Date.now();

    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (docHeight > 0) {
        const depth = Math.round((scrollTop / docHeight) * 100);
        if (depth > maxScrollDepth.current) {
          maxScrollDepth.current = Math.min(100, depth);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Flush batch function
    const sendBatchSignals = () => {
      const elapsedSeconds = Math.round((Date.now() - dwellStartTime.current) / 1000);
      const sessionToken = getOrCreateSessionToken();

      const filterClicksArray = Object.entries(filterClickMap.current).map(([filter, count]) => ({
        filter,
        count
      }));

      const payload = {
        sessionToken,
        categoryDwellTime: { [currentCategory]: elapsedSeconds },
        scrollDepth: maxScrollDepth.current,
        filterClicks: filterClicksArray
      };

      if (elapsedSeconds > 1 || maxScrollDepth.current > 10 || filterClicksArray.length > 0) {
        // Send asynchronously or beacon
        try {
          axiosInstance.post('/interactions/behavior', payload).catch(() => {});
        } catch (e) {
          // Silent fallback
        }
      }
    };

    // Periodic flush every 10 seconds
    const interval = setInterval(sendBatchSignals, 10000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
      sendBatchSignals();
    };
  }, [currentCategory]);

  return { trackFilterClick };
}
