'use client';

import { useEffect } from 'react';
import { useApiStore } from '@/store/useApiStore';

export function OfflineDetector() {
  const setOffline = useApiStore((state) => state.setOffline);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const handleOnline = () => setOffline(false);
    const handleOffline = () => setOffline(true);

    // Initial check
    setOffline(!navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOffline]);

  return null;
}
