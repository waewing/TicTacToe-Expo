import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  
  const [socket, setSocket] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);

  useEffect(() => {
    const newSocket = io('http://192.168.1.162:3000');
    
    newSocket.on('connect', () => {
      setSocket(newSocket);
      setIsConnecting(false);
    });

    newSocket.on('connect_error', (error) => {
      setIsConnecting(false);
    });

    newSocket.on('disconnect', () => {
      setSocket(null);
      setIsConnecting(false);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const value = {
    socket,
    isConnecting,
    isConnected: !!socket
  };


  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};