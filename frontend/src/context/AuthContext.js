import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { authApi, setAuthToken } from '../utils/api.js';

const TOKEN_KEY = 'rtb_jwt_token';
const USER_KEY = 'rtb_user_data';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        restoreSession();
    }, []);

    const restoreSession = async () => {
        try {
            const savedToken = await SecureStore.getItemAsync(TOKEN_KEY);
            const savedUser = await SecureStore.getItemAsync(USER_KEY);

            if (savedToken && savedUser) {
                setToken(savedToken);
                setUser(JSON.parse(savedUser));
                setAuthToken(savedToken);
            }
        } catch (error) {
            console.warn('Could not restore session:', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const persistSession = async (newToken, userData) => {
        await SecureStore.setItemAsync(TOKEN_KEY, newToken);
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);
        setAuthToken(newToken);
    };

    const login = async (email, password) => {
        const response = await authApi.login({ email, password });
        await persistSession(response.data.token, response.data.user);
        return response.data.user;
    };

    const register = async (fullName, email, password) => {
        const response = await authApi.register({ fullName, email, password });
        return response.data;
    };

    const logout = async () => {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        await SecureStore.deleteItemAsync(USER_KEY);
        setToken(null);
        setUser(null);
        setAuthToken(null);
    };

    return (
        <AuthContext.Provider
            value={{ user, token, isLoading, login, register, logout, persistSession }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used inside AuthProvider');
    }
    return context;
};