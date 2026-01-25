"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Users, Trash2 } from "lucide-react";
import userService from "@/services/userService";
import Swal from "sweetalert2";

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await userService.getAllUsers();
            setUsers(response.data.data || []);
        } catch (error) {
            console.error("Failed to fetch users:", error);
            Swal.fire("Error", "Failed to load users", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleRoleUpdate = async (user, newRole) => {
        try {
            await userService.updateUserRole(user._id, newRole);
            Swal.fire("Updated", `User role updated to ${newRole}`, "success");
            fetchUsers();
        } catch (error) {
            Swal.fire("Error", "Failed to update role", "error");
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Yes, delete user!"
        });

        if (result.isConfirmed) {
            try {
                await userService.deleteUser(id);
                Swal.fire("Deleted!", "User has been removed.", "success");
                fetchUsers();
            } catch (error) {
                Swal.fire("Error", "Failed to delete user", "error");
            }
        }
    };

    return (
        <ProtectedRoute adminOnly={true}>
            <AdminLayout>
                <div className="p-6 md:p-12 min-h-screen">
                    {/* Header Section */}
                    <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div>
                            <h1 className="text-2xl font-black text-base-content mb-1 tracking-tight">User Base</h1>
                            <p className="text-base-content/50 text-sm font-medium">Manage permissions and monitor community growth.</p>
                        </div>
                        <div className="bg-base-100 px-6 py-3 rounded-2xl font-bold text-base-content/60 border border-base-content/5 shadow-sm">
                            Total Users: <span className="text-primary">{users.length}</span>
                        </div>
                    </header>

                    <div className="bg-base-100/50 backdrop-blur-xl rounded-[2.5rem] overflow-hidden border border-primary/5 shadow-xl relative">
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <span className="loading loading-spinner loading-lg text-primary"></span>
                            </div>
                        ) : users.length === 0 ? (
                            <div className="text-center py-20">
                                <p className="text-base-content/40 font-bold">No users found.</p>
                            </div>
                        ) : (
                            <div className="w-full">
                                {/* Desktop View - Table */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="table table-lg w-full">
                                        <thead className="bg-primary/5 border-b border-primary/10">
                                            <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                                                <th className="py-6 px-10">User</th>
                                                <th>Email</th>
                                                <th>Current Role</th>
                                                <th>Update Role</th>
                                                <th className="text-right px-10">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map((user) => (
                                                <tr key={user._id} className="border-b border-base-content/5 hover:bg-white/5 transition-colors">
                                                    <td className="py-6 px-10">
                                                        <div className="flex items-center gap-4">
                                                            <div className="avatar">
                                                                <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                                                    {user.photo ? (
                                                                        <img src={user.photo} alt={user.name} />
                                                                    ) : (
                                                                        <img src={`https://ui-avatars.com/api/?name=${user.name}&background=random`} alt={user.name} />
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div className="font-bold">{user.name}</div>
                                                                <div className="text-[10px] opacity-40 font-bold uppercase tracking-widest block md:hidden">
                                                                    Joined: {new Date(user.createdAt).toLocaleDateString()}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="font-medium opacity-70">{user.email}</td>
                                                    <td>
                                                        <div className={`badge font-bold ${user.role === 'Admin' ? 'badge-primary' : 'badge-ghost border-base-content/10'}`}>
                                                            {user.role}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <select
                                                            className="select select-sm select-bordered w-full max-w-xs font-bold rounded-lg focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                                                            value={user.role}
                                                            onChange={(e) => handleRoleUpdate(user, e.target.value)}
                                                        >
                                                            <option value="User">User</option>
                                                            <option value="Admin">Admin</option>
                                                        </select>
                                                    </td>
                                                    <td className="text-right px-10">
                                                        <button
                                                            onClick={() => handleDelete(user._id)}
                                                            className="btn btn-ghost btn-sm btn-circle text-error hover:bg-error/10"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile View - Cards */}
                                <div className="md:hidden grid grid-cols-1 gap-4 p-4">
                                    {users.map((user) => (
                                        <div key={user._id} className="bg-base-100 p-6 rounded-[1.5rem] border border-base-content/5 shadow-sm space-y-4">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-3">
                                                    <div className="avatar">
                                                        <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                                            {user.photo ? (
                                                                <img src={user.photo} alt={user.name} />
                                                            ) : (
                                                                <img src={`https://ui-avatars.com/api/?name=${user.name}&background=random`} alt={user.name} />
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-lg leading-tight">{user.name}</div>
                                                        <div className="text-xs font-medium opacity-50">{user.email}</div>
                                                    </div>
                                                </div>
                                                <div className={`badge font-bold ${user.role === 'Admin' ? 'badge-primary' : 'badge-ghost border-base-content/10'}`}>
                                                    {user.role}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 pt-2 border-t border-base-content/5">
                                                <select
                                                    className="select select-sm select-bordered flex-grow font-bold rounded-xl focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                                                    value={user.role}
                                                    onChange={(e) => handleRoleUpdate(user, e.target.value)}
                                                >
                                                    <option value="User">User</option>
                                                    <option value="Admin">Admin</option>
                                                </select>
                                                <button
                                                    onClick={() => handleDelete(user._id)}
                                                    className="btn btn-sm btn-square btn-ghost text-error bg-error/10 hover:bg-error/20 rounded-xl"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </AdminLayout>
        </ProtectedRoute>
    );
};

export default ManageUsers;
