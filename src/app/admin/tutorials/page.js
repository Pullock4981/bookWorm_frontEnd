"use client";

import AdminLayout from "@/components/AdminLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Youtube, Plus } from "lucide-react";

const ManageTutorials = () => {
    return (
        <ProtectedRoute adminOnly={true}>
            <AdminLayout>
                <div className="p-6 md:p-12 min-h-screen">
                    <header className="mb-8 flex flex-col md:flex-row justify-between items-end gap-6">
                        <div>
                            <h1 className="text-2xl font-black text-base-content mb-1 tracking-tight">Video Library</h1>
                            <p className="text-base-content/50 text-sm font-medium">Manage tutorial content and embed YouTube guides.</p>
                        </div>
                        <button className="btn btn-primary rounded-2xl px-8 font-black shadow-xl shadow-primary/20">
                            <Plus size={20} /> Add Tutorial
                        </button>
                    </header>

                    <div className="bg-base-100/50 backdrop-blur-xl rounded-[2.5rem] overflow-hidden border border-primary/5 shadow-2xl relative p-20 text-center">
                        <Youtube size={48} className="mx-auto text-primary/10 mb-6" />
                        <h2 className="text-lg font-black text-base-content/50 uppercase tracking-widest">No Tutorials Yet</h2>
                        <p className="text-base-content/30 mt-2 text-sm font-medium">Start by adding your first video guide.</p>
                    </div>
                </div>
            </AdminLayout>
        </ProtectedRoute>
    );
};

export default ManageTutorials;
