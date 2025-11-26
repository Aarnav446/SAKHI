# ESP32-CAM SD Card Controller

A React interface to control an ESP32-CAM on the local network.

## Firmware Code

**The complete Arduino sketch is included in this project.**
See the file: `ESP32-CAM.ino`.

1. Open `ESP32-CAM.ino` in Arduino IDE.
2. Select Board: **AI Thinker ESP32-CAM**.
3. Upload to your board.

## Connection Details

1.  **Network**: Connect your Phone/Laptop to the ESP32's WiFi Hotspot:
    *   **SSID**: `esp8266`
    *   **Password**: `1234567890`
2.  **IP Address**: The App will default to `192.168.4.1`.
3.  **SD Card**: Ensure a FAT32 formatted SD card is inserted.

## Troubleshooting

*   **"Failed to fetch"**: 
    1. Ensure you are connected to the `esp8266` WiFi.
    2. **Turn OFF Mobile Data** on your phone. Android/iOS often block local IPs if they have a data connection active.
*   **Recording Lag**: Writing to SD card while streaming is heavy on the ESP32. If the stream lags during recording, this is normal hardware limitation.