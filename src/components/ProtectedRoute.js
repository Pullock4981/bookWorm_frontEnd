"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
        if (!loading && user && adminOnly && user.role?.toLowerCase() !== 'admin') {
            router.push('/dashboard');
        }
    }, [user, loading, router, adminOnly]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-base-100">
                <span className="loading loading-infinity loading-lg text-primary"></span>
            </div>
        );
    }

    if (!user) return null;
    if (adminOnly && user.role?.toLowerCase() !== 'admin') return null;

    return children;
};

export default ProtectedRoute;
