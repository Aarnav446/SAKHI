import { CameraStatus } from '../types';

/**
 * SERVICE LAYER: DIRECT IP HTTP
 * 
 * Communicates directly with the ESP32-CAM web server.
 * Requires the React App and ESP32 to be on the same local network.
 */

export const checkConnection = async (ip: string): Promise<boolean> => {
  try {
    // We try to fetch the status endpoint with a short timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    // We use 'cors' mode because the ESP32 is programmed to return Access-Control-Allow-Origin: *
    const response = await fetch(`http://${ip}/status`, { 
      method: 'GET',
      signal: controller.signal,
      mode: 'cors',
      credentials: 'omit'
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (e) {
    console.warn("Connection check failed:", e);
    return false;
  }
};

export const toggleSdRecording = async (ip: string, shouldRecord: boolean): Promise<boolean> => {
  try {
    // Sends command to ESP32: /record?val=1 (Start) or /record?val=0 (Stop)
    const val = shouldRecord ? 1 : 0;
    
    const response = await fetch(`http://${ip}/record?val=${val}`, { 
      method: 'GET',
      mode: 'cors',
      credentials: 'omit',
    });

    if (!response.ok) {
      console.error(`Server returned status: ${response.status}`);
      return false;
    }

    return true;
  } catch (e) {
    console.error("Failed to toggle recording:", e);
    return false;
  }
};

export const getStreamUrl = (ip: string): string => {
  // User's provided code runs stream on Port 80, not 81
  return `http://${ip}/stream`; 
};

export const getControlUrl = (ip: string): string => {
  return `http://${ip}`;
};