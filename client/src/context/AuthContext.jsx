import React, { createContext, useState, useEffect, useContext } from 'react';
import * as API from '../api';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
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
            let message = 'Login failed';
            const data = err.response?.data;

            if (data?.message) message = data.message;
            else if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
                const firstError = data.errors[0];
                message = typeof firstError === 'string' ? firstError : Object.values(firstError)[0];
            }
            else if (data?.error?.message) message = data.error.message;
            else if (err.message) message = err.message;

            return { success: false, message };
        }
    };

    const registerUser = async (formData) => {
        try {
            const { data } = await API.register(formData);
            // Since verification is required, we don't set token or user yet
            return { success: true, message: data.message };
        } catch (err) {
            const message = err.response?.data?.message ||
                err.response?.data?.error?.message ||
                err.message ||
                'Registration failed';
            return { success: false, message };
        }
    };

    const logoutUser = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, login: loginUser, register: registerUser, logout: logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};
