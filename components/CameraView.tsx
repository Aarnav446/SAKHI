import React, { useState, useEffect } from 'react';
import { subscribeToStream } from '../services/cameraService';
import { CloudData, SupabaseCredentials } from '../types';

interface CameraViewProps {
  creds: SupabaseCredentials;
  onDisconnect: () => void;
}

const CameraView: React.FC<CameraViewProps> = ({ creds, onDisconnect }) => {
  const [data, setData] = useState<CloudData | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Connect to Supabase Realtime
    const unsubscribe = subscribeToStream(
      creds,
      (newData) => {
        setData(newData);
        setLastUpdate(new Date());
        setIsConnected(true);
      },
      (err) => {
        console.error("Stream disconnected", err);
        setIsConnected(false);
      }
    );

    return () => unsubscribe();
  }, [creds]);

  return (
    <div className="flex flex-col h-screen max-w-6xl mx-auto p-4 md:p-6 gap-6">
      {/* Header */}
      <header className="flex justify-between items-center bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
          <h2 className="font-bold text-lg text-white">Supabase Monitor</h2>
        </div>
        <div className="text-xs text-gray-400 font-mono hidden sm:block">
           Last Update: {lastUpdate.toLocaleTimeString()}
        </div>
        <button 
          onClick={onDisconnect}
          className="text-sm text-red-400 hover:text-red-300 font-semibold px-3 py-1 hover:bg-red-900/20 rounded transition-colors"
        >
          Disconnect
        </button>
      </header>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        
        {/* Left Column: Image View */}
        <div className="flex-[2] bg-black rounded-2xl overflow-hidden shadow-2xl relative border border-gray-700 flex items-center justify-center group min-h-[300px]">
          {data?.photo ? (
            <img 
              src={`data:image/jpeg;base64,${data.photo}`} 
              alt="ESP32 Stream" 
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-center p-8 text-gray-500 animate-pulse">
              <p>Waiting for data from Supabase...</p>
              <p className="text-xs mt-2 text-gray-600">Ensure ESP32 is running and table 'camera_stream' exists</p>
            </div>
          )}
          
          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-2 rounded-lg text-xs font-mono text-white">
            <div>SOURCE: Supabase Realtime</div>
            <div>TYPE: Base64 JPEG</div>
          </div>
        </div>

        {/* Right Column: Sensor Data */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Sensor Status</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700/50 p-4 rounded-xl">
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Temperature</p>
                <div className="text-2xl font-mono text-green-400">
                  {data?.sensor?.temperature ? `${data.sensor.temperature}°C` : '--'}
                </div>
              </div>
              <div className="bg-gray-700/50 p-4 rounded-xl">
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Humidity</p>
                <div className="text-2xl font-mono text-blue-400">
                  {data?.sensor?.humidity ? `${data.sensor.humidity}%` : '--'}
                </div>
              </div>
              <div className="bg-gray-700/50 p-4 rounded-xl col-span-2">
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">WiFi Signal (RSSI)</p>
                <div className="flex items-center gap-2">
                   <div className="h-2 flex-1 bg-gray-600 rounded-full overflow-hidden">
                     <div 
                        className="h-full bg-green-500" 
                        style={{ width: `${Math.min(100, Math.max(0, (100 + (data?.sensor?.wifi_signal || -100)) * 2))}%` }}
                     ></div>
                   </div>
                   <span className="font-mono text-white">{data?.sensor?.wifi_signal || -0} dBm</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800 text-sm text-gray-500">
            <p>
              Note: Using Supabase Realtime.
              Keep image size small (QVGA) to avoid payload limits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraView;