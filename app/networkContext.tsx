import React, { createContext, useContext, useState } from 'react';

const NetworkContext = createContext({
  mode: 'offline',
  toggleMode: () => {}
});

export function useNetwork() {
  return useContext(NetworkContext);
}

export function NetworkProvider({ children }) {
  const [mode, setMode] = useState('offline');
  const toggleMode = () => {
    setMode(prev => (prev === 'offline' ? 'online' : 'offline'));
  };
  
  return (
    <NetworkContext.Provider value={{ mode, toggleMode }}>
      {children}
    </NetworkContext.Provider>
  );
} 