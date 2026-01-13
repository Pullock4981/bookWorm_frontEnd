"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { User, Mail, Lock, UserPlus, Image as ImageIcon, BookOpen, Loader2 } from "lucide-react";

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [photo, setPhoto] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { register, user, loading: authLoading } = useAuth();
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

        const data = new FormData();
        data.append("name", formData.name);
        data.append("email", formData.email);
        data.append("password", formData.password);
        if (photo) {
            data.append("photo", photo);
        }

        try {
            await register(data);
        } catch (err) {
            // Error handled by context
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-100 p-6 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row-reverse border border-primary/5"
            >
                {/* Side Illustration */}
                <div className="md:w-1/2 bg-neutral p-12 text-white flex flex-col justify-center items-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-5 flex flex-wrap gap-8 p-4 rotate-[-12deg] pointer-events-none">
                        {[...Array(20)].map((_, i) => <BookOpen key={i} size={48} />)}
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative z-10 text-center"
                    >
                        <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mb-6 mx-auto shadow-xl">
                            <UserPlus size={40} className="text-white" />
                        </div>
                        <h1 className="text-3xl font-black mb-4">Start Your Story</h1>
                        <p className="text-white/60 text-lg max-w-xs mx-auto leading-relaxed">
                            Join thousands of readers tracking their progress and discovering new adventures daily.
                        </p>
                    </motion.div>
                </div>

                {/* Form Side */}
                <div className="md:w-1/2 p-6 md:p-10 lg:p-14">
                    <div className="mb-8">
                        <Link href="/login" className="btn btn-ghost btn-sm text-primary mb-4 p-0 hover:bg-transparent">
                            ← Back to Login
                        </Link>
                        <h2 className="text-3xl font-black text-neutral mb-2">Create Account</h2>
                        <p className="text-neutral-content/60 font-medium italic">Join the BookWorm community today.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-2 md:space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="form-control">
                                <label className="label py-1"><span className="label-text font-bold">Full Name</span></label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral/30 group-focus-within:text-primary">
                                        <User size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        className="input input-bordered w-full pl-11 h-10 md:h-12 bg-base-100 border-primary/10 focus:border-primary focus:outline-none transition-all text-sm md:text-base"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-control">
                                <label className="label py-1"><span className="label-text font-bold">Email Address</span></label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral/30 group-focus-within:text-primary">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="john@example.com"
                                        className="input input-bordered w-full pl-11 h-10 md:h-12 bg-base-100 border-primary/10 focus:border-primary focus:outline-none transition-all text-sm md:text-base"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-control">
                                <label className="label py-1"><span className="label-text font-bold">Password</span></label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral/30 group-focus-within:text-primary">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="Min 6 characters"
                                        className="input input-bordered w-full pl-11 h-10 md:h-12 bg-base-100 border-primary/10 focus:border-primary focus:outline-none transition-all text-sm md:text-base"
                                        required
                                        minLength={6}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-control">
                                <label className="label py-1">
                                    <span className="label-text font-bold">Profile Photo <span className="text-[10px] opacity-40 uppercase ml-2">(Optional)</span></span>
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral/30 group-focus-within:text-primary">
                                        <ImageIcon size={18} />
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="file-input file-input-bordered w-full pl-11 h-10 md:h-12 bg-base-100 border-primary/10 focus:border-primary focus:outline-none transition-all text-sm"
                                        onChange={(e) => setPhoto(e.target.files[0])}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="btn btn-primary w-full h-11 md:h-12 text-md font-black shadow-xl shadow-primary/10 transition-all flex items-center justify-center"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <>
                                        <UserPlus size={18} className="mr-2" />
                                        Create My Account
                                    </>
                                )}
                            </button>
                        </div>

                    </form>

                    <div className="text-center mt-6 relative z-20">
                        <p className="text-neutral-content/60 text-sm font-medium">
                            Already have an account?{" "}
                            <Link href="/login" className="text-primary font-black hover:underline underline-offset-4 cursor-pointer">
                                Login Here
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default RegisterPage;
