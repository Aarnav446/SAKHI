import React, { useState } from 'react';
import { checkConnection } from '../services/cameraService';
import { SupabaseCredentials } from '../types';

interface ConnectFormProps {
  onConnect: (creds: SupabaseCredentials) => void;
}

const ConnectForm: React.FC<ConnectFormProps> = ({ onConnect }) => {
  const [url, setUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Basic validation
    if (!url.includes("supabase.co")) {
      setError("Please enter a valid Supabase Project URL.");
      setIsLoading(false);
      return;
    }
    if (apiKey.length < 20) {
      setError("Please enter a valid Anon Key.");
      setIsLoading(false);
      return;
    }

    const creds = { url, key: apiKey };
    const isOnline = await checkConnection(creds);
    
    if (isOnline) {
      onConnect(creds);
    } else {
      setError("Connection failed. Check your URL, Key, and ensure the 'camera_stream' table exists.");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-lg bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-green-400 mb-2">Supabase IoT Hub</h1>
          <p className="text-gray-400">Secure ESP32 Streaming via Postgres.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-1">
              Project URL
            </label>
            <input
              id="url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://xyz.supabase.co"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all placeholder-gray-600"
            />
          </div>

          <div>
            <label htmlFor="key" className="block text-sm font-medium text-gray-300 mb-1">
              API Key (public/anon)
            </label>
            <input
              id="key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5..."
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all placeholder-gray-600"
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
                : 'bg-green-500 hover:bg-green-400 text-gray-900'
            }`}
          >
            {isLoading ? 'Verifying...' : 'Connect to Supabase'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-700 text-xs text-gray-500">
          <p className="font-semibold mb-1">Architecture:</p>
          <ol className="list-decimal pl-4 space-y-1">
            <li>ESP32 PATCHes row <code>id=1</code> in <code>camera_stream</code>.</li>
            <li>Supabase broadcasts UPDATE via Realtime.</li>
            <li>React app displays the new Base64 image.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default ConnectForm;