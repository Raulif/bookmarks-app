import { useCallback, useState } from "react";

export const useWakeLock = () => {
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);

  const requestWakeLock = useCallback(async () => {
    if ("wakeLock" in navigator) {
      try {
        const lock = await navigator.wakeLock.request("screen");
        console.log('Wake Lock requested: ', lock)
        setWakeLock(lock);
        return true;
      } catch (e) {
        console.error("Wake Lock error: ", e.message);
        return false;
      }
    }
  }, []);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLock) {
      await wakeLock.release();
      setWakeLock(null);
    }
  }, [wakeLock]);

  return { wakeLock, requestWakeLock, releaseWakeLock };
};
