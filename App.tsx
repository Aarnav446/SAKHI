import React, { useState } from 'react';
import ConnectForm from './components/ConnectForm';
import CameraView from './components/CameraView';

const App: React.FC = () => {
  const [deviceIp, setDeviceIp] = useState<string | null>(null);

  const handleConnect = (ip: string) => {
    setDeviceIp(ip);
  };

  const handleDisconnect = () => {
    setDeviceIp(null);
  };

  return (
    <div className="min-h-screen w-full">
      {!deviceIp ? (
        <ConnectForm onConnect={handleConnect} />
      ) : (
        <CameraView ip={deviceIp} onDisconnect={handleDisconnect} />
      )}
    </div>
  );
};

export default App;
