"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Users, Book, MessageSquare, Video, ArrowUpRight, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const AdminDashboard = () => {
    // Mock stats for initialization (will be replaced by API calls)
    const stats = [
        { title: "Total Users", value: "1,284", icon: <Users size={24} />, color: "bg-blue-500", trend: "+12%" },
        { title: "Total Books", value: "452", icon: <Book size={24} />, color: "bg-purple-500", trend: "+5%" },
        { title: "Pending Reviews", value: "28", icon: <MessageSquare size={24} />, color: "bg-amber-500", trend: "-2%" },
        { title: "Tutorial Videos", value: "15", icon: <Video size={24} />, color: "bg-rose-500", trend: "0%" },
    ];

    return (
        <ProtectedRoute adminOnly={true}>
            <div className="flex flex-col min-h-screen bg-base-100">
                <Navbar />

                <main className="flex-grow p-6 md:p-12 max-w-7xl mx-auto w-full">
                    <header className="mb-10">
                        <h1 className="text-4xl font-bold text-neutral">Admin Dashboard</h1>
                        <p className="text-neutral-content/60 mt-2">Overview of BookWorm platform performance</p>
                    </header>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="card bg-base-100 shadow-xl border border-primary/10 overflow-hidden group hover:shadow-primary/5 transition-all"
                            >
                                <div className="card-body p-6">
                                    <div className="flex justify-between items-start">
                                        <div className={`p-3 rounded-xl text-white ${stat.color} shadow-lg shadow-${stat.color.split('-')[1]}-200`}>
                                            {stat.icon}
                                        </div>
                                        <div className={`flex items-center gap-1 text-sm font-bold ${stat.trend.startsWith('+') ? 'text-success' : stat.trend === '0%' ? 'text-neutral' : 'text-error'}`}>
                                            {stat.trend} {stat.trend !== '0%' && <TrendingUp size={14} />}
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <h3 className="text-neutral-content/60 text-sm font-medium uppercase tracking-wider">{stat.title}</h3>
                                        <p className="text-3xl font-bold mt-1">{stat.value}</p>
                                    </div>
                                </div>
                                <div className="h-1 w-0 group-hover:w-full transition-all duration-500 bg-primary opacity-50"></div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Quick Actions / Recent Activity Placeholder */}
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 card bg-base-100 shadow-xl border border-primary/10">
                            <div className="card-body">
                                <h3 className="card-title mb-4 flex items-center gap-2">
                                    Platform Growth
                                    <span className="badge badge-primary badge-outline font-normal">Last 30 days</span>
                                </h3>
                                <div className="h-64 flex items-center justify-center bg-base-200/50 rounded-xl border-2 border-dashed border-primary/10">
                                    <p className="text-neutral-content/40 italic flex items-center gap-2">
                                        <TrendingUp size={20} /> Chart data loading...
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="card bg-primary text-white shadow-xl">
                            <div className="card-body">
                                <h3 className="card-title mb-4">Quick Actions</h3>
                                <div className="space-y-3">
                                    <button className="btn btn-outline border-white/30 text-white w-full flex justify-between hover:bg-white/10 hover:border-white">
                                        Add New Book <ArrowUpRight size={18} />
                                    </button>
                                    <button className="btn btn-outline border-white/30 text-white w-full flex justify-between hover:bg-white/10 hover:border-white">
                                        Review Requests <ArrowUpRight size={18} />
                                    </button>
                                    <button className="btn btn-outline border-white/30 text-white w-full flex justify-between hover:bg-white/10 hover:border-white">
                                        Manage Genres <ArrowUpRight size={18} />
                                    </button>
                                </div>
                                <div className="mt-8 pt-8 border-t border-white/20">
                                    <p className="text-sm opacity-80 italic">Tip: Approving reviews promptly increases community engagement by 15%.</p>
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

export default AdminDashboard;
