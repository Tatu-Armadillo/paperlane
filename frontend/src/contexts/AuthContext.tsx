import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, LoginDto, RegisterDto } from '../types';
import { authApi } from '../api/auth';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (data: LoginDto) => Promise<void>;
    register: (data: RegisterDto) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                const userData = await authApi.getMe();
                setUser(userData);
            } catch (error) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    };

    const login = async (data: LoginDto) => {
        const response = await authApi.login(data);
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
    };

    const register = async (data: RegisterDto) => {
        const response = await authApi.register(data);
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
