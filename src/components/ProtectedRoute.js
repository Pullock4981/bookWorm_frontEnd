"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push("/login");
            } else if (adminOnly && user.role !== "Admin") {
                router.push("/library");
            }
        }
    }, [user, loading, router, adminOnly]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-base-100">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (!user) return null;
    if (adminOnly && user.role !== "Admin") return null;

    return children;
};

export default ProtectedRoute;
