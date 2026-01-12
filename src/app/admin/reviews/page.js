"use client";

import AdminLayout from "@/components/AdminLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { MessageSquare, ShieldCheck } from "lucide-react";

const ModerateReviews = () => {
    return (
        <ProtectedRoute adminOnly={true}>
            <AdminLayout>
                <div className="p-6 md:p-12">
                    <header className="mb-8">
                        <h1 className="text-2xl font-black text-base-content mb-1 tracking-tight leading-none">Review Moderation</h1>
                        <p className="text-base-content/50 text-sm font-medium mt-2">Maintain a healthy community by moderating user reviews.</p>
                    </header>

                    <div className="flex flex-col items-center justify-center py-24 bg-white/5 rounded-[3rem] border-2 border-primary/5">
                        <ShieldCheck size={48} className="text-primary/10 mb-8" />
                        <h2 className="text-base font-bold text-base-content/40 uppercase tracking-[0.4em]">Queue is Clear</h2>
                    </div>
                </div>
            </AdminLayout>
        </ProtectedRoute>
    );
};

export default ModerateReviews;
