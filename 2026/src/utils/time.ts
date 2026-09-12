/**
 * Fetches the current time from a reliable network source.
 * Falls back to server headers and then local device time.
 */
export async function fetchNetworkTime(): Promise<Date> {
    try {
        // 1. Priority: App server time (using HEAD request to /health)
        // This is faster (same-origin) and reliable if the app itself is reachable.
        const response = await fetch(`${import.meta.env.VITE_API_URL}/health`, { method: 'HEAD' });
        const dateHeader = response.headers.get('date');
        if (dateHeader) {
            return new Date(dateHeader);
        }
    } catch (error) {
        // console.warn('Server time fetch failed');
    }

    try {
        // 2. Fallback: WorldTimeAPI
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout

        const response = await fetch('https://worldtimeapi.org/api/timezone/Asia/Kolkata', {
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (response.ok) {
            const data = await response.json();
            // data.datetime is ISO 8601
            return new Date(data.datetime);
        }
    } catch (error) {
        // console.warn('WorldTimeAPI failed');
    }

    // 3. Last resort: Client time
    return new Date();
}
