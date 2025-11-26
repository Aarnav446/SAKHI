export interface CameraStatus {
  framesize: number;
  quality: number;
  isRecording: boolean;
  sdCardMounted: boolean;
}

export interface StreamSettings {
  ip: string;
}

export interface ConnectionError {
  message: string;
}
