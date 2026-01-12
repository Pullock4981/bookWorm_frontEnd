"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { BookOpen, LogOut, User, Library, LayoutDashboard, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    return (
        <div className="navbar bg-base-100/80 backdrop-blur-md sticky top-0 z-50 px-6 py-3 border-b border-primary/10">
            <div className="flex-1">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="p-2 bg-primary rounded-xl text-primary-content group-hover:rotate-12 transition-transform">
                        <BookOpen size={24} />
                    </div>
                    <span className="text-2xl font-black text-base-content tracking-tight">BookWorm</span>
                </Link>
            </div>

            <div className="flex-none gap-2 md:gap-4">
                <button
                    onClick={toggleTheme}
                    className="btn btn-ghost btn-circle text-base-content hover:bg-primary/10"
                    title="Toggle Theme"
                >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                <div className="hidden lg:flex gap-1 mr-4 text-sm font-bold uppercase tracking-wider text-base-content/60">
                    <Link href="/books" className="px-4 py-2 hover:text-primary transition-colors">Browse</Link>
                    <Link href="/social" className="px-4 py-2 hover:text-primary transition-colors">Social</Link>
                    <Link href="/tutorials" className="px-4 py-2 hover:text-primary transition-colors">Guides</Link>
                </div>

                {user ? (
                    <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost btn-circle avatar border-2 border-primary/20">
                            <div className="w-10 rounded-full">
                                <img src={user.photo || `https://ui-avatars.com/api/?name=${user.name}&background=8B4513&color=fff`} alt="Profile" />
                            </div>
                        </label>
                        <ul tabIndex={0} className="mt-3 z-[1] p-3 shadow-xl menu menu-sm dropdown-content bg-base-100 rounded-2xl w-56 border border-primary/10">
                            <li>
                                <div className="flex flex-col items-start p-3 border-b border-base-200 mb-2 text-base-content">
                                    <span className="font-black">{user.name}</span>
                                    <span className="text-[10px] uppercase font-bold text-primary">{user.role}</span>
                                </div>
                            </li>
                            <li><Link href="/library" className="py-3 text-base-content"><Library size={18} /> My Library</Link></li>
                            <li><Link href="/dashboard" className="py-3 text-base-content"><LayoutDashboard size={18} /> Stats Dashboard</Link></li>
                            {user.role === 'Admin' && (
                                <li><Link href="/admin/dashboard" className="py-3 text-accent font-bold"><User size={18} /> Admin Panel</Link></li>
                            )}
                            <li className="mt-2 pt-2 border-t border-base-200">
                                <button onClick={logout} className="text-error font-bold py-3"><LogOut size={18} /> Sign Out</button>
                            </li>
                        </ul>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <Link href="/login" className="btn btn-ghost font-bold text-base-content">Login</Link>
                        <Link href="/register" className="btn btn-primary px-6 rounded-xl font-black text-primary-content shadow-lg shadow-primary/20">Join Now</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
