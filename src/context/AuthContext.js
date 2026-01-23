"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import Swal from 'sweetalert2';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) setToken(storedToken);
        checkUserLoggedIn();
    }, []);

    const checkUserLoggedIn = async () => {
        try {
            const res = await api.get('/auth/me');
            setUser(res.data.data);
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        try {
            const res = await api.post('/auth/register', userData);
            const user = res.data.data;
            if (user.token) {
                localStorage.setItem('token', user.token);
                setToken(user.token);
            }
            setUser(user);
            Swal.fire({
                icon: 'success',
                title: 'Welcome to BookWorm!',
                text: 'Your account has been created successfully.',
                timer: 2000,
                showConfirmButton: false
            });
            router.push(res.data.data.role === 'Admin' ? '/admin/dashboard' : '/library');
        } catch (err) {
            Swal.fire('Registration Failed', err, 'error');
            throw err;
        }
    };

    const login = async (email, password) => {
        try {
            const res = await api.post('/auth/login', { email, password });
            const user = res.data.data;
            if (user.token) {
                localStorage.setItem('token', user.token);
                setToken(user.token);
            }
            setUser(user);
            Swal.fire({
                icon: 'success',
                title: 'Login Successful',
                timer: 1500,
                showConfirmButton: false
            });
            router.push(res.data.data.role === 'Admin' ? '/admin/dashboard' : '/library');
        } catch (err) {
            Swal.fire('Login Error', err, 'error');
            throw err;
        }
    };

    const logout = async () => {
        try {
            await api.get('/auth/logout');
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
            router.push('/login');
        } catch (err) {
            console.error('Logout error:', err);
            // Fallback: clear local state even if API fails
            setUser(null);
            router.push('/login');
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, register, login, logout, checkUserLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
