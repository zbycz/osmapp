import { useEffect, useRef } from 'react';
import { useQuery } from 'react-query';

const requestWakeLock = async () => {
  if (!('wakeLock' in navigator)) {
    return;
  }

  return await navigator.wakeLock.request('screen');
};

const releaseWakeLock = async (wakeLock: WakeLockSentinel) =>
  await wakeLock.release();

export const useWakeLock = (enabled: boolean = true) => {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  const { refetch } = useQuery(
    'wakeLock',
    async () => {
      if (enabled) {
        wakeLockRef.current = await requestWakeLock();
        return wakeLockRef.current;
      }
      if (!wakeLockRef.current) {
        return;
      }
      await releaseWakeLock(wakeLockRef.current);
      wakeLockRef.current = null;
    },
    { enabled: false },
  );

  useEffect(() => {
    refetch();

    return () => {
      if (!wakeLockRef.current) {
        return;
      }
      releaseWakeLock(wakeLockRef.current);
      wakeLockRef.current = null;
    };
  }, [enabled, refetch]);
};
