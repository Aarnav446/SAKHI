export interface CameraStatus {
  framesize: number;
  quality: number;
  brightness: number;
  contrast: number;
}

export interface CloudData {
  photo?: string; // Base64 encoded image
  timestamp?: number;
  sensor?: {
    temperature: number;
    humidity: number;
    wifi_signal: number;
  };
}

export interface SupabaseCredentials {
  url: string;
  key: string;
}