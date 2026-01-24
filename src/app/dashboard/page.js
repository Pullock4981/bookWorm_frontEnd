"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import { TrendingUp, BookCheck, FileText, Target, Pencil, Trophy, Users, Star, BookOpen, Clock, ChevronRight, Heart, Flame } from "lucide-react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import statsService from "@/services/statsService";
import socialService from "@/services/socialService";
import recommendationService from "@/services/recommendationService";
import favoriteService from "@/services/favoriteService";
import Swal from "sweetalert2";
import Link from "next/link";
import Image from "next/image";
import DashboardSkeleton from "@/components/DashboardSkeleton";

const UserDashboard = () => {
    const [stats, setStats] = useState(null);
    const [feed, setFeed] = useState([]);
    const [feedPage, setFeedPage] = useState(1);
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const [followingList, setFollowingList] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
    const [goalTarget, setGoalTarget] = useState(30);

    const ITEMS_PER_PAGE = 10;
    const totalPages = Math.ceil(feed.length / ITEMS_PER_PAGE);
    const currentFeed = feed.slice((feedPage - 1) * ITEMS_PER_PAGE, feedPage * ITEMS_PER_PAGE);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [statsRes, feedRes, recRes, suggestionsRes, followingRes, favRes] = await Promise.all([
                statsService.getUserStats(),
                socialService.getFeed(),
                recommendationService.getRecommendations(),
                socialService.getSuggestedUsers(),
                socialService.getFollowing(),
                favoriteService.getMyFavorites().catch(() => ({ data: { data: [] } }))
            ]);

            setStats(statsRes.data.data);
            setFeed(feedRes.data || []);
            setRecommendations(recRes.data || []);
            setSuggestedUsers(suggestionsRes.data || []);
            setFollowingList(followingRes.data || []);
            setFavorites(favRes.data.data || []);

            if (statsRes.data.data.goal) {
                setGoalTarget(statsRes.data.data.goal.target);
            }
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSetGoal = async (e) => {
        e.preventDefault();
        try {
            await statsService.updateGoal(goalTarget);
            Swal.fire({
                title: "Goal Set!",
                text: `Your annual reading goal is set to ${goalTarget} books.`,
                icon: "success",
                timer: 2000,
                showConfirmButton: false
            });
            setIsGoalModalOpen(false);
            fetchData();
        } catch (error) {
            Swal.fire("Error", "Failed to set goal", "error");
        }
    };

    const handleFollow = async (userId) => {
        try {
            await socialService.followUser(userId);
            // Optimistic update
            setSuggestedUsers(suggestedUsers.filter(u => u._id !== userId));

            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Following user!',
                showConfirmButton: false,
                timer: 1500
            });

            // Refresh feed to show any historical activity from new user
            const feedRes = await socialService.getFeed();
            setFeed(feedRes.data || []);

            // Refresh following list
            const followingRes = await socialService.getFollowing();
            setFollowingList(followingRes.data || []);

        } catch (error) {
            Swal.fire("Error", "Failed to follow user", "error");
        }
    };

    const handleUnfollow = async (userId) => {
        try {
            await socialService.unfollowUser(userId);
            // Update lists
            setFollowingList(followingList.filter(u => u._id !== userId));
            // Add back to suggestions if appropriate, or just re-fetch
            const suggestionsRes = await socialService.getSuggestedUsers();
            setSuggestedUsers(suggestionsRes.data || []);

            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Unfollowed user',
                showConfirmButton: false,
                timer: 1500
            });

            // Refresh feed
            const feedRes = await socialService.getFeed();
            setFeed(feedRes.data || []);

        } catch (error) {
            Swal.fire("Error", "Failed to unfollow user", "error");
        }
    };

    return (
        <ProtectedRoute>
            <div className="flex flex-col min-h-screen bg-base-100">
                <Navbar />
                <main className="flex-grow max-w-screen-2xl mx-auto px-4 md:px-8 py-12 w-full">
                    <header className="mb-8">
                        <div>
                            <h1 className="text-3xl font-black text-base-content mb-1 tracking-tight">Your Dashboard</h1>
                            <p className="text-base-content/50 text-base font-medium">Welcome back! Here's your reading progress.</p>
                        </div>
                    </header>

                    {loading ? (
                        <DashboardSkeleton />
                    ) : (
                        <>
                            {/* Goals Section */}
                            <section className="mb-12">
                                <div className="bg-gradient-to-r from-primary to-secondary p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden text-primary-content">
                                    <div className="absolute top-0 right-0 p-12 opacity-10">
                                        <Trophy size={180} />
                                    </div>

                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h2 className="text-2xl font-black flex items-center gap-2">
                                                    <Target /> {new Date().getFullYear()} Reading Challenge
                                                </h2>
                                                {stats?.goal ? (
                                                    <p className="opacity-80 font-medium mt-1">
                                                        You have read <strong>{stats.goal.current}</strong> out of <strong>{stats.goal.target}</strong> books.
                                                    </p>
                                                ) : (
                                                    <p className="opacity-80 font-medium mt-1">Set a goal to track your reading journey!</p>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => setIsGoalModalOpen(true)}
                                                className="btn btn-sm btn-circle btn-ghost bg-white/20 hover:bg-white/30 text-white border-none"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                        </div>

                                        {stats?.goal ? (
                                            <div className="space-y-2">
                                                <progress
                                                    className="progress progress-warning w-full h-4 rounded-full bg-black/20"
                                                    value={stats.goal.current}
                                                    max={stats.goal.target}
                                                ></progress>
                                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest opacity-70">
                                                    <span>{stats.goal.current} {stats.goal.current === 1 ? 'Book' : 'Books'}</span>
                                                    <span>{Math.round((stats.goal.current / stats.goal.target) * 100)}% Complete</span>
                                                    <span>{stats.goal.target} Books</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setIsGoalModalOpen(true)}
                                                className="btn bg-base-100 text-primary hover:bg-base-200 border-none rounded-xl font-bold px-8"
                                            >
                                                Start Challenge
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </section>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-12">
                                {[
                                    { label: "Books Read", value: stats?.totalBooksRead || 0, icon: <BookCheck />, color: "success" },
                                    { label: "Pages Read", value: stats?.totalPagesRead || 0, icon: <FileText />, color: "info" },
                                    { label: "Average Rating", value: stats?.avgRatingGiven || "N/A", icon: <TrendingUp />, color: "warning" },
                                    { label: "Reading Streak", value: `${stats?.streak || 0} Days`, icon: <Flame />, color: "error" },
                                ].map((stat, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-base-100 p-4 md:p-8 rounded-2xl md:rounded-[2rem] border border-base-content/5 shadow-lg group hover:border-primary/20 transition-all flex flex-col justify-center text-center md:text-left md:block"
                                    >
                                        <div className="flex justify-center md:justify-between items-start mb-2 md:mb-4">
                                            <div className={`p-2.5 md:p-4 bg-${stat.color}/10 text-${stat.color} rounded-xl md:rounded-2xl group-hover:scale-110 transition-transform`}>
                                                {stat.icon}
                                            </div>
                                        </div>
                                        <h3 className="text-2xl md:text-4xl font-black text-base-content mb-0.5 md:mb-1 tracking-tighter">{stat.value}</h3>
                                        <p className="text-[9px] md:text-xs font-black uppercase tracking-widest text-base-content/40 leading-none">{stat.label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Charts Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
                                {/* Genre Distribution Chart */}
                                <div className="bg-base-100 p-8 rounded-[2.5rem] border border-base-content/5 shadow-sm hover:shadow-lg transition-shadow">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="p-2 bg-primary/10 rounded-xl text-primary">
                                            <Trophy size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-lg text-base-content">Favorite Genres</h3>
                                            <p className="text-xs text-base-content/50 font-bold uppercase tracking-wider">Top categories</p>
                                        </div>
                                    </div>
                                    <div className="h-[300px] w-full">
                                        {stats?.genreBreakdown?.length > 0 ? (
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={stats.genreBreakdown}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={60}
                                                        outerRadius={100}
                                                        paddingAngle={5}
                                                        dataKey="value"
                                                        stroke="none"
                                                    >
                                                        {stats.genreBreakdown.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={['#8B4513', '#D2B48C', '#DEB887', '#F4A460', '#BC8F8F'][index % 5]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip
                                                        contentStyle={{
                                                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                            borderRadius: '16px',
                                                            border: 'none',
                                                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                                                        }}
                                                        itemStyle={{ fontWeight: 'bold' }}
                                                    />
                                                    <Legend
                                                        verticalAlign="bottom"
                                                        height={36}
                                                        iconType="circle"
                                                        wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', opacity: 0.7, textTransform: 'uppercase' }}
                                                    />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <div className="h-full flex items-center justify-center text-base-content/20 font-bold text-sm uppercase tracking-widest">
                                                No genre data yet
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Reading Progress Chart */}
                                <div className="bg-base-100 p-8 rounded-[2.5rem] border border-base-content/5 shadow-sm hover:shadow-lg transition-shadow">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="p-2 bg-secondary/10 rounded-xl text-secondary">
                                            <BookCheck size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-lg text-base-content">Monthly Reading</h3>
                                            <p className="text-xs text-base-content/50 font-bold uppercase tracking-wider">Books finished in {new Date().getFullYear()}</p>
                                        </div>
                                    </div>
                                    <div className="h-[300px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={stats?.monthlyStats || []}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                                                <XAxis
                                                    dataKey="name"
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fontSize: 10, fontWeight: 'bold', fill: 'currentColor', opacity: 0.5 }}
                                                />
                                                <YAxis
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fontSize: 10, fontWeight: 'bold', fill: 'currentColor', opacity: 0.5 }}
                                                />
                                                <Tooltip
                                                    cursor={{ fill: 'currentColor', opacity: 0.05 }}
                                                    contentStyle={{
                                                        backgroundColor: 'var(--b1)',
                                                        borderRadius: '12px',
                                                        border: '1px solid var(--b3)',
                                                        padding: '8px 12px'
                                                    }}
                                                />
                                                <Bar
                                                    dataKey="books"
                                                    fill="#8B4513"
                                                    radius={[4, 4, 0, 0]}
                                                    barSize={20}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                            {/* Minimal Personalized Recommendations Section */}
                            <section className="mb-20">
                                <div className="flex items-end justify-between mb-10 px-2">
                                    <div>
                                        <h2 className="text-xl font-black text-base-content tracking-tight mb-1">Curated For You</h2>
                                        <div className="h-1 w-12 bg-primary rounded-full"></div>
                                    </div>
                                    <Link href="/books" className="text-xs font-bold uppercase tracking-widest text-primary/60 hover:text-primary transition-colors">
                                        View Collection
                                    </Link>
                                </div>

                                {recommendations.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-10">
                                        {recommendations.map((book) => (
                                            <Link
                                                href={`/books/${book._id}`}
                                                key={book._id}
                                                className="group/card block"
                                            >
                                                {/* Professional Minimal Card */}
                                                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-base-200 shadow-md group-hover/card:shadow-2xl group-hover/card:-translate-y-2 transition-all duration-300">
                                                    {book.coverImage && (
                                                        <img
                                                            src={book.coverImage.startsWith('http') ? book.coverImage : `${process.env.NEXT_PUBLIC_API_URL}${book.coverImage}`}
                                                            alt={book.title}
                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = "https://images.unsplash.com/photo-1543004457-450c18290c41?q=80&w=600&auto=format&fit=crop";
                                                            }}
                                                        />
                                                    )}

                                                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                                                        <div className="flex items-center gap-1 text-white font-black text-[10px] uppercase tracking-wider">
                                                            <Star size={10} className="text-warning" fill="currentColor" />
                                                            {book.averageRating?.toFixed(1) || '0.0'}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-3 px-1">
                                                    <h3 className="font-bold text-[11px] md:text-xs text-base-content leading-tight mb-1 truncate">{book.title}</h3>
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-[10px] text-base-content/40 font-medium truncate max-w-[70%]">
                                                            {book.author}
                                                        </p>

                                                        {/* Recommendation Reason Tooltip */}
                                                        {book.recommendationReason && (
                                                            <div className="relative group/reason z-20" onClick={(e) => e.preventDefault()}>
                                                                <div className="cursor-help opacity-40 hover:opacity-100 transition-opacity">
                                                                    <div className="badge badge-xs badge-ghost border-primary/20 bg-primary/5 hover:bg-primary/10 px-1">
                                                                        <span className="text-[8px] font-black uppercase tracking-wider text-primary">Why?</span>
                                                                    </div>
                                                                </div>

                                                                <div className="absolute bottom-full right-0 mb-3 w-56 bg-base-300/95 backdrop-blur-xl text-base-content p-4 rounded-2xl shadow-2xl border border-base-content/10 text-[10px] leading-relaxed font-medium opacity-0 invisible group-hover/reason:opacity-100 group-hover/reason:visible transition-all duration-300 pointer-events-none transform translate-y-3 group-hover/reason:translate-y-0 z-50">
                                                                    <div className="absolute -bottom-1.5 right-4 w-3 h-3 bg-base-300/95 rotate-45 border-r border-b border-base-content/10"></div>
                                                                    <span className="block font-black text-primary mb-1 text-[9px] uppercase tracking-widest">
                                                                        {book.recommendationReason.includes('preference') ? 'Personalized Match' : 'Curated Choice'}
                                                                    </span>
                                                                    {book.recommendationReason}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-base-200/50 p-16 rounded-[3rem] text-center border-2 border-dashed border-base-content/5">
                                        <p className="text-sm font-bold text-base-content/30 uppercase tracking-[0.2em]">Analyzing reading habits...</p>
                                    </div>
                                )}
                            </section>

                            {/* My Favorites Section */}
                            <section className="mb-20">
                                <div className="flex items-end justify-between mb-10 px-2">
                                    <div>
                                        <h2 className="text-xl font-black text-base-content tracking-tight mb-1 flex items-center gap-2">
                                            <Heart className="text-red-500 fill-red-500" size={24} /> My Favorites
                                        </h2>
                                        <div className="h-1 w-12 bg-red-500 rounded-full"></div>
                                    </div>
                                </div>

                                {favorites.length > 0 ? (
                                    <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-4">
                                        {favorites.map((fav) => (
                                            <Link
                                                href={fav.book ? `/books/${fav.book._id}` : '#'}
                                                key={fav._id}
                                                className="group block"
                                            >
                                                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-base-200 shadow-sm group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300">
                                                    {fav.book?.coverImage && (
                                                        <img
                                                            src={fav.book.coverImage.startsWith('http') ? fav.book.coverImage : `${process.env.NEXT_PUBLIC_API_URL}${fav.book.coverImage}`}
                                                            alt={fav.book.title}
                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                        />
                                                    )}
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <div className="bg-white/90 p-2 rounded-full transform scale-50 group-hover:scale-100 transition-transform duration-300 shadow-xl">
                                                            <ChevronRight size={16} className="text-black" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-2 px-1">
                                                    <h3 className="font-bold text-xs text-base-content leading-tight mb-1 truncate">{fav.book?.title}</h3>
                                                    <div className="flex items-center gap-0.5 text-base-content/40">
                                                        <span className="text-[9px] font-bold truncate">{fav.book?.author}</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-base-200/50 p-16 rounded-[3rem] text-center border-2 border-dashed border-base-content/5">
                                        <p className="text-sm font-bold text-base-content/30 uppercase tracking-[0.2em]">No favorites yet.</p>
                                    </div>
                                )}
                            </section>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                                {/* Left Column: Community Feed */}
                                <div className="lg:col-span-2 space-y-6">
                                    <h2 className="text-2xl font-black flex items-center gap-3">
                                        <span className="p-2 bg-secondary/10 text-secondary rounded-xl">
                                            <Users size={24} />
                                        </span>
                                        Community Activity
                                    </h2>

                                    {feed.length === 0 ? (
                                        <div className="bg-base-100 p-8 rounded-[2rem] border border-base-content/5 text-center space-y-6">
                                            <div className="p-4 bg-base-200 rounded-full inline-block">
                                                <Users size={48} className="text-base-content/20" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-black text-base-content">It's quiet here...</h3>
                                                <p className="text-base-content/50 max-w-xs mx-auto">Follow other readers to see their reviews, progress updates, and reading lists!</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="space-y-4 min-h-[800px]">
                                                {currentFeed.map((item, idx) => (
                                                    <div key={idx} className="bg-base-100 p-6 rounded-[2rem] border border-base-content/5 shadow-sm hover:shadow-md transition-all flex gap-4 items-start animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 50}ms` }}>
                                                        <div className="avatar">
                                                            <div className="w-12 h-12 rounded-full ring-2 ring-primary/20 ring-offset-2 ring-offset-base-100">
                                                                <img src={item.user?.photo || "https://ui-avatars.com/api/?name=" + (item.user?.name || "User")} alt={item.user?.name || "User"} />
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm text-base-content/60 mb-1">
                                                                <span className="font-bold text-base-content">{item.user?.name || "Unknown User"}</span>
                                                                <span className="mx-1">•</span>
                                                                {new Date(item.timestamp).toLocaleDateString()}
                                                            </p>

                                                            {item.type === 'review' ? (
                                                                <div>
                                                                    <div className="font-medium text-lg mb-2 flex flex-wrap items-center">
                                                                        Rated <span className="font-bold text-primary mx-1 truncate max-w-[200px]">"{item.book?.title || 'Unknown Book'}"</span>
                                                                        <div className="inline-flex items-center ml-2 text-warning gap-1 bg-warning/5 px-2 py-0.5 rounded-lg shrink-0">
                                                                            <span className="font-bold text-sm">{item.rating}</span> <Star size={12} fill="currentColor" />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div>
                                                                    <div className="font-medium text-lg mb-2">
                                                                        {item.shelf === 'Read' ? 'Finished reading' : `Added to ${item.shelf} list`}: <span className="font-bold text-primary truncate max-w-[200px] inline-block align-bottom">"{item.book?.title || 'Unknown Book'}"</span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                        {item.book?.coverImage && (
                                                            <div className="hidden sm:block w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                                                                <img
                                                                    src={item.book.coverImage.startsWith('http') ? item.book.coverImage : `${process.env.NEXT_PUBLIC_API_URL}${item.book.coverImage}`}
                                                                    alt={item.book?.title || 'Book cover'}
                                                                    className="w-full h-full object-cover"
                                                                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1543004457-450c18290c41?w=200"; }}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Pagination Controls */}
                                            {totalPages > 1 && (
                                                <div className="flex justify-center items-center gap-4 mt-8 pt-4 border-t border-base-content/5">
                                                    <button
                                                        className="btn btn-sm btn-ghost"
                                                        disabled={feedPage === 1}
                                                        onClick={() => setFeedPage(prev => Math.max(1, prev - 1))}
                                                    >
                                                        Previous
                                                    </button>
                                                    <span className="text-sm font-bold opacity-60">Page {feedPage} of {totalPages}</span>
                                                    <button
                                                        className="btn btn-sm btn-ghost"
                                                        disabled={feedPage === totalPages}
                                                        onClick={() => setFeedPage(prev => Math.min(totalPages, prev + 1))}
                                                    >
                                                        Next
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>

                                {/* Right Column: Following & Who to Follow */}
                                <div className="space-y-8">

                                    {/* Following Section */}
                                    <div>
                                        <h2 className="text-xl font-black flex items-center gap-2 text-base-content/80 mb-4">
                                            Following <span className="opacity-40 text-sm font-bold">({followingList.length})</span>
                                        </h2>

                                        {followingList.length > 0 ? (
                                            <div className="bg-base-100 p-2 rounded-[2rem] border border-base-content/5 shadow-sm">
                                                <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-2 space-y-2">
                                                    {followingList.map((user) => (
                                                        <div key={user._id} className="flex items-center justify-between gap-3 p-2 hover:bg-base-200/50 rounded-2xl transition-colors group">
                                                            <div className="flex items-center gap-3 overflow-hidden">
                                                                <div className="avatar">
                                                                    <div className="w-10 h-10 rounded-full ring-1 ring-base-content/10">
                                                                        <img src={user.photo || "https://ui-avatars.com/api/?name=" + user.name} alt={user.name} />
                                                                    </div>
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className="font-bold text-sm truncate text-base-content">{user.name}</p>
                                                                </div>
                                                            </div>
                                                            <button
                                                                onClick={() => handleUnfollow(user._id)}
                                                                className="btn btn-xs bg-base-200 hover:bg-error/10 hover:text-error border-none text-base-content/70"
                                                                title="Unfollow"
                                                            >
                                                                Unfollow
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="p-6 bg-base-200/30 rounded-[2rem] border border-base-content/5 text-center dashed-border">
                                                <p className="text-xs text-base-content/40 font-bold">You aren't following anyone yet.</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Who to Follow */}
                                    <div>
                                        <h2 className="text-xl font-black flex items-center gap-2 text-base-content/80 mb-4">
                                            Discover Readers
                                        </h2>

                                        <div className="bg-base-100 p-6 rounded-[2rem] border border-base-content/5 shadow-sm">
                                            {suggestedUsers.length > 0 ? (
                                                <div className="space-y-6">
                                                    {suggestedUsers.map((user) => (
                                                        <div key={user._id} className="flex items-center justify-between gap-3">
                                                            <div className="flex items-center gap-3 overflow-hidden">
                                                                <div className="avatar placeholder">
                                                                    <div className="bg-neutral text-neutral-content rounded-full w-10">
                                                                        {user.photo ? (
                                                                            <img src={user.photo} alt={user.name} />
                                                                        ) : (
                                                                            <span className="text-xs">{user.name.substring(0, 2).toUpperCase()}</span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className="font-bold text-sm truncate text-base-content">{user.name}</p>
                                                                    <p className="text-[10px] font-bold text-base-content/40 uppercase tracking-wider">Reader</p>
                                                                </div>
                                                            </div>
                                                            <button
                                                                onClick={() => handleFollow(user._id)}
                                                                className="btn btn-xs btn-primary text-white rounded-full px-4 font-bold"
                                                            >
                                                                Follow
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-8">
                                                    <p className="text-sm text-base-content/40 font-medium">No new suggestions.</p>
                                                    <p className="text-xs text-base-content/30 mt-1">You're following everyone!</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Mini Footer / Info */}
                                        <div className="bg-primary/5 p-6 rounded-[2rem] border border-primary/10 mt-6">
                                            <h3 className="font-black text-primary text-sm mb-2">Did you know?</h3>
                                            <p className="text-xs text-base-content/60 leading-relaxed">
                                                Following others helps you discover new books. Their activities will appear in your feed instantly!
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )
                    }

                    {/* Goal Modal */}
                    {
                        isGoalModalOpen && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                                <div className="bg-base-100 w-full max-w-sm p-8 rounded-[2.5rem] shadow-2xl animate-in zoom-in-95">
                                    <h3 className="text-2xl font-black text-base-content mb-2">Set Annual Goal</h3>
                                    <p className="text-base-content/60 text-sm mb-6">How many books do you want to read in {new Date().getFullYear()}?</p>

                                    <form onSubmit={handleSetGoal}>
                                        <div className="flex items-center gap-4 mb-8">
                                            <button
                                                type="button"
                                                className="btn btn-circle btn-ghost bg-base-200"
                                                onClick={() => setGoalTarget(Math.max(1, goalTarget - 1))}
                                            >
                                                -
                                            </button>
                                            <div className="flex-1 text-center">
                                                <span className="text-4xl font-black text-primary">{goalTarget}</span>
                                                <span className="block text-xs font-bold uppercase text-base-content/30 mt-1">Books</span>
                                            </div>
                                            <button
                                                type="button"
                                                className="btn btn-circle btn-ghost bg-base-200"
                                                onClick={() => setGoalTarget(goalTarget + 1)}
                                            >
                                                +
                                            </button>
                                        </div>

                                        <div className="space-y-3">
                                            <button type="submit" className="btn btn-primary w-full rounded-xl font-bold text-lg shadow-lg shadow-primary/20">
                                                Save Goal
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-ghost w-full rounded-xl font-bold"
                                                onClick={() => setIsGoalModalOpen(false)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )
                    }
                </main >
                <Footer />
            </div >
        </ProtectedRoute >
    );
};

export default UserDashboard;
