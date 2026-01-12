"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Youtube, PlayCircle } from "lucide-react";

const Tutorials = () => {
    return (
        <ProtectedRoute>
            <div className="flex flex-col min-h-screen bg-base-100">
                <Navbar />
                <main className="flex-grow max-w-7xl mx-auto px-6 py-12 w-full">
                    <header className="mb-12">
                        <h1 className="text-5xl font-black text-base-content mb-2 italic tracking-tighter">Library Guides</h1>
                        <p className="text-base-content/60 text-lg font-medium">Learn how to make the most of your BookWorm experience.</p>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title: "Getting Started with BookWorm", duration: "5:30", thumb: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=500" },
                            { title: "Managing Your Digital Shelves", duration: "3:45", thumb: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500" },
                            { title: "Connecting with the Community", duration: "4:20", thumb: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=500" },
                        ].map((vid, idx) => (
                            <div key={idx} className="group relative rounded-[2rem] overflow-hidden bg-base-200 border border-primary/5 hover:shadow-2xl transition-all">
                                <div className="aspect-video relative">
                                    <img src={vid.thumb} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={vid.title} />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <PlayCircle size={64} className="text-white" />
                                    </div>
                                    <span className="absolute bottom-4 right-4 bg-black/80 text-white text-[10px] font-black px-2 py-1 rounded-md">{vid.duration}</span>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest mb-2">
                                        <Youtube size={14} /> Video Guide
                                    </div>
                                    <h3 className="font-black text-base-content text-lg leading-tight">{vid.title}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
                <Footer />
            </div>
        </ProtectedRoute>
    );
};

export default Tutorials;
