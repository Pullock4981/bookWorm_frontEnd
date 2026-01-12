"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import Swal from 'sweetalert2';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
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
            setUser(res.data.data);
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
            setUser(res.data.data);
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
            setUser(null);
            router.push('/login');
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, register, login, logout, checkUserLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
