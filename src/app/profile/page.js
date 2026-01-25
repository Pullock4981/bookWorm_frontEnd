"use client";

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import { User, Mail, Shield, Calendar, Edit, Camera, MapPin, Phone, Save, X, Image as ImageIcon } from 'lucide-react';
import { format } from 'date-fns';
import userService from '@/services/userService';
import statsService from '@/services/statsService';
import Swal from 'sweetalert2';

const ProfilePage = () => {
    const { user, checkUserLoggedIn } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

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
            // Create local preview
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

            // Refresh User Context to get new data
            await checkUserLoggedIn();

            setIsEditing(false);
            setPreviews({ photo: null, coverPhoto: null }); // Clear previews
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
        // Reset form
        setFormData({
            name: user.name || '',
            phone: user.phone || '',
            location: user.location || ''
        });
        setPreviews({ photo: null, coverPhoto: null });
        setFiles({ photo: null, coverPhoto: null });
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-base-200 font-sans pb-20">
                <Navbar />

                <main className="container mx-auto px-4 py-8 max-w-4xl relative">

                    {/* Header Card */}
                    <div className="relative mb-24">
                        {/* Cover Image Placeholder */}
                        <div className="h-56 md:h-80 rounded-3xl bg-neutral shadow-2xl relative overflow-hidden group">
                            {/* Logic for Cover Image: Priority -> Preview -> User's Cover -> Default Pattern */}
                            {(previews.coverPhoto || user.coverPhoto) ? (
                                <img
                                    src={previews.coverPhoto || user.coverPhoto}
                                    className="w-full h-full object-contain bg-base-300/50"
                                    alt="Cover"
                                />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-secondary/80">
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30 mix-blend-overlay"></div>
                                </div>
                            )}

                            {/* Gradient Overlay for Text Readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                            {/* Update Cover Button (Only in Edit Mode) */}
                            {isEditing && (
                                <button
                                    onClick={() => coverInputRef.current?.click()}
                                    className="absolute top-4 right-4 btn btn-sm bg-base-100/30 backdrop-blur-md border-none text-white hover:bg-base-100/50"
                                >
                                    <ImageIcon size={16} className="mr-2" /> Change Cover
                                </button>
                            )}
                            <input
                                type="file"
                                ref={coverInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, 'coverPhoto')}
                            />
                        </div>

                        {/* Profile Info Float - Just Image Now */}
                        <div className="absolute -bottom-16 left-6 md:left-10">
                            <div className="relative group">
                                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full ring-4 ring-base-100 shadow-2xl bg-base-100 overflow-hidden relative">
                                    <img
                                        src={previews.photo || user.photo || `https://ui-avatars.com/api/?name=${user.name}&background=4B2E2B&color=fff`}
                                        alt={user.name}
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Upload Overlay (Edit Mode) */}
                                    {isEditing && (
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer backdrop-blur-[1px] hover:bg-black/60 transition-all"
                                        >
                                            <Camera className="text-white" size={28} />
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, 'photo')}
                                    />
                                </div>
                                {!isEditing && <div className="absolute bottom-2 right-2 w-6 h-6 bg-success border-4 border-base-100 rounded-full"></div>}
                            </div>
                        </div>

                        {/* Action Buttons (Edit/Save) */}
                        <div className="absolute -bottom-12 right-0 md:bottom-auto md:top-full md:mt-4 flex gap-2">
                            {isEditing ? (
                                <>
                                    <button onClick={cancelEdit} className="btn btn-ghost btn-sm text-error" disabled={loading}>
                                        <X size={18} /> Cancel
                                    </button>
                                    <button onClick={handleSave} className="btn btn-primary btn-sm text-white" disabled={loading}>
                                        {loading ? <span className="loading loading-spinner loading-xs"></span> : <Save size={18} />} Save Changes
                                    </button>
                                </>
                            ) : (
                                <button onClick={() => setIsEditing(true)} className="btn btn-ghost btn-sm text-primary hover:bg-primary/10">
                                    <Edit size={18} /> Edit Profile
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Name & Info - Moved Below Image */}
                    <div className="mb-12 px-2 md:px-6 mt-20 md:mt-0">
                        {isEditing ? (
                            <div className="max-w-md space-y-2">
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="input input-lg input-bordered w-full font-black text-2xl md:text-3xl bg-base-200 focus:bg-base-100 transition-all border-primary/20 focus:border-primary"
                                    placeholder="Your Name"
                                />
                                <div className="badge badge-neutral text-white/50 font-bold text-xs uppercase tracking-wider shadow-sm">{user.role}</div>
                            </div>
                        ) : (
                            <>
                                <h1 className="text-3xl md:text-4xl font-black text-base-content tracking-tight">{user.name}</h1>
                                <p className="text-base-content/70 font-bold flex items-center gap-2 mt-2">
                                    <span className="badge badge-primary text-primary-content font-bold text-xs uppercase tracking-wider shadow-sm">{user.role}</span>
                                    <span className="text-sm opacity-70">Member since {format(new Date(user.createdAt || new Date()), 'MMM yyyy')}</span>
                                </p>
                            </>
                        )}
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        {/* Left Column: Personal Info */}
                        <div className="md:col-span-2 space-y-6">
                            {/* About / Bio Card */}
                            <div className="card bg-base-100 shadow-xl border border-base-content/5 overflow-hidden">
                                <div className="card-body p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="card-title text-lg font-bold flex items-center gap-2">
                                            <User size={20} className="text-primary" />
                                            Personal Information
                                        </h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold uppercase text-base-content/40 tracking-wider">Full Name</label>
                                            {isEditing ? (
                                                <p className="font-semibold text-base-content opacity-50 italic">Edited above</p>
                                            ) : (
                                                <p className="font-semibold text-base-content bg-base-200/50 p-3 rounded-xl border border-base-content/5">{user.name}</p>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold uppercase text-base-content/40 tracking-wider">Email Address</label>
                                            <div className="flex items-center gap-2 bg-base-200/50 p-3 rounded-xl border border-base-content/5 overflow-hidden opacity-70" title="Email cannot be changed">
                                                <Mail size={16} className="text-primary/60 shrink-0" />
                                                <p className="font-semibold text-base-content truncate">{user.email}</p>
                                                <span className="badge badge-xs badge-ghost ml-auto">Read-only</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold uppercase text-base-content/40 tracking-wider">Phone</label>
                                            {isEditing ? (
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    placeholder="+880 1XXX..."
                                                    className="input input-sm w-full bg-base-200 focus:bg-base-100 border-base-content/10"
                                                />
                                            ) : (
                                                <div className="flex items-center gap-2 bg-base-200/50 p-3 rounded-xl border border-base-content/5">
                                                    <Phone size={16} className="text-primary/60" />
                                                    <p className="font-semibold text-base-content opacity-80">{user.phone || "Not set"}</p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold uppercase text-base-content/40 tracking-wider">Location</label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    name="location"
                                                    value={formData.location}
                                                    onChange={handleInputChange}
                                                    placeholder="City, Country"
                                                    className="input input-sm w-full bg-base-200 focus:bg-base-100 border-base-content/10"
                                                />
                                            ) : (
                                                <div className="flex items-center gap-2 bg-base-200/50 p-3 rounded-xl border border-base-content/5">
                                                    <MapPin size={16} className="text-primary/60" />
                                                    <p className="font-semibold text-base-content opacity-80">{user.location || "Not set"}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Activity Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="card bg-primary/5 border border-primary/10 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                                    <div className="card-body p-4 items-center text-center">
                                        <span className="text-3xl font-black text-primary group-hover:scale-110 transition-transform">
                                            {stats?.totalBooksRead || 0}
                                        </span>
                                        <span className="text-xs font-bold uppercase tracking-wider text-base-content/60">Finished Books</span>
                                    </div>
                                </div>
                                <div className="card bg-secondary/5 border border-secondary/10 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                                    <div className="card-body p-4 items-center text-center">
                                        <span className="text-3xl font-black text-secondary group-hover:scale-110 transition-transform">
                                            {stats?.totalPagesRead || 0}
                                        </span>
                                        <span className="text-xs font-bold uppercase tracking-wider text-base-content/60">Reading Pages</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Account & Settings */}
                        <div className="space-y-6">
                            <div className="card bg-base-100 shadow-xl border border-base-content/5">
                                <div className="card-body p-6">
                                    <h2 className="card-title text-lg font-bold flex items-center gap-2 mb-4">
                                        <Shield size={20} className="text-secondary" />
                                        Account Security
                                    </h2>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 bg-base-200/30 rounded-xl">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm">Password</span>
                                                <span className="text-xs opacity-60">Last changed recently</span>
                                            </div>
                                            <button className="btn btn-sm btn-ghost text-primary decoration-2 underline-offset-2">Change</button>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-base-200/30 rounded-xl">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm">2FA</span>
                                                <span className="text-xs opacity-60">Not enabled</span>
                                            </div>
                                            <div className="badge badge-sm badge-ghost">Off</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card bg-gradient-to-br from-primary to-primary/80 text-primary-content shadow-xl">
                                <div className="card-body p-6">
                                    <h2 className="card-title text-lg font-bold mb-1">BookWorm Pro</h2>
                                    <p className="text-sm opacity-90 mb-4">Unlock premium features and unlimited library size.</p>
                                    <button className="btn btn-sm btn-secondary border-none shadow-lg text-white">Upgrade Now</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
};

export default ProfilePage;
