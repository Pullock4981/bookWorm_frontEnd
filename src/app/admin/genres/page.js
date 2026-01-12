"use client";

import AdminLayout from "@/components/AdminLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Tags, Plus } from "lucide-react";

const ManageGenres = () => {
    return (
        <ProtectedRoute adminOnly={true}>
            <AdminLayout>
                <div className="p-6 md:p-12">
                    <div className="py-24 bg-base-200 rounded-[4rem] border-2 border-dashed border-primary/20 text-center">
                        <Tags size={64} className="mx-auto text-primary/30 mb-6" />
                        <h1 className="text-4xl font-black text-base-content mb-4 tracking-tighter">Genre Management</h1>
                        <p className="text-base-content/60 max-w-sm mx-auto mb-10 font-medium">Categorize your library by creating and organizing genres.</p>
                        <button className="btn btn-primary rounded-2xl px-12 font-black shadow-xl shadow-primary/20">
                            <Plus size={20} /> Create New Genre
                        </button>
                    </div>
                </div>
            </AdminLayout>
        </ProtectedRoute>
    );
};

export default ManageGenres;
