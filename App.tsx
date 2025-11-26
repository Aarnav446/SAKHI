import React, { useState } from 'react';
import ConnectForm from './components/ConnectForm';
import CameraView from './components/CameraView';

const App: React.FC = () => {
  // State to store the connected ESP32 IP address
  const [ipAddress, setIpAddress] = useState<string | null>(null);

  const handleConnect = (ip: string) => {
    setIpAddress(ip);
  };

  const handleDisconnect = () => {
    setIpAddress(null);
  };

  return (
    <div className="min-h-screen w-full">
      {!ipAddress ? (
        <ConnectForm onConnect={handleConnect} />
      ) : (
        <CameraView ip={ipAddress} onDisconnect={handleDisconnect} />
      )}
    </div>
  );
};

export default App;
