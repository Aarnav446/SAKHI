import React, { useState, useEffect, useRef } from 'react';
import { toggleSdRecording, getStreamUrl } from '../services/cameraService';

interface CameraViewProps {
  ip: string;
  onDisconnect: () => void;
}

const CameraView: React.FC<CameraViewProps> = ({ ip, onDisconnect }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [streamError, setStreamError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  // Use a ref to track if we should keep retrying
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Construct the stream URL with a timestamp to prevent caching
  const getTimestampedUrl = () => {
    const baseUrl = getStreamUrl(ip);
    return `${baseUrl}?t=${new Date().getTime()}`;
  };

  const [currentStreamUrl, setCurrentStreamUrl] = useState(getTimestampedUrl());

  const handleToggleRecord = async () => {
    const targetState = !isRecording;
    const success = await toggleSdRecording(ip, targetState);
    
    if (success) {
      setIsRecording(targetState);
    } else {
      alert("Failed to send command to camera. Please check:\n1. You are connected to the ESP32 WiFi.\n2. The ESP32 is powered on.\n3. Mobile Data is OFF.");
    }
  };

  const handleStreamError = () => {
    setStreamError(true);
    // Auto-retry after 3 seconds if error occurs
    if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
    
    retryTimeoutRef.current = setTimeout(() => {
      handleReload();
    }, 3000);
  };

  const handleReload = () => {
    setStreamError(false);
    setRetryCount(c => c + 1);
    setCurrentStreamUrl(getTimestampedUrl());
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col h-screen max-w-6xl mx-auto p-4 md:p-6 gap-6">
      {/* Header */}
      <header className="flex justify-between items-center bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <h2 className="font-bold text-lg text-white">ESP32-CAM SD Controller</h2>
            <span className="text-xs font-mono text-gray-400">IP: {ip}</span>
          </div>
        </div>
        <button 
          onClick={onDisconnect}
          className="text-sm text-gray-400 hover:text-white font-semibold px-3 py-1 hover:bg-gray-700 rounded transition-colors"
        >
          Disconnect
        </button>
      </header>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        
        {/* Stream View */}
        <div className="flex-[3] bg-black rounded-2xl overflow-hidden shadow-2xl relative border border-gray-700 group flex items-center justify-center min-h-[300px]">
          {!streamError ? (
            <img 
              key={retryCount} // Force re-render on retry
              src={currentStreamUrl} 
              alt="Live Stream" 
              className="w-full h-full object-contain"
              onError={handleStreamError}
            />
          ) : (
            <div className="text-center p-8 text-gray-400 flex flex-col items-center">
              <svg className="w-12 h-12 mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              <p className="text-xl font-bold mb-2">Stream Offline</p>
              <p className="text-sm mb-4">Connecting to {ip}:81...</p>
              <p className="text-xs text-yellow-500 mb-6 max-w-xs">
                Tip: Turn OFF "Mobile Data" on your phone. Android may block local WiFi if it has no internet.
              </p>
              <button 
                onClick={handleReload}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg text-sm font-bold transition-all"
              >
                Retry Now
              </button>
            </div>
          )}

          {/* Recording Indicator Overlay */}
          {isRecording && (
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-500/90 text-white px-3 py-1.5 rounded-full backdrop-blur-sm animate-pulse shadow-lg z-10">
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <span className="text-xs font-bold tracking-wider">REC</span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex-1 flex flex-col gap-4">
          
          {/* Action Card */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              SD Card Controls
            </h3>
            
            <p className="text-sm text-gray-400 mb-6">
              Toggle onboard recording. Files are saved to the SD card inserted in the module.
            </p>

            <button
              onClick={handleToggleRecord}
              className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 ${
                isRecording 
                  ? 'bg-red-600 hover:bg-red-700 text-white ring-2 ring-red-400 ring-offset-2 ring-offset-gray-800' 
                  : 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600'
              }`}
            >
              {isRecording ? (
                <>
                  <div className="w-4 h-4 bg-white rounded-sm"></div>
                  STOP RECORDING
                </>
              ) : (
                <>
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  START RECORDING
                </>
              )}
            </button>
          </div>

          {/* Info Card */}
          <div className="bg-gray-900/50 p-5 rounded-xl border border-gray-800 text-xs text-gray-500 leading-relaxed">
            <strong className="block text-gray-400 mb-2">Instructions:</strong>
            1. Ensure ESP32 is powered and red LED (if any) indicates readiness.<br/>
            2. Connect your device to the <strong>ESP32-CAM-Connect</strong> WiFi.<br/>
            3. Recording saves AVI or JPEG sequences to SD root.<br/>
            4. If stream fails, check if Mobile Data is OFF.
          </div>

        </div>
      </div>
    </div>
  );
};

export default CameraView;