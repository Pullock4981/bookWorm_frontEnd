"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { BookOpen, LogOut, User, LayoutDashboard, Library, PlayCircle, Search } from "lucide-react";

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <div className="navbar bg-base-100 shadow-md px-4 md:px-8 border-b border-primary/10">
            <div className="flex-1">
                <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
                    <BookOpen size={32} />
                    <span className="hidden sm:inline">BookWorm</span>
                </Link>
            </div>
            <div className="flex-none gap-2">
                {user ? (
                    <div className="flex items-center gap-4">
                        <ul className="menu menu-horizontal px-1 hidden md:flex gap-1 text-neutral-content/70">
                            {user.role === "Admin" ? (
                                <li>
                                    <Link href="/admin/dashboard" className="flex items-center gap-2 hover:bg-primary/10 hover:text-primary transition-all">
                                        <LayoutDashboard size={18} /> Dashboard
                                    </Link>
                                </li>
                            ) : (
                                <>
                                    <li>
                                        <Link href="/library" className="flex items-center gap-2 hover:bg-primary/10 hover:text-primary transition-all">
                                            <Library size={18} /> My Library
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/books" className="flex items-center gap-2 hover:bg-primary/10 hover:text-primary transition-all">
                                            <Search size={18} /> Browse
                                        </Link>
                                    </li>
                                </>
                            )}
                            <li>
                                <Link href="/tutorials" className="flex items-center gap-2 hover:bg-primary/10 hover:text-primary transition-all">
                                    <PlayCircle size={18} /> Tutorials
                                </Link>
                            </li>
                        </ul>

                        <div className="dropdown dropdown-end">
                            <label tabIndex={0} className="btn btn-ghost btn-circle avatar border-primary/20 hover:border-primary border-2">
                                <div className="w-10 rounded-full">
                                    <img src={user.photo || "https://ui-avatars.com/api/?name=" + user.name} alt={user.name} />
                                </div>
                            </label>
                            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-primary/10">
                                <li className="px-4 py-2 font-semibold text-primary truncate">
                                    Hi, {user.name}
                                </li>
                                <div className="divider my-0"></div>
                                <li><a><User size={16} /> Profile</a></li>
                                <li><a onClick={logout} className="text-error"><LogOut size={16} /> Logout</a></li>
                            </ul>
                        </div>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <Link href="/login" className="btn btn-ghost text-primary border-primary/20">Login</Link>
                        <Link href="/register" className="btn btn-primary text-white">Register</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
