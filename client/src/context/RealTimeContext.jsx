import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const RealTimeContext = createContext();

export const useRealTime = () => useContext(RealTimeContext);

export const RealTimeProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io('http://localhost:5001');
        setSocket(newSocket);

        return () => newSocket.close();
    }, []);

    return (
        <RealTimeContext.Provider value={{ socket }}>
            {children}
        </RealTimeContext.Provider>
    );
};
