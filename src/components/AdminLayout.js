"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import {
    BookOpen, LogOut, LayoutDashboard, Sun, Moon,
    BookText, Tags, Users, MessageSquare, Youtube, Menu, X, ChevronLeft
} from 'lucide-react';
import { useState, useEffect } from 'react';

const AdminLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const [theme, setTheme] = useState('light');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

    const adminLinks = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Manage Books', href: '/admin/books', icon: BookText },
        { name: 'Manage Genres', href: '/admin/genres', icon: Tags },
        { name: 'Manage Users', href: '/admin/users', icon: Users },
        { name: 'Moderate Reviews', href: '/admin/reviews', icon: MessageSquare },
        { name: 'Manage Tutorials', href: '/admin/tutorials', icon: Youtube },
    ];

    return (
        <div className="flex h-screen bg-base-100 overflow-hidden">
            {/* Sidebar */}
            <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-base-200 text-base-content transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col border-r border-primary/20 shadow-2xl`}>
                {/* Sidebar Header */}
                <div className="p-6 border-b border-primary/10 flex items-center justify-between">
                    <Link href="/admin/dashboard" className="flex items-center gap-3 group">
                        <div className="p-2 bg-primary rounded-xl text-primary-content group-hover:rotate-12 transition-all duration-300">
                            <BookOpen size={24} />
                        </div>
                        <div>
                            <span className="text-xl font-black tracking-tighter">AdminPanel</span>
                            <p className="text-[9px] uppercase font-bold text-neutral-content/50 tracking-widest">BookWorm</p>
                        </div>
                    </Link>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden btn btn-ghost btn-sm btn-circle"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                    {adminLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all group ${isActive
                                    ? 'bg-accent/10 text-accent border-l-4 border-accent'
                                    : 'text-base-content/70 hover:bg-accent/5 hover:text-accent border-l-4 border-transparent'
                                    }`}
                            >
                                <Icon size={20} className={isActive ? 'text-accent' : 'text-base-content/60 group-hover:text-accent'} />
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile Section */}
                <div className="p-4 border-t border-primary/10">
                    <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-xl mb-3 border border-primary/10">
                        <img
                            src={user?.photo || `https://ui-avatars.com/api/?name=${user?.name}&background=4B2E2B&color=fff`}
                            className="w-10 h-10 rounded-full border-2 border-primary/20"
                            alt="Profile"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="font-black text-base-content text-sm truncate">{user?.name}</p>
                            <p className="text-[9px] uppercase font-bold text-accent tracking-widest">Administrator</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="btn btn-error btn-sm btn-block rounded-xl font-black gap-2"
                    >
                        <LogOut size={16} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header */}
                <header className="h-16 bg-base-100 border-b border-primary/10 flex items-center justify-between px-6 sticky top-0 z-30">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="lg:hidden btn btn-ghost btn-sm btn-circle"
                    >
                        <Menu size={20} />
                    </button>

                    <div className="flex-1 lg:flex-none">
                        <h1 className="text-lg font-black text-base-content uppercase tracking-tight">
                            {adminLinks.find(l => l.href === pathname)?.name || 'Admin Panel'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleTheme}
                            className="btn btn-ghost btn-circle btn-sm text-base-content"
                        >
                            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto bg-base-100">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
