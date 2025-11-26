import React, { useState } from 'react';
import { checkConnection } from '../services/cameraService';

interface ConnectFormProps {
  onConnect: (ip: string) => void;
}

const ConnectForm: React.FC<ConnectFormProps> = ({ onConnect }) => {
  const [ipInput, setIpInput] = useState('192.168.4.1');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Basic validation
    if (!ipInput.trim()) {
      setError("Please enter an IP address.");
      setIsLoading(false);
      return;
    }

    // Try to ping the camera before 'connecting'
    const isOnline = await checkConnection(ipInput);
    
    if (isOnline) {
      onConnect(ipInput);
    } else {
      // In many cases with ESP32 CORS issues, fetch might fail even if it's there.
      // We allow the user to force connect if they believe the IP is correct,
      // or we display a warning. For this demo, we'll show an error but allow a "Force Connect" option implicitly?
      // No, let's keep it simple: Show error.
      setError("Could not reach camera. Check IP and ensure you are on the same Wi-Fi (Hotspot). Check browser console for CORS errors.");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-teal-400 mb-2">ESP32-CAM Hub</h1>
          <p className="text-gray-400">Connect to your camera's Wi-Fi hotspot first.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="ip" className="block text-sm font-medium text-gray-300 mb-1">
              Camera IP Address
            </label>
            <input
              id="ip"
              type="text"
              value={ipInput}
              onChange={(e) => setIpInput(e.target.value)}
              placeholder="e.g. 192.168.4.1"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all placeholder-gray-600"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-bold text-lg shadow-lg transition-all transform hover:scale-[1.02] ${
              isLoading 
                ? 'bg-gray-600 cursor-not-allowed text-gray-400' 
                : 'bg-teal-500 hover:bg-teal-400 text-gray-900'
            }`}
          >
            {isLoading ? 'Connecting...' : 'Connect to Camera'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-700 text-xs text-gray-500">
          <p className="font-semibold mb-1">How to use:</p>
          <ol className="list-decimal pl-4 space-y-1">
            <li>Power on ESP32-CAM.</li>
            <li>Connect your device to ESP32's WiFi hotspot.</li>
            <li>Enter the IP (usually 192.168.4.1).</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default ConnectForm;
