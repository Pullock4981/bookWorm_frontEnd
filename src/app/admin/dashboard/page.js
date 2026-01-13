"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import { Users, BookText, MessageSquare, TrendingUp, AlertCircle, Loader2, PieChart as PieChartIcon, BarChart as BarChartIcon } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import statsService from "@/services/statsService";
import AdminSkeleton from "@/components/AdminSkeleton";

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeBooks: 0,
        pendingReviews: 0,
        systemHealth: "Good",
        charts: {
            booksByGenre: [],
            userGrowth: []
        }
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
                        <AdminSkeleton />
                    ) : (
                        <>
                            {stats.pendingReviews > 0 && (
                                <div className="alert bg-accent/10 border-accent/20 rounded-3xl p-6 mb-12 shadow-lg">
                                    <AlertCircle className="text-accent" />
                                    <div>
                                        <h3 className="font-black text-accent uppercase tracking-widest text-xs">Action Required</h3>
                                        <p className="text-sm font-bold text-base-content/70">
                                            There are {stats.pendingReviews} reviews waiting for moderation. Please review them at your earliest convenience.
                                        </p>
                                    </div>
                                    <Link href="/admin/reviews" className="btn btn-accent btn-sm rounded-xl font-black text-white">
                                        Moderate Now
                                    </Link>
                                </div>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                                {cards.map((stat, idx) => (
                                    <div key={idx} className={`bg-base-100/50 backdrop-blur-xl p-8 rounded-[2rem] border border-${stat.color}/10 shadow-lg hover:shadow-xl transition-shadow`}>
                                        <div className={`p-3 bg-${stat.color}/10 rounded-2xl w-fit mb-4 text-${stat.color}`}>
                                            {stat.icon}
                                        </div>
                                        <h3 className="text-4xl font-black text-base-content mb-1 tracking-tighter">{stat.value}</h3>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40">{stat.label}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                                {/* User Growth Chart */}
                                <div className="bg-base-100 p-8 rounded-[2rem] border border-base-content/5 shadow-sm hover:shadow-lg transition-shadow">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="p-2 bg-primary/10 rounded-xl text-primary">
                                            <TrendingUp size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-lg text-base-content">User Growth</h3>
                                            <p className="text-xs text-base-content/50 font-bold uppercase tracking-wider">New Registrations</p>
                                        </div>
                                    </div>
                                    <div className="h-[300px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={stats.charts?.userGrowth || []} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                                <defs>
                                                    <linearGradient id="colorUsersBar" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="var(--p)" stopOpacity={1} />
                                                        <stop offset="100%" stopColor="var(--s)" stopOpacity={0.6} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                                                <XAxis
                                                    dataKey="name"
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fontSize: 12, fontWeight: 'bold', fill: 'currentColor', opacity: 0.5 }}
                                                    dy={10}
                                                />
                                                <YAxis
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fontSize: 12, fontWeight: 'bold', fill: 'currentColor', opacity: 0.5 }}
                                                />
                                                <Tooltip
                                                    cursor={{ fill: 'currentColor', opacity: 0.05, radius: 8 }}
                                                    contentStyle={{
                                                        backgroundColor: 'var(--b1)',
                                                        borderRadius: '12px',
                                                        border: '1px solid var(--b3, #e5e7eb)',
                                                        boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)',
                                                        padding: '12px 16px'
                                                    }}
                                                    itemStyle={{ color: 'var(--p)', fontWeight: 'bold', textTransform: 'capitalize' }}
                                                />
                                                <Bar
                                                    dataKey="users"
                                                    fill="url(#colorUsersBar)"
                                                    radius={[20, 20, 20, 20]}
                                                    barSize={32}
                                                    animationDuration={1500}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Genre Distribution Chart */}
                                <div className="bg-base-100 p-8 rounded-[2rem] border border-base-content/5 shadow-sm hover:shadow-lg transition-shadow">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="p-2 bg-secondary/10 rounded-xl text-secondary">
                                            <PieChartIcon size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-lg text-base-content">Genre Distribution</h3>
                                            <p className="text-xs text-base-content/50 font-bold uppercase tracking-wider">Top Categories</p>
                                        </div>
                                    </div>
                                    <div className="h-[300px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={stats.charts?.booksByGenre || []}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={100}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                    stroke="none"
                                                >
                                                    {(stats.charts?.booksByGenre || []).map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'][index % 5]} />
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
                                                    wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', opacity: 0.7 }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>


                        </>
                    )}
                </div>
            </AdminLayout>
        </ProtectedRoute>
    );
};

export default AdminDashboard;
