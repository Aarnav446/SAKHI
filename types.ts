// Defines the structure of the status object returned by the ESP32-CAM /status endpoint
export interface CameraStatus {
  framesize: number;
  quality: number;
  brightness: number;
  contrast: number;
  saturation: number;
  special_effect: number;
  wb_mode: number;
  awb: number;
  awb_gain: number;
  aec: number;
  aec2: number;
  ae_level: number;
  aec_value: number;
  agc: number;
  agc_gain: number;
  gainceiling: number;
  bpc: number;
  wpc: number;
  raw_gma: number;
  lenc: number;
  vflip: number;
  hmirror: number;
  dcw: number;
  colorbar: number;
}

// Simple type for captured frame log
export interface CapturedFrameLog {
  id: number;
  timestamp: string;
  size: number;
  status: 'Success' | 'Error';
}
