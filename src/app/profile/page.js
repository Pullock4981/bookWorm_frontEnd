"use client";

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, Shield, Edit, Camera, MapPin, Phone, Save, X, Image as ImageIcon, BookMarked, User, LayoutDashboard, Settings, Bell, CreditCard, Menu } from 'lucide-react';
import { format } from 'date-fns';
import userService from '@/services/userService';
import statsService from '@/services/statsService';
import Swal from 'sweetalert2';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const ProfilePage = () => {
    const { user, checkUserLoggedIn } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        location: ''
    });

    // Preview State
    const [previews, setPreviews] = useState({
        photo: null,
        coverPhoto: null
    });

    // File Objects to Upload
    const [files, setFiles] = useState({
        photo: null,
        coverPhoto: null
    });

    const fileInputRef = useRef(null); // For Profile Photo
    const coverInputRef = useRef(null); // For Cover Photo

    // Initialize form when user data is available
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                phone: user.phone || '',
                location: user.location || ''
            });
            fetchStats();
        }
    }, [user]);

    const [stats, setStats] = useState(null);

    const fetchStats = async () => {
        try {
            const res = await statsService.getUserStats();
            setStats(res.data.data);
        } catch (error) {
            console.error("Failed to fetch stats", error);
        }
    };

    if (!user) {
        return (
            <div className="h-screen flex items-center justify-center">
                <span className="loading loading-dots loading-lg text-primary"></span>
            </div>
        );
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setPreviews(prev => ({ ...prev, [type]: previewUrl }));
            setFiles(prev => ({ ...prev, [type]: file }));
        }
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const data = new FormData();
            data.append('name', formData.name);
            data.append('phone', formData.phone);
            data.append('location', formData.location);

            if (files.photo) data.append('photo', files.photo);
            if (files.coverPhoto) data.append('coverPhoto', files.coverPhoto);

            await userService.updateProfile(data);
            await checkUserLoggedIn();

            setIsEditing(false);
            setPreviews({ photo: null, coverPhoto: null });
            setFiles({ photo: null, coverPhoto: null });

            Swal.fire({
                icon: 'success',
                title: 'Profile Updated',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000
            });
        } catch (error) {
            console.error(error);
            Swal.fire('Error', error.message || 'Failed to update profile', 'error');
        } finally {
            setLoading(false);
        }
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setFormData({
            name: user.name || '',
            phone: user.phone || '',
            location: user.location || ''
        });
        setPreviews({ photo: null, coverPhoto: null });
        setFiles({ photo: null, coverPhoto: null });
    };

    const sidebarLinks = [
        { name: 'My Profile', href: '/profile', icon: <User size={18} />, active: true },
        { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={18} />, active: false },
        { name: 'Notifications', href: '#', icon: <Bell size={18} />, active: false },
        { name: 'Billing', href: '#', icon: <CreditCard size={18} />, active: false },
        { name: 'Settings', href: '#', icon: <Settings size={18} />, active: false },
    ];

    const SidebarContent = () => (
        <div className="bg-base-100 rounded-[2rem] shadow-sm border border-base-content/5 p-6 h-full lg:h-auto overflow-y-auto">
            <div className="flex items-center justify-between mb-6 px-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/30">Menu</h3>
                <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden btn btn-ghost btn-circle btn-xs text-base-content/40">
                    <X size={16} />
                </button>
            </div>
            <nav className="space-y-2">
                {sidebarLinks.map((link) => (
                    <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setIsSidebarOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${link.active
                                ? 'bg-primary text-primary-content shadow-lg shadow-primary/20'
                                : 'text-base-content/60 hover:bg-primary/5 hover:text-primary'
                            }`}
                    >
                        {link.icon}
                        <span>{link.name}</span>
                    </Link>
                ))}
            </nav>

            <div className="mt-8 pt-8 border-t border-base-content/5 px-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Shield size={16} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-base-content uppercase">Free Tier</p>
                        <p className="text-[9px] font-bold text-base-content/40">Basic Account</p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-base-200 font-sans pb-0 scroll-smooth">
                <Navbar />

                <main className="container mx-auto px-4 py-6 md:py-8 max-w-7xl relative">
                    {/* Mobile Sidebar Toggle (3-line logo) */}
                    <div className="lg:hidden mb-6">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="btn btn-ghost bg-base-100/50 backdrop-blur-md border border-base-content/5 rounded-2xl flex items-center gap-3 px-6 shadow-sm hover:bg-base-100 transition-all group"
                        >
                            <div className="p-2 bg-primary rounded-xl text-primary-content group-active:scale-95 transition-transform">
                                <Menu size={18} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-base-content">Open Menu</span>
                        </button>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">

                        {/* Desktop Sidebar */}
                        <aside className="hidden lg:block lg:w-64 flex-none">
                            <div className="sticky top-28">
                                <SidebarContent />
                            </div>
                        </aside>

                        {/* Mobile Sidebar Overlay/Drawer */}
                        <AnimatePresence>
                            {isSidebarOpen && (
                                <>
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onClick={() => setIsSidebarOpen(false)}
                                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] lg:hidden"
                                    />
                                    <motion.aside
                                        initial={{ x: "-100%" }}
                                        animate={{ x: 0 }}
                                        exit={{ x: "-100%" }}
                                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                        className="fixed top-0 left-0 h-full w-[80%] max-w-xs z-[160] p-4 lg:hidden"
                                    >
                                        <SidebarContent />
                                    </motion.aside>
                                </>
                            )}
                        </AnimatePresence>

                        {/* Right Content Area */}
                        <div className="flex-1 min-w-0">
                            {/* Header Section */}
                            <div className="mb-8">
                                {/* Cover Container - Ultra Fancy */}
                                <div className="relative">
                                    <div className="h-40 md:h-52 rounded-[2rem] overflow-hidden bg-[#2D1B1A] dark:bg-black/20 shadow-lg relative group border border-white/5">
                                        {(previews.coverPhoto || user.coverPhoto) ? (
                                            <img
                                                src={previews.coverPhoto || user.coverPhoto}
                                                className="w-full h-full object-cover"
                                                alt="Cover"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 bg-gradient-to-br from-[#1C1917] via-[#2D1B1A] to-primary/30 flex items-center justify-center overflow-hidden">
                                                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] scale-150"></div>
                                                {/* Ambient Glows */}
                                                <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[100px] animate-pulse"></div>
                                                <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-[80px]"></div>
                                                <BookMarked size={60} className="text-primary opacity-20 relative z-10" />
                                            </div>
                                        )}

                                        {isEditing && (
                                            <button
                                                onClick={() => coverInputRef.current?.click()}
                                                className="absolute top-4 right-6 btn btn-xs bg-black/60 backdrop-blur-md border border-white/10 text-white rounded-lg px-4 hover:bg-black/80 transition-all font-black uppercase tracking-widest text-[9px]"
                                            >
                                                <ImageIcon size={12} className="mr-2" /> Change Cover
                                            </button>
                                        )}
                                        <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'coverPhoto')} />
                                    </div>

                                    {/* Floating Profile Image - Fancy Gold Ring */}
                                    <div className="absolute -bottom-12 left-10 md:left-14">
                                        <div className="relative">
                                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full ring-4 ring-primary shadow-2xl bg-base-300 overflow-hidden relative">
                                                <img
                                                    src={previews.photo || user.photo || `https://ui-avatars.com/api/?name=${user.name}&background=4B2E2B&color=fff`}
                                                    alt={user.name}
                                                    className="w-full h-full object-cover"
                                                />
                                                {isEditing && (
                                                    <div
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer backdrop-blur-sm opacity-0 hover:opacity-100 transition-all duration-300 text-white"
                                                    >
                                                        <Camera size={24} />
                                                    </div>
                                                )}
                                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'photo')} />
                                            </div>
                                            <div className="absolute bottom-2 right-2 w-5 h-5 bg-success border-2 border-base-100 rounded-full shadow-lg"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Edit Profile Trigger */}
                                <div className="flex justify-end mt-4 mr-2">
                                    {!isEditing ? (
                                        <button onClick={() => setIsEditing(true)} className="flex items-center gap-1.5 text-xs font-black uppercase text-base-content/40 hover:text-primary transition-all">
                                            <Edit size={12} /> Edit Profile
                                        </button>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button onClick={cancelEdit} className="btn btn-ghost btn-xs h-8 text-[10px] font-black uppercase" disabled={loading}>Cancel</button>
                                            <button onClick={handleSave} className="btn btn-primary btn-xs h-8 text-primary-content px-4 text-[10px] font-black uppercase" disabled={loading}>
                                                {loading ? <span className="loading loading-spinner h-3 w-3 mr-1"></span> : "Save Changes"}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* User Identity */}
                                <div className="mt-8 ml-1 md:ml-2">
                                    <h1 className="text-2xl md:text-3xl font-black text-base-content tracking-tight">{user.name}</h1>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="badge badge-neutral text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md h-auto">USER</span>
                                        <span className="text-[10px] font-bold text-base-content/40">Member since {format(new Date(user.createdAt || new Date()), 'MMM yyyy')}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Main Content Grid (2 Columns) */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                                {/* Middle/Main Section (Personal Info & Stats) */}
                                <div className="lg:col-span-2 space-y-6">

                                    {/* Personal Information Card */}
                                    <div className="bg-base-100 rounded-[2rem] shadow-sm border border-base-content/5 p-8">
                                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-base-content flex items-center gap-3 mb-8">
                                            <User size={14} className="text-primary" /> Personal Information
                                        </h2>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                                            <div className="space-y-1.5">
                                                <label className="text-[9px] font-black uppercase text-base-content/30 tracking-widest ml-1">Full Name</label>
                                                {isEditing ? (
                                                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="input input-bordered w-full bg-base-200 rounded-xl font-bold text-sm h-11 border-none focus:ring-1 focus:ring-primary" />
                                                ) : (
                                                    <div className="bg-base-200/50 p-3 rounded-xl border border-base-content/5 text-sm font-bold text-base-content h-11 flex items-center">{user.name}</div>
                                                )}
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[9px] font-black uppercase text-base-content/30 tracking-widest ml-1">Email Address</label>
                                                <div className="bg-base-200/50 p-3 rounded-xl border border-base-content/5 text-sm font-bold text-base-content/40 h-11 flex items-center justify-between">
                                                    <span className="truncate">{user.email}</span>
                                                    <span className="text-[8px] font-black uppercase tracking-widest opacity-30">Read-only</span>
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[9px] font-black uppercase text-base-content/30 tracking-widest ml-1">Phone</label>
                                                {isEditing ? (
                                                    <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="input input-bordered w-full bg-base-200 rounded-xl font-bold text-sm h-11 border-none focus:ring-1 focus:ring-primary" placeholder="Mobile number" />
                                                ) : (
                                                    <div className="bg-base-200/50 p-3 rounded-xl border border-base-content/5 text-sm font-bold text-base-content h-11 flex items-center">{user.phone || "Not provided"}</div>
                                                )}
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[9px] font-black uppercase text-base-content/30 tracking-widest ml-1">Location</label>
                                                {isEditing ? (
                                                    <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="input input-bordered w-full bg-base-200 rounded-xl font-bold text-sm h-11 border-none focus:ring-1 focus:ring-primary" placeholder="City, Country" />
                                                ) : (
                                                    <div className="bg-base-200/50 p-3 rounded-xl border border-base-content/5 text-sm font-bold text-base-content h-11 flex items-center">{user.location || "Not set"}</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stat Cards Section */}
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="bg-base-100 p-8 rounded-[2rem] shadow-sm border border-base-content/5 text-center">
                                            <h3 className="text-4xl font-black text-base-content mb-1">{stats?.totalBooksRead || 0}</h3>
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/30">Finished Books</p>
                                        </div>
                                        <div className="bg-base-100 p-8 rounded-[2rem] shadow-sm border border-base-content/5 text-center">
                                            <h3 className="text-4xl font-black text-base-content mb-1">{stats?.totalPagesRead || 0}</h3>
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/30">Reading Pages</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Section (Security & Upgrade) */}
                                <div className="space-y-6">

                                    {/* Account Security Card */}
                                    <div className="bg-base-100 rounded-[2rem] shadow-sm border border-base-content/5 p-8">
                                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-base-content flex items-center gap-3 mb-8">
                                            <Shield size={14} className="text-primary" /> Account Security
                                        </h2>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 bg-base-200 rounded-xl">
                                                <div className="min-w-0">
                                                    <p className="text-[11px] font-black text-base-content">Password</p>
                                                    <p className="text-[9px] font-bold text-base-content/40 truncate">Last changed recently</p>
                                                </div>
                                                <button className="text-[10px] font-black text-primary uppercase tracking-wider ml-4">Change</button>
                                            </div>
                                            <div className="flex items-center justify-between p-4 bg-base-200 rounded-xl">
                                                <div className="min-w-0">
                                                    <p className="text-[11px] font-black text-base-content">2FA</p>
                                                    <p className="text-[9px] font-bold text-base-content/40">Not enabled</p>
                                                </div>
                                                <button className="btn btn-xs btn-ghost text-[10px] font-black uppercase opacity-30 cursor-not-allowed">Off</button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* BookWorm Pro Card - Ultra Fancy */}
                                    <div className="bg-gradient-to-br from-[#1C1917] to-neutral rounded-[2rem] shadow-2xl p-8 text-white relative overflow-hidden group border border-primary/20">
                                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700"></div>
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="p-1.5 bg-primary rounded-lg text-primary-content">
                                                    <Shield size={16} />
                                                </div>
                                                <h3 className="text-lg font-black tracking-tight">BookWorm Pro</h3>
                                            </div>
                                            <p className="text-[11px] font-medium text-base-content/60 mb-8 leading-relaxed">Experience the ultimate library management with premium features.</p>
                                            <button className="w-full py-4 bg-primary text-primary-content hover:scale-[1.02] active:scale-[0.98] transition-all rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-primary/20">
                                                Upgrade Now
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </ProtectedRoute>
    );
};

export default ProfilePage;
