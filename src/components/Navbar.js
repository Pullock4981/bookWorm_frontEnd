"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
    BookOpen, LogOut, User, Library, LayoutDashboard, Sun, Moon,
    Search, Youtube, Users, Menu, X, BookText, Tags, MessageSquare
} from 'lucide-react';
import { useState, useEffect } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [theme, setTheme] = useState('light');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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

    const userLinks = [
        { name: 'Home', href: '/dashboard', icon: <LayoutDashboard size={18} /> },
        { name: 'Browse Books', href: '/books', icon: <Search size={18} /> },
        { name: 'My Library', href: '/library', icon: <Library size={18} /> },
        { name: 'Tutorials', href: '/tutorials', icon: <Youtube size={18} /> },
    ];

    const adminLinks = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
        { name: 'Manage Books', href: '/admin/books', icon: <BookText size={18} /> },
        { name: 'Manage Genres', href: '/admin/genres', icon: <Tags size={18} /> },
        { name: 'Manage Users', href: '/admin/users', icon: <Users size={18} /> },
        { name: 'Moderate Reviews', href: '/admin/reviews', icon: <MessageSquare size={18} /> },
        { name: 'Manage Tutorials', href: '/admin/tutorials', icon: <Youtube size={18} /> },
    ];

    const currentLinks = user?.role?.toLowerCase() === 'admin' ? adminLinks : userLinks;

    return (
        <div className="navbar bg-base-100/90 backdrop-blur-md sticky top-0 z-[100] px-4 md:px-8 h-20 border-b border-primary/10 flex items-center justify-between">
            {/* START: LOGO */}
            <div className="flex-none">
                <Link href={user?.role?.toLowerCase() === 'admin' ? '/admin/dashboard' : '/library'} className="flex items-center gap-2 group">
                    <div className="p-2 bg-primary rounded-xl text-primary-content group-hover:rotate-12 transition-all duration-300 shadow-lg shadow-primary/20">
                        <BookOpen size={24} />
                    </div>
                    <span className="text-xl md:text-2xl font-black text-base-content tracking-tighter">
                        {user?.role?.toLowerCase() === 'admin' ? 'AdminPanel' : 'BookWorm'}
                    </span>
                </Link>
            </div>

            {/* CENTER/END: DESKTOP LINKS & ACTIONS */}
            <div className="hidden lg:flex items-center gap-1">
                <div className="flex items-center gap-1 mr-4">
                    {currentLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="flex items-center gap-2 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-base-content/70 hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200"
                        >
                            {link.icon} {link.name}
                        </Link>
                    ))}
                </div>

                <div className="h-8 w-px bg-primary/10 mx-2"></div>

                <button
                    onClick={toggleTheme}
                    className="btn btn-ghost btn-circle text-base-content hover:bg-primary/10 transition-colors"
                >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                {user ? (
                    <div className="dropdown dropdown-end ml-2">
                        <label tabIndex={0} className="btn btn-ghost btn-circle avatar border-2 border-primary/20 ring ring-primary/10 ring-offset-base-100 ring-offset-2">
                            <div className="w-10 rounded-full">
                                <img src={user.photo || `https://ui-avatars.com/api/?name=${user.name}&background=4B2E2B&color=fff`} alt="Profile" />
                            </div>
                        </label>
                        <ul tabIndex={0} className="mt-4 z-[1] p-3 shadow-2xl menu menu-sm dropdown-content bg-base-100 rounded-2xl w-64 border border-primary/10 backdrop-blur-xl">
                            <div className="p-4 bg-primary/5 rounded-xl mb-2 flex items-center gap-3">
                                <div className="avatar">
                                    <div className="w-8 rounded-full ring ring-primary/20">
                                        <img src={user.photo || `https://ui-avatars.com/api/?name=${user.name}&background=4B2E2B&color=fff`} />
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-black text-base-content text-sm truncate w-32">{user.name}</span>
                                    <span className="text-[9px] uppercase font-black text-primary tracking-widest">{user.role}</span>
                                </div>
                            </div>
                            {user.role?.toLowerCase() !== 'admin' && (
                                <li><Link href="/library" className="py-3 font-bold hover:bg-primary/5 rounded-lg text-base-content"><Library size={18} /> My Library</Link></li>
                            )}
                            {user.role?.toLowerCase() === 'admin' ? (
                                <li><Link href="/admin/dashboard" className="py-3 font-bold hover:bg-primary/5 rounded-lg text-base-content"><LayoutDashboard size={18} /> Admin Dashboard</Link></li>
                            ) : (
                                <li><Link href="/dashboard" className="py-3 font-bold hover:bg-primary/5 rounded-lg text-base-content"><LayoutDashboard size={18} /> My Dashboard</Link></li>
                            )}
                            <div className="divider my-1 opacity-10"></div>
                            <li>
                                <button onClick={logout} className="text-error font-black py-3 hover:bg-error/5 rounded-lg w-full text-left"><LogOut size={18} /> Sign Out</button>
                            </li>
                        </ul>
                    </div>
                ) : (
                    <div className="flex items-center gap-3 ml-2">
                        <Link href="/login" className="btn btn-ghost btn-sm font-bold text-base-content hover:text-primary">Login</Link>
                        <Link href="/register" className="btn btn-primary btn-sm px-6 rounded-xl font-black text-primary-content shadow-lg shadow-primary/30">Join Now</Link>
                    </div>
                )}
            </div>

            {/* MOBILE ACTIONS */}
            <div className="flex lg:hidden items-center gap-2">
                <button
                    onClick={toggleTheme}
                    className="btn btn-ghost btn-circle btn-sm text-base-content"
                >
                    {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                </button>

                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="btn btn-primary btn-square btn-sm rounded-lg shadow-lg shadow-primary/20"
                >
                    {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* MOBILE MENU */}
            {isMenuOpen && (
                <div className="absolute top-20 left-0 w-full bg-base-100 border-b border-primary/10 shadow-2xl lg:hidden flex flex-col p-4 z-50 animate-in slide-in-from-top duration-300">
                    <div className="flex flex-col gap-1">
                        {currentLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-4 font-black uppercase text-sm tracking-widest text-base-content/80 hover:bg-primary/5 rounded-xl transition-all shadow-sm border border-transparent hover:border-primary/10"
                            >
                                <span className="p-2 bg-primary/10 rounded-lg text-primary">{link.icon}</span>
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="divider my-4 opacity-10"></div>

                    {user ? (
                        <div className="p-2">
                            <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-2xl border border-primary/10 mb-4">
                                <img
                                    src={user.photo || `https://ui-avatars.com/api/?name=${user.name}&background=4B2E2B&color=fff`}
                                    className="w-12 h-12 rounded-full border-2 border-primary/20 shadow-md"
                                />
                                <div className="flex flex-col">
                                    <span className="font-black text-base-content truncate w-32">{user.name}</span>
                                    <span className="text-[10px] uppercase font-bold text-primary">{user.role}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => { logout(); setIsMenuOpen(false); }}
                                className="btn btn-error btn-block rounded-xl font-black gap-2 shadow-lg shadow-error/20"
                            >
                                <LogOut size={18} /> Sign Out
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 p-2">
                            <Link href="/login" onClick={() => setIsMenuOpen(false)} className="btn btn-ghost font-black rounded-xl">Login</Link>
                            <Link href="/register" onClick={() => setIsMenuOpen(false)} className="btn btn-primary font-black rounded-xl shadow-lg shadow-primary/20">Join Now</Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Navbar;
