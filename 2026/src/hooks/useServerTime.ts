import { useState, useEffect } from "react";
import { fetchNetworkTime } from "../utils/time";
import { isArchiveMode } from "../archive/archive";

/**
 * Hook to provide a reliable current time that is synced with a network source.
 * This prevents users from manipulating their local device time to bypass countdowns.
 */
export function useServerTime() {
  const [now, setNow] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    const initTime = async () => {
      if (isArchiveMode) {
        setNow(Date.now());
        setLoading(false);
        intervalId = setInterval(() => setNow(Date.now()), 1000);
        return;
      }
      try {
        const serverDate = await fetchNetworkTime();
        const serverTime = serverDate.getTime();
        const localTimeAtFetch = Date.now();
        const offset = serverTime - localTimeAtFetch;

        // Initialize time
        setNow(Date.now() + offset);
        setLoading(false);

        // Update time every second, maintaining the offset
        intervalId = setInterval(() => {
          setNow(Date.now() + offset);
        }, 1000);
      } catch (e) {
        console.error("Failed to sync time", e);
        // Fallback to local time if sync fails completely (though fetchNetworkTime handles fallbacks)
        setNow(Date.now());
        setLoading(false);
        intervalId = setInterval(() => {
          setNow(Date.now());
        }, 1000);
      }
    };

    initTime();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return { now, loading };
}
