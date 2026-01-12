"use client";

import AdminLayout from "@/components/AdminLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Users } from "lucide-react";

const ManageUsers = () => {
    return (
        <ProtectedRoute adminOnly={true}>
            <AdminLayout>
                <div className="p-6 md:p-12">
                    <header className="mb-12">
                        <h1 className="text-5xl font-black text-base-content mb-2 tracking-tighter uppercase">User Base</h1>
                        <p className="text-base-content/60 text-lg font-medium italic underline decoration-primary/30 underline-offset-4">Manage permissions and monitor community growth.</p>
                    </header>

                    <div className="bg-base-200 p-20 rounded-[4rem] text-center border border-primary/5 shadow-inner">
                        <Users size={80} className="mx-auto text-primary/10 mb-6" />
                        <h2 className="text-2xl font-black text-base-content/50 uppercase tracking-widest">Database Syncing...</h2>
                    </div>
                </div>
            </AdminLayout>
        </ProtectedRoute>
    );
};

export default ManageUsers;
