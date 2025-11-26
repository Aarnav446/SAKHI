import React, { useState } from 'react';
import ConnectForm from './components/ConnectForm';
import CameraView from './components/CameraView';
import { SupabaseCredentials } from './types';

const App: React.FC = () => {
  // State to store the Supabase Credentials
  const [creds, setCreds] = useState<SupabaseCredentials | null>(null);

  const handleConnect = (credentials: SupabaseCredentials) => {
    setCreds(credentials);
  };

  const handleDisconnect = () => {
    setCreds(null);
  };

  return (
    <div className="min-h-screen w-full">
      {!creds ? (
        <ConnectForm onConnect={handleConnect} />
      ) : (
        <CameraView creds={creds} onDisconnect={handleDisconnect} />
      )}
    </div>
  );
};

export default App;