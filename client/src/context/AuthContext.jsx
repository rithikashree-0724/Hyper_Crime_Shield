import React, { createContext, useState, useEffect, useContext } from 'react';
import * as API from '../api';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLockdown, setIsLockdown] = useState(false);

    useEffect(() => {
        let token = localStorage.getItem('token');
        if (!token) {
            token = 'demo-token';
            localStorage.setItem('token', token);
        }
        setLoading(false);
    }, []);

    const toggleLockdown = () => setIsLockdown(!isLockdown);

    const loginUser = async (email, password) => {
        try {
            const { data } = await API.login({ email, password });
            localStorage.setItem('token', data.token);
            setUser(data.user);
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Login failed' };
        }
    };

    const logoutUser = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, login: loginUser, logout: logoutUser, isLockdown, toggleLockdown }}>
            {children}
        </AuthContext.Provider>
    );
};
