"use client";

import { Youtube, PlayCircle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import tutorialService from "@/services/tutorialService";

const Tutorials = () => {
    const [tutorials, setTutorials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTutorials = async () => {
            try {
                const response = await tutorialService.getAllTutorials();
                // Check if response has data property (standard for this API)
                setTutorials(response.data || []);
            } catch (error) {
                console.error("Failed to load tutorials:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTutorials();
    }, []);

    return (
        <ProtectedRoute>
            <div className="flex flex-col min-h-screen bg-base-100">
                <Navbar />
                <main className="flex-grow max-w-screen-2xl mx-auto px-8 py-12 w-full">
                    <header className="mb-8">
                        <h1 className="text-2xl font-black text-base-content mb-1 tracking-tight">Library Guides</h1>
                        <p className="text-base-content/50 text-sm font-medium">Learn how to make the most of your BookWorm experience.</p>
                    </header>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 gap-4">
                            <Loader2 className="w-12 h-12 text-primary animate-spin" />
                            <p className="font-bold text-primary animate-pulse text-xs uppercase tracking-widest">Loading guides...</p>
                        </div>
                    ) : tutorials.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {tutorials.map((vid) => (
                                <a
                                    key={vid._id}
                                    href={vid.videoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative rounded-[2rem] overflow-hidden bg-base-200 border border-primary/5 hover:shadow-2xl transition-all"
                                >
                                    <div className="aspect-video relative">
                                        <img
                                            src={vid.thumbnailUrl || "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=500"}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            alt={vid.title}
                                        />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <PlayCircle size={64} className="text-white" />
                                        </div>
                                        {vid.duration && (
                                            <span className="absolute bottom-4 right-4 bg-black/80 text-white text-[10px] font-black px-2 py-1 rounded-md">{vid.duration}</span>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest mb-2">
                                            <Youtube size={14} /> Video Guide
                                        </div>
                                        <h3 className="font-black text-base-content text-lg leading-tight group-hover:text-primary transition-colors">{vid.title}</h3>
                                        {vid.description && (
                                            <p className="text-xs text-base-content/50 font-medium mt-2 line-clamp-2">{vid.description}</p>
                                        )}
                                    </div>
                                </a>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-32 bg-base-200/50 rounded-[2.5rem] border-2 border-dashed border-base-content/10">
                            <Youtube className="mx-auto text-base-content/10 mb-4" size={48} />
                            <p className="font-bold text-base-content/30 uppercase tracking-widest">No guides found yet</p>
                        </div>
                    )}
                </main>
                <Footer />
            </div>
        </ProtectedRoute>
    );
};

export default Tutorials;
