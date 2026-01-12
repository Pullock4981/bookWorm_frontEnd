"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import { LayoutDashboard, TrendingUp, BookCheck, Clock } from "lucide-react";
import { motion } from "framer-motion";

const UserDashboard = () => {
    return (
        <ProtectedRoute>
            <div className="flex flex-col min-h-screen bg-base-100">
                <Navbar />
                <main className="flex-grow max-w-7xl mx-auto px-6 py-12 w-full">
                    <header className="mb-12">
                        <h1 className="text-5xl font-black text-base-content mb-2 italic tracking-tighter">Your Dashboard</h1>
                        <p className="text-base-content/60 text-lg font-medium">Welcome back! Here's an overview of your reading journey.</p>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {[
                            { label: "Books Read", value: "12", icon: <BookCheck className="text-success" />, color: "success" },
                            { label: "Current Streak", value: "5 Days", icon: <TrendingUp className="text-primary" />, color: "primary" },
                            { label: "Hours Read", value: "48h", icon: <Clock className="text-accent" />, color: "accent" },
                            { label: "Wishlist", value: "24", icon: <LayoutDashboard className="text-secondary" />, color: "secondary" },
                        ].map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-base-200 p-8 rounded-[2rem] border border-primary/5 shadow-xl hover:shadow-2xl transition-all"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-base-100 rounded-2xl shadow-inner">
                                        {stat.icon}
                                    </div>
                                    <span className={`badge badge-${stat.color} badge-sm font-black`}>+2 this week</span>
                                </div>
                                <h3 className="text-4xl font-black text-base-content mb-1 tracking-tighter">{stat.value}</h3>
                                <p className="text-xs font-black uppercase tracking-widest text-base-content/40">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="bg-primary/5 rounded-[3rem] p-12 text-center border border-primary/10">
                        <h2 className="text-3xl font-black text-base-content mb-4 italic">Recommended for You</h2>
                        <p className="text-base-content/60 mb-8 max-w-md mx-auto font-medium">Coming Soon: AI-powered book recommendations based on your reading history.</p>
                        <div className="flex justify-center gap-4">
                            <button className="btn btn-primary rounded-xl px-8 font-black shadow-lg shadow-primary/20">Explore Now</button>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </ProtectedRoute>
    );
};

export default UserDashboard;
