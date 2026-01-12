"use client";

import AdminLayout from "@/components/AdminLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { MessageSquare, ShieldCheck } from "lucide-react";

const ModerateReviews = () => {
    return (
        <ProtectedRoute adminOnly={true}>
            <AdminLayout>
                <div className="p-6 md:p-12">
                    <header className="mb-12">
                        <h1 className="text-5xl font-black text-base-content mb-2 tracking-tighter uppercase leading-none">Review<br />Moderation</h1>
                        <p className="text-base-content/60 text-lg font-medium mt-4">Maintain a healthy community by moderating user reviews.</p>
                    </header>

                    <div className="flex flex-col items-center justify-center py-24 bg-white/5 rounded-[3rem] border-2 border-primary/5">
                        <ShieldCheck size={120} className="text-primary/10 mb-8" />
                        <h2 className="text-xl font-bold text-base-content/40 uppercase tracking-[0.4em]">Queue is Clear</h2>
                    </div>
                </div>
            </AdminLayout>
        </ProtectedRoute>
    );
};

export default ModerateReviews;
