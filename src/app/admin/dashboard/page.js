"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Users, BookText, MessageSquare, TrendingUp, AlertCircle, Loader2 } from "lucide-react";
import statsService from "@/services/statsService";

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeBooks: 0,
        pendingReviews: 0,
        systemHealth: "Good"
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await statsService.getAdminStats();
                setStats(response.data.data);
            } catch (error) {
                console.error("Failed to fetch admin stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const cards = [
        { label: "Total Users", value: stats.totalUsers, icon: <Users />, color: "primary" },
        { label: "Active Books", value: stats.activeBooks, icon: <BookText />, color: "secondary" },
        { label: "Pending Reviews", value: stats.pendingReviews, icon: <MessageSquare />, color: "accent" },
        { label: "System Health", value: stats.systemHealth, icon: <TrendingUp />, color: "success" },
    ];

    return (
        <ProtectedRoute adminOnly={true}>
            <AdminLayout>
                <div className="p-6 md:p-12">
                    <header className="mb-8">
                        <h1 className="text-2xl font-black text-base-content mb-1 tracking-tight">Admin Console</h1>
                        <p className="text-base-content/50 text-sm font-medium">Managing BookWorm Eco-system.</p>
                    </header>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="animate-spin text-primary" size={40} />
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                                {cards.map((stat, idx) => (
                                    <div key={idx} className={`bg-base-200 p-8 rounded-[2rem] border-2 border-${stat.color}/5 shadow-xl`}>
                                        <div className={`p-3 bg-${stat.color}/10 rounded-2xl w-fit mb-4 text-${stat.color}`}>
                                            {stat.icon}
                                        </div>
                                        <h3 className="text-4xl font-black text-base-content mb-1 tracking-tighter">{stat.value}</h3>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40">{stat.label}</p>
                                    </div>
                                ))}
                            </div>

                            {stats.pendingReviews > 0 && (
                                <div className="alert bg-accent/10 border-accent/20 rounded-3xl p-6 mb-12 shadow-lg">
                                    <AlertCircle className="text-accent" />
                                    <div>
                                        <h3 className="font-black text-accent uppercase tracking-widest text-xs">Action Required</h3>
                                        <p className="text-sm font-bold text-base-content/70">
                                            There are {stats.pendingReviews} reviews waiting for moderation. Please review them at your earliest convenience.
                                        </p>
                                    </div>
                                    <button className="btn btn-accent btn-sm rounded-xl font-black text-white">Moderate Now</button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </AdminLayout>
        </ProtectedRoute>
    );
};

export default AdminDashboard;
