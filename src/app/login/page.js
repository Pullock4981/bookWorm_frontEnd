"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { LogIn, Mail, Lock, Eye, EyeOff, BookOpen, UserPlus, Loader2 } from "lucide-react";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { login, user, loading: authLoading } = useAuth();
    const router = useRouter();

    // Redirect if already logged in
    useEffect(() => {
        if (!authLoading && user) {
            router.push('/library');
        }
    }, [user, authLoading, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await login(email, password);
        } catch (err) {
            // Error handled by context (Swal)
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-100 p-6 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-5%] w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-primary/5"
            >
                {/* Left Side: Illustration & Branding */}
                <div className="md:w-1/2 bg-primary p-12 text-white flex flex-col justify-center items-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 flex flex-wrap gap-8 p-4 rotate-12 pointer-events-none">
                        {[...Array(20)].map((_, i) => <BookOpen key={i} size={48} />)}
                    </div>

                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="relative z-10 text-center"
                    >
                        <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center mb-6 mx-auto backdrop-blur-md">
                            <BookOpen size={48} />
                        </div>
                        <h1 className="text-4xl font-black mb-4">BookWorm</h1>
                        <p className="text-white/80 text-lg max-w-xs leading-relaxed">
                            Welcome back! Your personal library and reading journey await.
                        </p>
                    </motion.div>
                </div>

                {/* Right Side: Form */}
                <div className="md:w-1/2 p-12 lg:p-16">
                    <div className="mb-10">
                        <h2 className="text-3xl font-black text-neutral mb-2">Member Login</h2>
                        <p className="text-neutral/50 font-bold text-sm">Access your shelves and continue reading.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-bold text-neutral">Email Address</span>
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral/30 group-focus-within:text-primary">
                                    <Mail size={20} />
                                </div>
                                <input
                                    type="email"
                                    placeholder="john@example.com"
                                    className="input input-bordered w-full pl-12 h-14 bg-base-100 border-primary/10 focus:border-primary focus:outline-none focus:ring-2 ring-primary/10 transition-all font-medium"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-bold text-neutral">Password</span>
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral/30 group-focus-within:text-primary">
                                    <Lock size={20} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="input input-bordered w-full pl-12 pr-12 h-14 bg-base-100 border-primary/10 focus:border-primary focus:outline-none focus:ring-2 ring-primary/10 transition-all font-medium"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral/30 hover:text-primary"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            <label className="label mt-1">
                                <a href="#" className="label-text-alt link link-primary font-black hover:text-primary/70 transition-colors">Forgot password?</a>
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full h-14 text-lg font-black shadow-lg shadow-primary/20 transition-all group"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={24} />
                            ) : (
                                <div className="flex items-center justify-center">
                                    <LogIn size={20} className="mr-2 group-hover:translate-x-1 transition-transform" />
                                    <span>Login to Dashboard</span>
                                </div>
                            )}
                        </button>

                        <div className="text-center mt-10 p-8 rounded-[2rem] bg-neutral/5 border border-neutral/10">
                            <p className="text-neutral/40 font-black text-[10px] uppercase tracking-widest mb-4">
                                New to BookWorm?
                            </p>
                            <Link
                                href="/register"
                                className="btn btn-primary btn-outline border-2 w-full rounded-xl font-black hover:bg-primary hover:text-white transition-all h-12"
                            >
                                <UserPlus size={18} className="mr-2" /> Register Here
                            </Link>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
