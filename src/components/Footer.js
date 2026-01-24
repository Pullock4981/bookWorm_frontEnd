"use client";

import Link from 'next/link';
import { BookOpen, Github, Facebook, Linkedin, Mail, ChevronRight } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-base-200 text-base-content mt-20 border-t border-base-content/5 relative overflow-hidden">
            {/* Soft Ambient Glow */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="w-full px-4 md:px-12 pt-16 pb-10 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
                    {/* Branding Section */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-2 group w-fit">
                            <div className="p-2 bg-primary rounded-xl text-primary-content group-hover:rotate-12 transition-all duration-300">
                                <BookOpen size={24} />
                            </div>
                            <span className="text-2xl font-black tracking-tighter text-base-content">BookWorm</span>
                        </Link>
                        <p className="text-base-content/70 leading-relaxed font-medium">
                            Your ultimate sanctuary for digital reading. Organize your library, track your progress, and discover your next favorite journey.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="https://github.com/Pullock4981" target="_blank" rel="noopener noreferrer" className="p-3 bg-base-300 hover:bg-primary hover:text-primary-content rounded-xl transition-all duration-300 text-base-content/80">
                                <Github size={18} />
                            </a>
                            <a href="https://www.facebook.com/mahmudashik.pullock" target="_blank" rel="noopener noreferrer" className="p-3 bg-base-300 hover:bg-primary hover:text-primary-content rounded-xl transition-all duration-300 text-base-content/80">
                                <Facebook size={18} />
                            </a>
                            <a href="https://www.linkedin.com/in/ashikpullock/" target="_blank" rel="noopener noreferrer" className="p-3 bg-base-300 hover:bg-primary hover:text-primary-content rounded-xl transition-all duration-300 text-base-content/80">
                                <Linkedin size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-6">
                        <h4 className="text-sm font-black uppercase tracking-[0.2em] text-primary">Platform</h4>
                        <ul className="space-y-4">
                            {[
                                { name: 'Browse Books', href: '/books' },
                                { name: 'My Library', href: '/library' },
                                { name: 'Dashboard', href: '/dashboard' },
                                { name: 'Social Feed', href: '/dashboard' } // Feed is on dashboard
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="flex items-center gap-2 text-base-content/60 hover:text-primary transition-colors group w-fit">
                                        <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-primary" />
                                        <span className="font-bold">{item.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter Section */}
                    <div className="space-y-6">
                        <h4 className="text-sm font-black uppercase tracking-[0.2em] text-primary">Subscribe</h4>
                        <p className="text-base-content/70 font-medium text-sm">
                            Get weekly book recommendations and reading tips directly in your inbox.
                        </p>
                        <div className="relative group w-full">
                            <input
                                type="email"
                                placeholder="Your email..."
                                className="w-full bg-base-100 border border-base-content/10 rounded-2xl py-4 pl-6 pr-14 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-bold text-sm text-base-content placeholder:text-base-content/30"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-primary text-primary-content rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20">
                                <Mail size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-10 border-t border-base-content/10 flex flex-col md:flex-row justify-between items-center gap-6 text-[12px] font-bold text-base-content/50">
                    <div className="flex items-center gap-2">
                        <span>© {currentYear} BookWorm. All rights reserved.</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span>Designed by</span>
                        <a href="https://ashikmahudpullock.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-primary font-black hover:underline transition-all">
                            Syed Ashik Mahmud Pullock
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
