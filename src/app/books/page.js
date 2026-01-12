"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Search, Filter, BookOpen } from "lucide-react";

const BrowseBooks = () => {
    return (
        <ProtectedRoute>
            <div className="flex flex-col min-h-screen bg-base-100">
                <Navbar />
                <main className="flex-grow max-w-7xl mx-auto px-6 py-12 w-full">
                    <header className="mb-12 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div>
                            <h1 className="text-5xl font-black text-base-content mb-2 italic tracking-tighter">Browse Collection</h1>
                            <p className="text-base-content/60 text-lg font-medium">Find your next great adventure among thousands of titles.</p>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <div className="relative flex-grow md:w-80">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/30" size={20} />
                                <input type="text" placeholder="Search title, author..." className="input input-bordered w-full pl-12 rounded-2xl bg-base-200 border-none font-bold" />
                            </div>
                            <button className="btn btn-square btn-base-200 rounded-2xl">
                                <Filter size={20} />
                            </button>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Placeholder for Books */}
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="card bg-base-200 animate-pulse rounded-[2rem] h-96"></div>
                        ))}
                    </div>

                    <div className="text-center py-20">
                        <BookOpen size={48} className="mx-auto text-primary/20 mb-4" />
                        <p className="font-black text-base-content/40 uppercase tracking-[0.3em]">Connecting to Bookstore...</p>
                    </div>
                </main>
                <Footer />
            </div>
        </ProtectedRoute>
    );
};

export default BrowseBooks;
