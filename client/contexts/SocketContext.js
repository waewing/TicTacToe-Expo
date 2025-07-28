import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    console.error('useSocket called outside of SocketProvider');
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  console.log('SocketProvider: Component rendering');
  
  const [socket, setSocket] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);

  useEffect(() => {
    console.log('SocketProvider: useEffect running');
    
    const newSocket = io('http://localhost:3000');
    
    newSocket.on('connect', () => {
      console.log('SocketProvider: Connected with ID:', newSocket.id);
      setSocket(newSocket);
      setIsConnecting(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('SocketProvider: Connection error:', error);
      setIsConnecting(false);
    });

    newSocket.on('disconnect', () => {
      console.log('SocketProvider: Disconnected');
      setSocket(null);
      setIsConnecting(false);
    });

    return () => {
      console.log('SocketProvider: Cleanup');
      newSocket.disconnect();
    };
  }, []);

  const value = {
    socket,
    isConnecting,
    isConnected: !!socket
  };

  console.log('SocketProvider: Providing value:', value);

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};