'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// URL API proxy
const API_PROXY_URL = '/api/proxy';

// Định nghĩa kiểu dữ liệu người dùng
interface User {
    id: string;
    email: string;
    name: string;
    phone: string;
    picture: string;
    role: string;
}


interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<boolean>;
    checkAuthStatus: () => Promise<void>;
    isAuthenticated: boolean;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        checkAuthStatus();
    }, []);


    const checkAuthStatus = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_PROXY_URL}/auth/admin/me`, {
                method: 'GET',
                credentials: 'include',
            });
            if (response.ok) {
                const data = await response.json();
                setUser(data);
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }

        } catch (error) {
            console.error('Auth check error:', error);
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    }


    // Đăng nhập
    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            setLoading(true);
            const response = await fetch(`${API_PROXY_URL}/auth/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                await checkAuthStatus();
                return true;
            }

            return false;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Đăng xuất
    const logout = async (): Promise<boolean> => {
        try {
            setLoading(true);
            const response = await fetch(`${API_PROXY_URL}/signout`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            });

            if (response.ok) {
                setUser(null);
                setIsAuthenticated(false);
                router.push('/login');
                return true;
            }

            return false;
        } catch (error) {
            console.error('Logout error:', error);
            return false;
        } finally {
            setLoading(false);
        }
    };


    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                checkAuthStatus,
                isAuthenticated
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}