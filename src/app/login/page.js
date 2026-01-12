"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { LogIn, BookOpen, Mail, Lock } from "lucide-react";

const LoginPage = () => {
    const { login } = useAuth();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await login(formData.email, formData.password);
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-base-100">
            {/* Left side: Branding/Visual */}
            <div className="hidden lg:flex flex-col items-center justify-center bg-primary text-white p-12">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-md text-center"
                >
                    <BookOpen size={120} className="mx-auto mb-8 opacity-90" />
                    <h1 className="text-5xl font-bold mb-6 italic">"A book is a dream that you hold in your hand."</h1>
                    <p className="text-xl opacity-80">— Neil Gaiman</p>
                    <div className="mt-12 space-y-4 text-left border-l-4 border-white/30 pl-6 py-4">
                        <p className="font-semibold text-lg">Join our community of readers:</p>
                        <ul className="list-disc list-inside space-y-2 opacity-80">
                            <li>Track your reading progress</li>
                            <li>Discover personalized recommendations</li>
                            <li>Join the social activity feed</li>
                            <li>Build your eternal library</li>
                        </ul>
                    </div>
                </motion.div>
            </div>

            {/* Right side: Login Form */}
            <div className="flex items-center justify-center p-8 bg-base-100 dark:bg-neutral-900 border-l border-primary/10">
                <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="w-full max-w-md"
                >
                    <div className="flex items-center gap-2 text-primary mb-8 lg:hidden justify-center">
                        <BookOpen size={40} />
                        <span className="text-3xl font-bold">BookWorm</span>
                    </div>

                    <div className="card bg-base-100/50 backdrop-blur-sm border border-primary/10 shadow-xl overflow-hidden">
                        <div className="card-body p-8 sm:p-12">
                            <h2 className="card-title text-3xl font-bold mb-2 flex items-center gap-2">
                                Welcome Back <span className="animate-bounce">👋</span>
                            </h2>
                            <p className="text-neutral-content/60 mb-8">Login to continue your reading journey</p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold flex items-center gap-2">
                                            <Mail size={16} className="text-primary" /> Email Address
                                        </span>
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="reader@bookworm.com"
                                        className="input input-bordered focus:input-primary transition-all w-full"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold flex items-center gap-2">
                                            <Lock size={16} className="text-primary" /> Password
                                        </span>
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="input input-bordered focus:input-primary transition-all w-full"
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                    <label className="label mt-1">
                                        <a href="#" className="label-text-alt link link-hover text-primary">Forgot password?</a>
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    className={`btn btn-primary w-full text-white gap-2 h-14 ${submitting ? 'loading' : ''}`}
                                    disabled={submitting}
                                >
                                    {!submitting && <LogIn size={20} />}
                                    {submitting ? 'Authenticating...' : 'Sign In'}
                                </button>
                            </form>

                            <div className="divider my-8">OR</div>

                            <p className="text-center text-sm text-neutral-content/60">
                                Don't have an account?{" "}
                                <Link href="/register" className="font-bold text-primary hover:underline">
                                    Register Now
                                </Link>
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 text-center text-xs opacity-50 flex flex-wrap justify-center gap-4">
                        <span>&copy; 2026 BookWorm App</span>
                        <a href="#">Privacy</a>
                        <a href="#">Terms</a>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default LoginPage;
