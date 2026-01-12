"use client";

import AdminLayout from "@/components/AdminLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Users, BookText, MessageSquare, TrendingUp, AlertCircle } from "lucide-react";

const AdminDashboard = () => {
    return (
        <ProtectedRoute adminOnly={true}>
            <AdminLayout>
                <div className="p-6 md:p-12">
                    <header className="mb-8">
                        <h1 className="text-2xl font-black text-base-content mb-1 tracking-tight">Admin Console</h1>
                        <p className="text-base-content/50 text-sm font-medium">Managing BookWorm Eco-system.</p>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {[
                            { label: "Total Users", value: "1,280", icon: <Users />, color: "primary" },
                            { label: "Active Books", value: "452", icon: <BookText />, color: "secondary" },
                            { label: "Pending Reviews", value: "18", icon: <MessageSquare />, color: "accent" },
                            { label: "System Health", value: "99%", icon: <TrendingUp />, color: "success" },
                        ].map((stat, idx) => (
                            <div key={idx} className="bg-base-200 p-8 rounded-[2rem] border-2 border-primary/5 shadow-xl">
                                <div className={`p-3 bg-${stat.color}/10 rounded-2xl w-fit mb-4 text-${stat.color}`}>
                                    {stat.icon}
                                </div>
                                <h3 className="text-4xl font-black text-base-content mb-1 tracking-tighter">{stat.value}</h3>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    <div className="alert bg-accent/10 border-accent/20 rounded-3xl p-6 mb-12 shadow-lg">
                        <AlertCircle className="text-accent" />
                        <div>
                            <h3 className="font-black text-accent uppercase tracking-widest text-xs">Action Required</h3>
                            <p className="text-sm font-bold text-base-content/70">There are 18 reviews waiting for moderation. Please review them at your earliest convenience.</p>
                        </div>
                        <button className="btn btn-accent btn-sm rounded-xl font-black text-white">Moderate Now</button>
                    </div>
                </div>
            </AdminLayout>
        </ProtectedRoute>
    );
};

export default AdminDashboard;
