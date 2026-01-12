"use client";

import Link from 'next/link';
import { BookOpen, Github, Twitter, Instagram, Mail, ChevronRight, Heart } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-neutral text-neutral-content mt-20 border-t border-primary/10 relative overflow-hidden">
            {/* Soft Ambient Glow */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-screen-2xl mx-auto px-8 pt-16 pb-10 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Branding Section */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-2 group w-fit">
                            <div className="p-2 bg-primary rounded-xl text-primary-content group-hover:rotate-12 transition-all duration-300">
                                <BookOpen size={24} />
                            </div>
                            <span className="text-2xl font-black tracking-tighter text-neutral-content">BookWorm</span>
                        </Link>
                        <p className="text-neutral-content/70 leading-relaxed font-medium">
                            Your ultimate sanctuary for digital reading. Organize your library, track your progress, and discover your next favorite journey.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="p-3 bg-white/5 hover:bg-accent hover:text-accent-content rounded-xl transition-all duration-300 text-neutral-content/80">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="p-3 bg-white/5 hover:bg-accent hover:text-accent-content rounded-xl transition-all duration-300 text-neutral-content/80">
                                <Github size={18} />
                            </a>
                            <a href="#" className="p-3 bg-white/5 hover:bg-accent hover:text-accent-content rounded-xl transition-all duration-300 text-neutral-content/80">
                                <Instagram size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-6">
                        <h4 className="text-sm font-black uppercase tracking-[0.2em] text-accent">Library</h4>
                        <ul className="space-y-4">
                            {[
                                { name: 'Browse Books', href: '/books' },
                                { name: 'My Shelves', href: '/library' },
                                { name: 'Personal Stats', href: '/dashboard' },
                                { name: 'New Arrivals', href: '/books?sort=newest' }
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="flex items-center gap-2 text-neutral-content/60 hover:text-accent transition-colors group w-fit">
                                        <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-accent" />
                                        <span className="font-bold">{item.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Community Section */}
                    <div className="space-y-6">
                        <h4 className="text-sm font-black uppercase tracking-[0.2em] text-accent">Explore</h4>
                        <ul className="space-y-4">
                            {[
                                { name: 'Social Feed', href: '/social' },
                                { name: 'Reading Goals', href: '/dashboard' },
                                { name: 'Expert Guides', href: '/tutorials' },
                                { name: 'Admin Panel', href: '/admin/dashboard' }
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="flex items-center gap-2 text-neutral-content/60 hover:text-accent transition-colors group w-fit">
                                        <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-accent" />
                                        <span className="font-bold">{item.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter Section */}
                    <div className="space-y-6">
                        <h4 className="text-sm font-black uppercase tracking-[0.2em] text-accent">Subscribe</h4>
                        <p className="text-neutral-content/70 font-medium text-sm">
                            Get weekly book recommendations and reading tips directly in your inbox.
                        </p>
                        <div className="relative group max-w-xs">
                            <input
                                type="email"
                                placeholder="Your email..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pr-12 focus:outline-none focus:border-accent transition-all font-bold text-sm text-neutral-content placeholder:text-neutral-content/30"
                            />
                            <button className="absolute right-2 top-2 p-2 bg-accent text-accent-content rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-accent/10">
                                <Mail size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[12px] font-bold text-neutral-content/50">
                    <div className="flex items-center gap-2">
                        <span>© {currentYear} BookWorm. All rights reserved.</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span>Made with</span>
                        <Heart size={14} className="text-error fill-error animate-pulse" />
                        <span>for Book Lovers</span>
                    </div>
                    <div className="flex items-center gap-8 uppercase tracking-widest text-[10px]">
                        <a href="#" className="hover:text-accent transition-colors">Privacy</a>
                        <a href="#" className="hover:text-accent transition-colors">Terms</a>
                        <a href="#" className="hover:text-accent transition-colors">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
