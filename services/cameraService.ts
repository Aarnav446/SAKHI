/**
 * SERVICE LAYER EXPLANATION
 * 
 * This file handles all direct HTTP communication with the ESP32.
 * 
 * 1. Fetch Calls: 
 *    We use the native `fetch` API. 
 *    Note on CORS: The ESP32-CAM default example sketches usually rely on simple HTTP.
 *    If your React app is served via HTTPS (rare for local dev) and ESP32 is HTTP, 
 *    you will get Mixed Content errors. Ensure both are HTTP for local testing.
 *    Additionally, the ESP32 must support CORS headers (Access-Control-Allow-Origin: *)
 *    if the domains/ports differ, which they do (localhost:5173 vs 192.168.x.x).
 *    Most modern browser settings or extensions can bypass this for dev, 
 *    or modify the ESP32 code to send these headers.
 * 
 * 2. MJPEG Stream:
 *    The stream is NOT fetched via JS. It is loaded directly into an <img> tag.
 *    The browser handles the multipart/x-mixed-replace content type automatically.
 */

export const getStreamUrl = (ip: string): string => {
  // Removes trailing slashes and adds protocol if missing
  const cleanIp = ip.replace(/\/$/, '').replace(/^https?:\/\//, '');
  return `http://${cleanIp}/stream`;
};

export const getBaseUrl = (ip: string): string => {
  const cleanIp = ip.replace(/\/$/, '').replace(/^https?:\/\//, '');
  return `http://${cleanIp}`;
};

/**
 * Captures a single still frame from the camera.
 * Used for the "Recording" simulation.
 */
export const captureFrame = async (ip: string): Promise<Blob> => {
  const url = `${getBaseUrl(ip)}/capture?t=${Date.now()}`; // Add timestamp to prevent caching
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to capture frame: ${response.statusText}`);
  }
  
  return await response.blob();
};

/**
 * Checks if the camera is online by hitting the status endpoint.
 */
export const checkConnection = async (ip: string): Promise<boolean> => {
  try {
    const url = `${getBaseUrl(ip)}/status`;
    const response = await fetch(url, { signal: AbortSignal.timeout(2000) }); // 2s timeout
    return response.ok;
  } catch (e) {
    console.error("Connection check failed:", e);
    return false;
  }
};

/**
 * Sends a control command to the ESP32.
 * endpoint: /control?var=framesize&val=5
 */
export const setControl = async (ip: string, variable: string, value: number): Promise<void> => {
  const url = `${getBaseUrl(ip)}/control?var=${variable}&val=${value}`;
  await fetch(url);
};
