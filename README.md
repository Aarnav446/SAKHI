# ESP32-CAM SD Card Controller

A React interface to control an ESP32-CAM on the local network, focusing on MJPEG streaming and SD card recording.

## Firmware Code

**The complete Arduino sketch is included in this project.**
See the file: `ESP32-CAM.ino`.

1. Open `ESP32-CAM.ino` in Arduino IDE.
2. Select Board: **AI Thinker ESP32-CAM**.
3. Upload to your board.

## Requirements

1.  **Network**: Connect your Phone/Laptop to the ESP32's WiFi Hotspot:
    *   **SSID**: `ESP32-CAM-Connect`
    *   **Password**: `password123`
2.  **Hardware**: ESP32-CAM with a valid SD Card inserted.
3.  **URL**: The App should connect to `192.168.4.1`.

## How to Run the App

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Start local server:
    ```bash
    npm run dev
    ```
3.  Enter the IP address `192.168.4.1` in the app.

## ESP32 API Expectations

1.  **`GET /stream`** (Port 81)
    *   Returns: `multipart/x-mixed-replace` (MJPEG Stream).
2.  **`GET /record?val=1`** (Port 80)
    *   Start SD Card recording.
3.  **`GET /record?val=0`** (Port 80)
    *   Stop SD Card recording.

## Troubleshooting

*   **"Failed to fetch"**: Make sure you are connected to the ESP32 WiFi (192.168.4.1) and mobile data is turned OFF on your phone (sometimes phones prefer mobile data over a WiFi with no internet).
