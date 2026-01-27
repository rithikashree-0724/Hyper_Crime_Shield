import React, { createContext, useState, useEffect, useContext } from 'react';
import * as API from '../api';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLockdown, setIsLockdown] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && token !== 'demo-token') {
            // In a real app, you'd verify the token with the server here
            // For now, we'll just keep it if it looks valid
            // setLoading(false); 
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

    const registerUser = async (formData) => {
        try {
            const { data } = await API.register(formData);
            localStorage.setItem('token', data.token);
            setUser(data.user);
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Registration failed' };
        }
    };

    const logoutUser = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, login: loginUser, register: registerUser, logout: logoutUser, isLockdown, toggleLockdown }}>
            {children}
        </AuthContext.Provider>
    );
};
