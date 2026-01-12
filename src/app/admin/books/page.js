"use client";

import AdminLayout from "@/components/AdminLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { BookText, Plus } from "lucide-react";

const ManageBooks = () => {
    return (
        <ProtectedRoute adminOnly={true}>
            <AdminLayout>
                <div className="p-6 md:p-12">
                    <header className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
                        <div>
                            <h1 className="text-5xl font-black text-base-content mb-2 tracking-tighter uppercase">Inventory</h1>
                            <p className="text-base-content/60 text-lg font-medium">Manage and organize the entire book catalog.</p>
                        </div>
                        <button className="btn btn-primary rounded-2xl px-8 font-black shadow-xl shadow-primary/20">
                            <Plus size={20} /> Add New Book
                        </button>
                    </header>

                    <div className="bg-base-200 rounded-[3rem] overflow-hidden border border-primary/5 shadow-2xl">
                        <table className="table table-lg w-full">
                            <thead className="bg-primary/5 border-b border-primary/10">
                                <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                                    <th className="py-6 px-10">Book Detail</th>
                                    <th>Genre</th>
                                    <th>Status</th>
                                    <th className="text-right px-10">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-base-100 hover:bg-primary/5 transition-colors group">
                                    <td className="py-6 px-10">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-16 bg-primary/20 rounded shadow-md border border-primary/10"></div>
                                            <div>
                                                <div className="font-black text-base-content leading-tight">Sample Book Title</div>
                                                <div className="text-xs font-bold text-base-content/30 italic">By Author Name</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span className="badge badge-primary badge-outline font-black text-[10px]">Fiction</span></td>
                                    <td><span className="badge badge-success font-black text-[10px] text-white">Active</span></td>
                                    <td className="text-right px-10">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="btn btn-ghost btn-sm btn-circle text-primary"><BookText size={16} /></button>
                                            <button className="btn btn-ghost btn-sm btn-circle text-error">×</button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </AdminLayout>
        </ProtectedRoute>
    );
};

export default ManageBooks;
