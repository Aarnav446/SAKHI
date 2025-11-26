import React, { useState, useEffect, useRef } from 'react';
import { getStreamUrl, captureFrame } from '../services/cameraService';
import { CapturedFrameLog } from '../types';

interface CameraViewProps {
  ip: string;
  onDisconnect: () => void;
}

const CameraView: React.FC<CameraViewProps> = ({ ip, onDisconnect }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [logs, setLogs] = useState<CapturedFrameLog[]>([]);
  const [streamError, setStreamError] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Ref to hold the interval ID so we can clear it easily
  const recordingIntervalRef = useRef<number | null>(null);

  // Auto-scroll logs
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  /**
   * HANDLING RECORDING (SIMULATION)
   * 
   * In a real production app, you generally have two options:
   * 1. Server-side recording: Send a command to the ESP32 (e.g. /start_record) 
   *    and let the SD card handle the writing. This is much faster and reliable.
   * 2. Client-side recording: Capture frames via JS and compile them into a video (WebM/MP4)
   *    using MediaRecorder API or a library like ffmpeg.wasm.
   * 
   * Here, we simulate option 2 by polling /capture every second.
   */
  const toggleRecording = () => {
    if (isRecording) {
      // Stop Recording
      if (recordingIntervalRef.current) {
        window.clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
      setIsRecording(false);
    } else {
      // Start Recording
      setIsRecording(true);
      recordingIntervalRef.current = window.setInterval(async () => {
        try {
          const blob = await captureFrame(ip);
          const newLog: CapturedFrameLog = {
            id: Date.now(),
            timestamp: new Date().toLocaleTimeString(),
            size: blob.size,
            status: 'Success'
          };
          
          setLogs(prev => [...prev, newLog]);
          console.log(`[Recorder] Captured frame: ${blob.size} bytes`);
        } catch (err) {
          const errorLog: CapturedFrameLog = {
            id: Date.now(),
            timestamp: new Date().toLocaleTimeString(),
            size: 0,
            status: 'Error'
          };
          setLogs(prev => [...prev, errorLog]);
          console.error("[Recorder] Capture failed", err);
        }
      }, 1000); // 1 FPS for simulation
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) {
        window.clearInterval(recordingIntervalRef.current);
      }
    };
  }, []);

  const streamUrl = getStreamUrl(ip);

  return (
    <div className="flex flex-col h-screen max-w-6xl mx-auto p-4 md:p-6 gap-6">
      {/* Header */}
      <header className="flex justify-between items-center bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <h2 className="font-bold text-lg text-white">Connected: {ip}</h2>
        </div>
        <button 
          onClick={onDisconnect}
          className="text-sm text-red-400 hover:text-red-300 font-semibold px-3 py-1 hover:bg-red-900/20 rounded transition-colors"
        >
          Disconnect
        </button>
      </header>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        
        {/* Left Column: Live Stream */}
        <div className="flex-[2] bg-black rounded-2xl overflow-hidden shadow-2xl relative border border-gray-700 flex items-center justify-center group">
          {/* 
            MJPEG EXPLANATION:
            The src points directly to the ESP32 /stream endpoint.
            The response MIME type is multipart/x-mixed-replace.
            The browser continuously receives chunks of JPEGs and updates the image.
          */}
          {!streamError ? (
            <img 
              src={streamUrl} 
              alt="ESP32 Live Stream" 
              className="w-full h-full object-contain"
              onError={() => setStreamError(true)}
            />
          ) : (
            <div className="text-center p-8">
              <p className="text-red-500 text-xl font-bold mb-2">Stream Connection Lost</p>
              <p className="text-gray-400">Check if the camera is overheating or WiFi signal is weak.</p>
              <button 
                onClick={() => setStreamError(false)} 
                className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
              >
                Retry
              </button>
            </div>
          )}

          {/* Overlay Status */}
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-mono text-white flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
            {isRecording ? 'REC' : 'LIVE'}
          </div>
        </div>

        {/* Right Column: Controls & Logs */}
        <div className="flex-1 flex flex-col gap-4 min-h-0">
          
          {/* Action Card */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Actions</h3>
            
            <button
              onClick={toggleRecording}
              className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                isRecording 
                  ? 'bg-red-500/10 text-red-500 border-2 border-red-500 hover:bg-red-500/20' 
                  : 'bg-teal-500 text-gray-900 hover:bg-teal-400 hover:scale-[1.02] shadow-lg shadow-teal-500/20'
              }`}
            >
              {isRecording ? (
                <>
                  <span className="w-4 h-4 bg-red-500 rounded-sm"></span>
                  Stop Recording
                </>
              ) : (
                <>
                  <span className="w-4 h-4 bg-gray-900 rounded-full border-4 border-gray-900 ring-2 ring-gray-900"></span>
                  Start Recording
                </>
              )}
            </button>
            
            <div className="mt-4 text-sm text-gray-400">
              <p>Simulates recording by fetching /capture every second.</p>
            </div>
          </div>

          {/* Log Console */}
          <div className="flex-1 bg-gray-900 rounded-2xl shadow-inner border border-gray-800 overflow-hidden flex flex-col min-h-[200px]">
            <div className="p-3 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
              <span className="font-mono text-xs text-gray-400 uppercase tracking-wider">System Logs</span>
              <span className="text-xs text-teal-500">{logs.length} Frames</span>
            </div>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-sm">
              {logs.length === 0 && (
                <p className="text-gray-600 text-center italic mt-4">No frames captured yet...</p>
              )}
              {logs.map((log) => (
                <div key={log.id} className="flex gap-2 text-gray-300 border-b border-gray-800 pb-1 last:border-0">
                  <span className="text-gray-500">[{log.timestamp}]</span>
                  <span className={log.status === 'Success' ? 'text-green-400' : 'text-red-400'}>
                    {log.status === 'Success' ? `Captured ${Math.round(log.size / 1024)}KB` : 'Fetch Failed'}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CameraView;
