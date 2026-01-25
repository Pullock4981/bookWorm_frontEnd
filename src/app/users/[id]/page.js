"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useParams, useRouter } from 'next/navigation'; // Read ID from URL
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { User, Mail, MapPin, BookOpen, MessageSquare, UserPlus, UserMinus, Check, Heart, MessageCircle, Eye } from 'lucide-react'; // Icons
import { format } from 'date-fns';
import userService from '@/services/userService';
import socialService from '@/services/socialService';

const PublicProfilePage = () => {
    const { id } = useParams(); // Get user ID from URL
    const router = useRouter();

    // State Definitions
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [activities, setActivities] = useState([]);
    const [activitiesLoading, setActivitiesLoading] = useState(true);

    const { user: currentUser } = useAuth();
    const [activeCommentBox, setActiveCommentBox] = useState(null);
    const [commentText, setCommentText] = useState("");
    const [commentLoading, setCommentLoading] = useState(false);

    useEffect(() => {
        if (id) {
            fetchUserProfile();
            checkFollowingStatus();
            fetchUserActivity();
        }
    }, [id]);


    const fetchUserActivity = async () => {
        try {
            setActivitiesLoading(true);
            const res = await socialService.getUserActivity(id);
            setActivities(res.data || []);
        } catch (error) {
            console.error("Failed to load user activity", error);
        } finally {
            setActivitiesLoading(false);
        }
    };

    const fetchUserProfile = async () => {
        try {
            const res = await userService.getUserById(id);
            setUser(res.data.data);
        } catch (error) {
            console.error("Failed to load user profile", error);
        } finally {
            setLoading(false);
        }
    };

    const checkFollowingStatus = async () => {
        try {
            const res = await socialService.getFollowing();
            const following = res.data || [];
            if (following.some(u => u && u._id === id)) {
                setIsFollowing(true);
            }
        } catch (error) {
            console.error("Failed to check following status", error);
        }
    };

    const handleFollowToggle = async () => {
        if (actionLoading) return;
        setActionLoading(true);
        try {
            if (isFollowing) {
                await socialService.unfollowUser(id);
                setIsFollowing(false);
            } else {
                await socialService.followUser(id);
                setIsFollowing(true);
            }
        } catch (error) {
            console.error("Failed to toggle follow status", error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleMessage = () => {
        router.push(`/chat?startChatWith=${id}`);
    };

    const handleLike = async (activityId) => {
        if (!currentUser) return;
        try {
            const res = await socialService.toggleLike(activityId);
            const updatedActivity = res.data.data;

            setActivities(prev => prev.map(act =>
                act.id === activityId ? { ...act, likes: updatedActivity.likes } : act
            ));
        } catch (error) {
            console.error("Failed to like activity", error);
        }
    };

    const handleCommentSubmit = async (activityId) => {
        if (!commentText.trim() || commentLoading || !currentUser) return;
        setCommentLoading(true);
        try {
            const res = await socialService.addComment(activityId, commentText);
            const updatedComments = res.data.data.comments;

            setActivities(prev => prev.map(act =>
                act.id === activityId ? { ...act, comments: updatedComments } : act
            ));
            setCommentText("");
            setActiveCommentBox(null);
        } catch (error) {
            console.error("Failed to add comment", error);
        } finally {
            setCommentLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-base-200">
                <span className="loading loading-dots loading-lg text-primary"></span>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="h-screen flex items-center justify-center bg-base-200 text-base-content/50 font-bold">
                User not found.
            </div>
        );
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-base-200 font-sans pb-20">
                <Navbar />

                <main className="container mx-auto px-4 py-8 max-w-7xl relative">

                    {/* Header Card (Read Only) */}
                    <div className="relative mb-24">
                        {/* Cover Image */}
                        <div className="h-56 md:h-80 rounded-3xl bg-neutral shadow-2xl relative overflow-hidden group">
                            {user.coverPhoto ? (
                                <img
                                    src={user.coverPhoto}
                                    className="w-full h-full object-contain bg-base-300/50"
                                    alt="Cover"
                                />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-secondary/80">
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30 mix-blend-overlay"></div>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        </div>

                        {/* Profile Photo */}
                        <div className="absolute -bottom-16 left-6 md:left-10 flex items-end gap-6">
                            <div className="relative group">
                                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full ring-4 ring-base-100 shadow-2xl bg-base-100 overflow-hidden relative">
                                    <img
                                        src={user.photo || `https://ui-avatars.com/api/?name=${user.name}&background=4B2E2B&color=fff`}
                                        alt={user.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="absolute bottom-2 right-2 w-6 h-6 bg-success border-4 border-base-100 rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    {/* User Info & Actions */}
                    <div className="mb-12 px-2 md:px-6 mt-20 md:mt-0 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-base-content tracking-tight">{user.name}</h1>
                            <p className="text-base-content/70 font-bold flex items-center gap-2 mt-2">
                                <span className="badge badge-primary text-primary-content font-bold text-xs uppercase tracking-wider shadow-sm">{user.role || 'Member'}</span>
                                <span className="text-sm opacity-70">Joined {format(new Date(user.createdAt || new Date()), 'MMM yyyy')}</span>
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleMessage}
                                className="btn btn-neutral rounded-xl font-bold gap-2 shadow-lg"
                            >
                                <MessageSquare size={18} />
                                Message
                            </button>
                            <button
                                onClick={handleFollowToggle}
                                className={`btn rounded-xl font-bold gap-2 shadow-lg ${isFollowing ? 'btn-ghost border-base-content/20' : 'btn-primary text-white'}`}
                                disabled={actionLoading}
                            >
                                {actionLoading ? (
                                    <span className="loading loading-spinner loading-xs"></span>
                                ) : isFollowing ? (
                                    <>
                                        <Check size={18} />
                                        Following
                                    </>
                                ) : (
                                    <>
                                        <UserPlus size={18} />
                                        Follow
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        {/* Left Column */}
                        <div className="md:col-span-2 space-y-6">
                            <div className="card bg-base-100 shadow-xl border border-base-content/5 overflow-hidden">
                                <div className="card-body p-6">
                                    <h2 className="card-title text-lg font-bold flex items-center gap-2 mb-4">
                                        <User size={20} className="text-primary" />
                                        About
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold uppercase text-base-content/40 tracking-wider">Location</label>
                                            <div className="flex items-center gap-2 bg-base-200/50 p-3 rounded-xl border border-base-content/5">
                                                <MapPin size={16} className="text-primary/60" />
                                                <p className="font-semibold text-base-content opacity-80">{user.location || "Not shared"}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold uppercase text-base-content/40 tracking-wider">Email</label>
                                            <div className="flex items-center gap-2 bg-base-200/50 p-3 rounded-xl border border-base-content/5 overflow-hidden opacity-70">
                                                <Mail size={16} className="text-primary/60" />
                                                <p className="font-semibold text-base-content truncate">{user.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Activity Section */}
                            <div className="card bg-base-100 shadow-xl border border-base-content/5 overflow-hidden">
                                <div className="card-body p-6">
                                    <h2 className="card-title text-lg font-bold flex items-center gap-2 mb-4">
                                        <BookOpen size={20} className="text-primary" />
                                        Recent Activity
                                    </h2>
                                    {activitiesLoading ? (
                                        <div className="space-y-4">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="flex gap-4 animate-pulse">
                                                    <div className="w-12 h-16 bg-base-200 rounded-md"></div>
                                                    <div className="flex-grow space-y-2">
                                                        <div className="h-4 bg-base-200 rounded w-3/4"></div>
                                                        <div className="h-3 bg-base-200 rounded w-1/2"></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : activities.length > 0 ? (
                                        <div className="space-y-4">
                                            {activities.map((act) => (
                                                <div
                                                    key={act.id}
                                                    className="p-4 rounded-2xl bg-base-200/30 border border-base-content/5 flex gap-4 items-start"
                                                >
                                                    {/* Book Cover */}
                                                    <Link href={`/books/${act.book?._id || act.book?.id}`} className="w-12 h-16 shrink-0 rounded-lg shadow-sm overflow-hidden bg-base-300 relative hover:scale-105 transition-transform active:scale-95">
                                                        {act.book?.coverImage ? (
                                                            <img
                                                                src={act.book.coverImage.startsWith('http') ? act.book.coverImage : `${process.env.NEXT_PUBLIC_API_URL}${act.book.coverImage}`}
                                                                alt={act.book.title}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1543004457-450c18290c41?w=200"; }}
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary">
                                                                <BookOpen size={16} />
                                                            </div>
                                                        )}
                                                    </Link>

                                                    {/* Activity Details */}
                                                    <div className="flex-grow min-w-0">
                                                        <div className="text-sm">
                                                            <span className="opacity-70">
                                                                {act.type === 'review' ? (
                                                                    <>
                                                                        <span>Rated and reviewed</span>
                                                                        {act.rating && <span className="text-warning ml-1 font-bold">★ {act.rating}</span>}
                                                                    </>
                                                                ) : (
                                                                    act.shelf === 'Read' ? 'Finished reading' : `Added to ${act.shelf || 'reading'} list`
                                                                )}
                                                            </span>
                                                            <span className="mx-1.5 opacity-30">•</span>
                                                            <Link href={`/books/${act.book?._id || act.book?.id}`} className="font-bold text-base-content hover:text-primary hover:underline">{act.book?.title}</Link>
                                                        </div>

                                                        {/* Review Text Quote */}
                                                        {act.type === 'review' && act.review && (
                                                            <div className="mt-2 text-sm italic opacity-60 bg-base-200/50 p-2 rounded-lg border-l-2 border-primary/40">
                                                                "{act.review}"
                                                            </div>
                                                        )}

                                                        <div className="text-[10px] opacity-40 font-bold uppercase tracking-wider mt-1">
                                                            {format(new Date(act.timestamp), 'MMM d, yyyy')}
                                                        </div>

                                                        {/* Actions */}
                                                        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-base-content/5">
                                                            <button
                                                                onClick={() => handleLike(act.id)}
                                                                className={`flex items-center gap-1.5 text-xs font-bold transition-all ${act.likes?.includes(currentUser?._id) ? 'text-red-500' : 'text-base-content/40 hover:text-base-content/60'}`}
                                                            >
                                                                <Heart size={14} fill={act.likes?.includes(currentUser?._id) ? "currentColor" : "none"} />
                                                                {act.likes?.length || 0}
                                                            </button>
                                                            <button
                                                                onClick={() => setActiveCommentBox(activeCommentBox === act.id ? null : act.id)}
                                                                className="flex items-center gap-1.5 text-xs font-bold text-base-content/40 hover:text-primary transition-all"
                                                            >
                                                                <MessageCircle size={14} />
                                                                {act.comments?.length || 0}
                                                            </button>
                                                            <Link
                                                                href={`/books/${act.book?._id || act.book?.id}`}
                                                                className="flex items-center gap-1.5 text-xs font-bold text-base-content/40 hover:text-secondary transition-all ml-auto"
                                                            >
                                                                <Eye size={14} />
                                                                View Activity
                                                            </Link>
                                                        </div>

                                                        {/* Comment Section */}
                                                        {activeCommentBox === act.id && (
                                                            <div className="mt-3 space-y-3">
                                                                {act.comments?.length > 0 && (
                                                                    <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
                                                                        {act.comments.map((comment, cIdx) => (
                                                                            <div key={cIdx} className="bg-base-200/50 p-2 rounded-lg text-xs">
                                                                                <span className="font-bold mr-1">{comment.user?.name}:</span>
                                                                                <span className="opacity-80">{comment.text}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                                <div className="flex gap-2">
                                                                    <input
                                                                        type="text"
                                                                        className="input input-xs input-bordered w-full rounded-lg"
                                                                        placeholder="Comment..."
                                                                        value={commentText}
                                                                        onChange={(e) => setCommentText(e.target.value)}
                                                                        onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit(act.id)}
                                                                        autoFocus
                                                                    />
                                                                    <button
                                                                        onClick={() => handleCommentSubmit(act.id)}
                                                                        className="btn btn-xs btn-primary rounded-lg"
                                                                        disabled={commentLoading || !commentText.trim()}
                                                                    >
                                                                        Send
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-10 opacity-40">
                                            <p className="text-sm font-bold">No recent activity to show.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Badges / Status */}
                        <div className="space-y-6">
                            <div className="card bg-base-100 shadow-xl border border-base-content/5">
                                <div className="card-body p-6 text-center">
                                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2">
                                        <BookOpen size={32} />
                                    </div>
                                    <h3 className="font-black text-xl">Reader Profile</h3>
                                    <p className="text-sm opacity-60">This user is an active member of the BookWorm community.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </main>
            </div>
        </ProtectedRoute>
    );
};

export default PublicProfilePage;
