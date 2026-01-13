"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import { TrendingUp, BookCheck, FileText, Target, Pencil, Trophy, Users, Star, BookOpen, Clock, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import statsService from "@/services/statsService";
import socialService from "@/services/socialService";
import recommendationService from "@/services/recommendationService";
import Swal from "sweetalert2";
import Link from "next/link";
import Image from "next/image";

const UserDashboard = () => {
    const [stats, setStats] = useState(null);
    const [feed, setFeed] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
    const [goalTarget, setGoalTarget] = useState(30);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [statsRes, feedRes, recRes] = await Promise.all([
                statsService.getUserStats(),
                socialService.getFeed(),
                recommendationService.getRecommendations()
            ]);

            setStats(statsRes.data.data);
            setFeed(feedRes.data || []);
            setRecommendations(recRes.data || []);

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
                        <div className="flex justify-center py-20">
                            <span className="loading loading-spinner text-primary loading-lg"></span>
                        </div>
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
                                                    className="progress progress-white w-full h-4 rounded-full"
                                                    value={stats.goal.current}
                                                    max={stats.goal.target}
                                                ></progress>
                                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest opacity-70">
                                                    <span>0 Books</span>
                                                    <span>{Math.round((stats.goal.current / stats.goal.target) * 100)}% Complete</span>
                                                    <span>{stats.goal.target} Books</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setIsGoalModalOpen(true)}
                                                className="btn bg-white text-primary hover:bg-base-100 border-none rounded-xl font-bold px-8"
                                            >
                                                Start Challenge
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </section>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                                {[
                                    { label: "Books Read", value: stats?.totalBooksRead || 0, icon: <BookCheck />, color: "success" },
                                    { label: "Pages Read", value: stats?.totalPagesRead || 0, icon: <FileText />, color: "info" },
                                    { label: "Average Rating", value: stats?.avgRatingGiven || "N/A", icon: <TrendingUp />, color: "warning" },
                                ].map((stat, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-base-100 p-8 rounded-[2rem] border border-base-content/5 shadow-lg group hover:border-primary/20 transition-all"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`p-4 bg-${stat.color}/10 text-${stat.color} rounded-2xl group-hover:scale-110 transition-transform`}>
                                                {stat.icon}
                                            </div>
                                        </div>
                                        <h3 className="text-4xl font-black text-base-content mb-1 tracking-tighter">{stat.value}</h3>
                                        <p className="text-xs font-black uppercase tracking-widest text-base-content/40">{stat.label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Two Column Layout: Feed & Recommendations */}
                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-12">
                                {/* Left: Community Feed */}
                                <div className="xl:col-span-2 space-y-6">
                                    <h2 className="text-2xl font-black flex items-center gap-3">
                                        <span className="p-2 bg-secondary/10 text-secondary rounded-xl">
                                            <Users size={24} />
                                        </span>
                                        Community Activity
                                    </h2>

                                    {feed.length === 0 ? (
                                        <div className="bg-base-100 p-12 rounded-[2rem] border border-base-content/5 text-center">
                                            <p className="text-base-content/50">No recent activity found. Follow users to see their updates!</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {feed.map((item, idx) => (
                                                <div key={idx} className="bg-base-100 p-6 rounded-[2rem] border border-base-content/5 shadow-sm hover:shadow-md transition-all flex gap-4 md:gap-6 items-start">
                                                    <div className="avatar">
                                                        <div className="w-12 h-12 rounded-full ring-2 ring-primary/20 ring-offset-2 ring-offset-base-100">
                                                            <img src={item.user.photo || "https://ui-avatars.com/api/?name=" + item.user.name} alt={item.user.name} />
                                                        </div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm text-base-content/60 mb-1">
                                                            <span className="font-bold text-base-content">{item.user.name}</span>
                                                            <span className="mx-1">•</span>
                                                            {new Date(item.timestamp).toLocaleDateString()}
                                                        </p>

                                                        {item.type === 'review' ? (
                                                            <div>
                                                                <p className="font-medium text-lg mb-2">
                                                                    Rated <span className="font-bold text-primary">"{item.book.title}"</span>
                                                                    <div className="inline-flex items-center ml-2 text-warning gap-1 bg-warning/5 px-2 py-0.5 rounded-lg">
                                                                        <span className="font-bold text-sm">{item.rating}</span> <Star size={12} fill="currentColor" />
                                                                    </div>
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                <p className="font-medium text-lg mb-2">
                                                                    {item.shelf === 'Read' ? 'Finished reading' : `Added to ${item.shelf} list`}: <span className="font-bold text-primary">"{item.book.title}"</span>
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {item.book.coverImage && (
                                                        <div className="hidden md:block w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 shadow-sm relative">
                                                            <img
                                                                src={`${process.env.NEXT_PUBLIC_API_URL}${item.book.coverImage}`}
                                                                alt={item.book.title}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Right: Recommendations */}
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-black flex items-center gap-3">
                                        <span className="p-2 bg-accent/10 text-accent rounded-xl">
                                            <BookOpen size={24} />
                                        </span>
                                        Recommended
                                    </h2>

                                    {recommendations.length > 0 ? (
                                        <div className="space-y-4">
                                            {recommendations.slice(0, 4).map((book) => (
                                                <Link href={`/books/${book._id}`} key={book._id} className="group block bg-base-100 p-4 rounded-[2rem] border border-base-content/5 shadow-sm hover:shadow-lg hover:border-accent/20 transition-all">
                                                    <div className="flex gap-4">
                                                        <div className="w-16 h-24 rounded-xl overflow-hidden shadow-md flex-shrink-0 bg-base-200">
                                                            {book.coverImage && (
                                                                <img
                                                                    src={`${process.env.NEXT_PUBLIC_API_URL}${book.coverImage}`}
                                                                    alt={book.title}
                                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                                />
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col justify-between py-1">
                                                            <div>
                                                                <h3 className="font-bold text-base line-clamp-2 leading-tight mb-1 group-hover:text-accent transition-colors">{book.title}</h3>
                                                                <div className="flex items-center gap-1 text-warning text-xs font-bold">
                                                                    <span>{book.averageRating.toFixed(1)}</span> <Star size={10} fill="currentColor" />
                                                                </div>
                                                            </div>
                                                            <p className="text-[10px] uppercase font-bold text-base-content/40 mt-2 line-clamp-1">
                                                                {book.recommendationReason.replace('Based on your interest in', 'Because you like')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                            <Link href="/books" className="btn btn-ghost btn-block rounded-xl font-bold flex items-center gap-2 group">
                                                Discover More <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="bg-gradient-to-b from-primary/5 to-transparent p-8 rounded-[2.5rem] border border-primary/10 text-center space-y-4">
                                            <div className="mx-auto w-16 h-16 bg-white/50 backdrop-blur-sm rounded-2xl flex items-center justify-center text-primary mb-4 shadow-sm">
                                                <Clock size={32} />
                                            </div>
                                            <h3 className="font-bold text-lg">AI Curator</h3>
                                            <p className="text-sm text-base-content/60 leading-relaxed">
                                                Our AI is analyzing your reading patterns to suggest your next favorite book.
                                            </p>
                                            <Link href="/books" className="btn btn-outline btn-primary rounded-xl btn-sm font-bold mt-4">
                                                Browse All Books
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Goal Modal */}
                    {isGoalModalOpen && (
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
                    )}
                </main>
                <Footer />
            </div>
        </ProtectedRoute>
    );
};

export default UserDashboard;
