import React, { useState, useRef } from 'react';
import { toggleSdRecording } from '../services/cameraService';

interface CameraViewProps {
  ip: string;
  onDisconnect: () => void;
}

const CameraView: React.FC<CameraViewProps> = ({ ip, onDisconnect }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [streamError, setStreamError] = useState(false);
  
  // Construct the stream URL. 
  const streamUrl = `http://${ip}:81/stream`; 

  const handleToggleRecord = async () => {
    // Optimistic UI update or wait for result? 
    // Let's wait for result to ensure device actually received command.
    const targetState = !isRecording;
    
    const success = await toggleSdRecording(ip, targetState);
    
    if (success) {
      setIsRecording(targetState);
    } else {
      alert("Failed to send command to camera. Please check:\n1. You are connected to the ESP32 WiFi.\n2. The ESP32 is powered on.");
    }
  };

  const handleReload = () => {
    setStreamError(false);
    // Force image reload by appending timestamp
    const img = document.getElementById('mjpeg-stream') as HTMLImageElement;
    if (img) {
      img.src = `${streamUrl}?t=${new Date().getTime()}`;
    }
  };

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
        <div className="flex-[3] bg-black rounded-2xl overflow-hidden shadow-2xl relative border border-gray-700 group flex items-center justify-center">
          {!streamError ? (
            <img 
              id="mjpeg-stream"
              src={streamUrl} 
              alt="Live Stream" 
              className="w-full h-full object-contain"
              onError={() => setStreamError(true)}
            />
          ) : (
            <div className="text-center p-8 text-gray-400">
              <p className="text-xl font-bold mb-2">Stream Offline</p>
              <p className="text-sm mb-4">Cannot connect to {streamUrl}</p>
              <button 
                onClick={handleReload}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm"
              >
                Retry Connection
              </button>
            </div>
          )}

          {/* Recording Indicator Overlay */}
          {isRecording && (
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-500/90 text-white px-3 py-1.5 rounded-full backdrop-blur-sm animate-pulse">
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <span className="text-xs font-bold tracking-wider">REC</span>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-end">
             <div className="text-xs text-gray-300">
               <p>MJPEG STREAM</p>
             </div>
          </div>
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
            4. If stream lags, refresh the page.
          </div>

        </div>
      </div>
    </div>
  );
};

export default CameraView;