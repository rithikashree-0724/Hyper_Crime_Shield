import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const RealTimeContext = createContext();

export const useRealTime = () => useContext(RealTimeContext);

export const RealTimeProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const SOCKET_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5001';
        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);

        return () => newSocket.close();
    }, []);

    return (
        <RealTimeContext.Provider value={{ socket }}>
            {children}
        </RealTimeContext.Provider>
    );
};
