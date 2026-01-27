import React, { createContext, useState, useEffect, useContext } from 'react';
import * as API from '../api';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLockdown, setIsLockdown] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token && token !== 'demo-token') {
                try {
                    const { data } = await API.getProfile();
                    setUser(data);
                } catch (err) {
                    console.error('Session restore failed:', err);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const toggleLockdown = () => setIsLockdown(!isLockdown);

    const loginUser = async (email, password, code) => {
        try {
            const { data } = await API.login({ email, password, code });

            if (data.requires2FA) {
                return { success: true, requires2FA: true, message: data.message };
            }

            localStorage.setItem('token', data.token);
            setUser(data.user);
            return { success: true, user: data.user };
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
