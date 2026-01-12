"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { UserPlus, BookOpen, Mail, Lock, User, Upload } from "lucide-react";

const RegisterPage = () => {
    const { register } = useAuth();
    const [formData, setFormData] = useState({ name: "", email: "", password: "", photo: "" });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await register(formData);
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-base-100">
            {/* Right side: Register Form */}
            <div className="flex items-center justify-center p-8 bg-base-100 dark:bg-neutral-900 border-r border-primary/10 order-2 lg:order-1">
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="w-full max-w-md"
                >
                    <div className="flex items-center gap-2 text-primary mb-8 lg:hidden justify-center">
                        <BookOpen size={40} />
                        <span className="text-3xl font-bold">BookWorm</span>
                    </div>

                    <div className="card bg-base-100/50 backdrop-blur-sm border border-primary/10 shadow-xl">
                        <div className="card-body p-8 sm:p-12">
                            <h2 className="card-title text-3xl font-bold mb-2">Create Account</h2>
                            <p className="text-neutral-content/60 mb-8">Start your personalized library today</p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold flex items-center gap-2">
                                            <User size={16} className="text-primary" /> Full Name
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        className="input input-bordered focus:input-primary transition-all w-full"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
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
                                            <Upload size={16} className="text-primary" /> Profile Photo URL
                                        </span>
                                    </label>
                                    <input
                                        type="url"
                                        placeholder="https://example.com/photo.jpg"
                                        className="input input-bordered focus:input-primary transition-all w-full"
                                        value={formData.photo}
                                        onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                                    />
                                    <label className="label">
                                        <span className="label-text-alt opacity-60 italic">Optional - used for your profile avatar</span>
                                    </label>
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
                                </div>

                                <button
                                    type="submit"
                                    className={`btn btn-primary w-full text-white gap-2 h-14 mt-4 ${submitting ? 'loading' : ''}`}
                                    disabled={submitting}
                                >
                                    {!submitting && <UserPlus size={20} />}
                                    {submitting ? 'Creating Account...' : 'Sign Up'}
                                </button>
                            </form>

                            <p className="text-center text-sm text-neutral-content/60 mt-8">
                                Already have an account?{" "}
                                <Link href="/login" className="font-bold text-primary hover:underline">
                                    Login
                                </Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Left side: Branding/Visual */}
            <div className="hidden lg:flex flex-col items-center justify-center bg-primary text-white p-12 order-1 lg:order-2">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-md text-center"
                >
                    <BookOpen size={120} className="mx-auto mb-8 opacity-90" />
                    <h1 className="text-5xl font-bold mb-6 italic">"Collect books, even if you don't plan on reading them... right away."</h1>
                    <p className="text-xl opacity-80">— Knowledge is power</p>

                    <div className="mt-12 grid grid-cols-2 gap-4 text-left">
                        <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                            <h3 className="font-bold text-lg">Discovery</h3>
                            <p className="text-sm opacity-70">Over 10,000+ titles waiting for you.</p>
                        </div>
                        <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                            <h3 className="font-bold text-lg">Tracking</h3>
                            <p className="text-sm opacity-70">Log every page and keep the streak.</p>
                        </div>
                        <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                            <h3 className="font-bold text-lg">Insights</h3>
                            <p className="text-sm opacity-70">Charts to visualize your growth.</p>
                        </div>
                        <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                            <h3 className="font-bold text-lg">Social</h3>
                            <p className="text-sm opacity-70">See what your bookworm friends are up to.</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default RegisterPage;
