"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { BookOpen, LogOut, User, Library, LayoutDashboard, Sun, Moon, Search, Youtube, Users, Menu, X } from 'lucide-react';
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

    const navLinks = [
        { name: 'Home', href: '/dashboard', icon: <LayoutDashboard size={18} /> },
        { name: 'Browse', href: '/books', icon: <Search size={18} /> },
        { name: 'Library', href: '/library', icon: <Library size={18} /> },
        { name: 'Social', href: '/social', icon: <Users size={18} /> },
        { name: 'Guides', href: '/tutorials', icon: <Youtube size={18} /> },
    ];

    return (
        <div className="navbar bg-base-100/90 backdrop-blur-md sticky top-0 z-[100] px-4 md:px-8 h-20 border-b border-primary/10 flex items-center justify-between">
            {/* START: LOGO */}
            <div className="flex-none">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="p-2 bg-primary rounded-xl text-primary-content group-hover:rotate-12 transition-all duration-300 shadow-lg shadow-primary/20">
                        <BookOpen size={24} />
                    </div>
                    <span className="text-xl md:text-2xl font-black text-base-content tracking-tighter">BookWorm</span>
                </Link>
            </div>

            {/* CENTER/END: DESKTOP LINKS & ACTIONS */}
            <div className="hidden lg:flex items-center gap-1">
                <div className="flex items-center gap-1 mr-4">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-bold uppercase tracking-wider text-base-content/70 hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200"
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
                            <li><Link href="/library" className="py-3 font-bold hover:bg-primary/5 rounded-lg"><Library size={18} /> My Library</Link></li>
                            <li><Link href="/dashboard" className="py-3 font-bold hover:bg-primary/5 rounded-lg"><LayoutDashboard size={18} /> Stats Dashboard</Link></li>
                            {user.role === 'Admin' && (
                                <li><Link href="/admin/dashboard" className="py-3 text-accent font-black hover:bg-accent/5 rounded-lg"><User size={18} /> Admin Panel</Link></li>
                            )}
                            <div className="divider my-1 opacity-10"></div>
                            <li>
                                <button onClick={logout} className="text-error font-black py-3 hover:bg-error/5 rounded-lg"><LogOut size={18} /> Sign Out</button>
                            </li>
                        </ul>
                    </div>
                ) : (
                    <div className="flex items-center gap-3 ml-2">
                        <Link href="/login" className="btn btn-ghost btn-sm font-bold text-base-content hover:text-primary">Login</Link>
                        <Link href="/register" className="btn btn-primary btn-sm px-6 rounded-xl font-black text-primary-content shadow-lg shadow-primary/30">Join</Link>
                    </div>
                )}
            </div>

            {/* MOBILE ACTIONS: THEME + HAMBURGER */}
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

            {/* MOBILE MENU OVERLAY */}
            {isMenuOpen && (
                <div className="absolute top-20 left-0 w-full bg-base-100 border-b border-primary/10 shadow-2xl lg:hidden flex flex-col p-4 animate-in slide-in-from-top duration-300">
                    <div className="flex flex-col gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-4 font-black uppercase text-sm tracking-widest text-base-content/80 hover:bg-primary/5 rounded-xl transition-all"
                            >
                                <span className="p-2 bg-primary/10 rounded-lg text-primary">{link.icon}</span>
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="divider my-4 opacity-10"></div>

                    {user ? (
                        <div className="p-2">
                            <Link
                                href="/library"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-4 p-4 bg-primary/5 rounded-2xl border border-primary/10 mb-4"
                            >
                                <img
                                    src={user.photo || `https://ui-avatars.com/api/?name=${user.name}&background=4B2E2B&color=fff`}
                                    className="w-12 h-12 rounded-full border-2 border-primary/20"
                                />
                                <div className="flex flex-col">
                                    <span className="font-black text-base-content">{user.name}</span>
                                    <span className="text-[10px] uppercase font-bold text-primary">{user.role}</span>
                                </div>
                            </Link>
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
                            <Link href="/register" onClick={() => setIsMenuOpen(false)} className="btn btn-primary font-black rounded-xl shadow-lg shadow-primary/20">Join</Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Navbar;
