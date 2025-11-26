# ESP32-CAM React Controller

## Quick Start

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Run Development Server**
    ```bash
    npm run dev
    ```

3.  **Setup ESP32-CAM**
    *   Ensure your ESP32-CAM is flashed with a sketch that creates a SoftAP (Hotspot) or connects to your router.
    *   Example sketch: standard `CameraWebServer` example in Arduino IDE.
    *   **Crucial**: If running locally on your PC, you must connect your PC's WiFi to the ESP32-CAM's Hotspot, OR ensure the ESP32 is on the same router network as your PC.

4.  **Connect**
    *   Open the app (usually `http://localhost:5173`).
    *   Enter the IP of the ESP32-CAM.
        *   If in AP Mode (Hotspot): Default is often `192.168.4.1`.
        *   If in Station Mode (Router): Check your Serial Monitor for the assigned IP (e.g., `192.168.1.50`).

## Troubleshooting

*   **No Image / Stream Broken**:
    *   Check if you are connected to the correct WiFi.
    *   Check the browser console (F12) for Mixed Content errors (trying to load HTTP resource from HTTPS site). Browsers like Chrome might block `http://192.168...` if the React app is served via HTTPS. Use HTTP for local dev.
*   **CORS Errors**:
    *   If you see "Access-Control-Allow-Origin" errors in the console when clicking Connect or Record, the ESP32 sketch needs to send these headers.
    *   *Workaround*: You can usually load the MJPEG stream (`<img src>`) without CORS, but fetch requests (`/capture`) strictly require CORS or a proxy.
