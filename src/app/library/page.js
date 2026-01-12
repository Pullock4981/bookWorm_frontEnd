"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import libraryService from "@/services/libraryService";
import { BookOpen, Trash2, CheckCircle2, Navigation, Loader2, Bookmark, Flame } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Swal from "sweetalert2";

const MyLibrary = () => {
    const { user } = useAuth();
    const router = useRouter();
    const [libraryItems, setLibraryItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeShelf, setActiveShelf] = useState("Currently Reading");

    const shelves = ["Currently Reading", "Want to Read", "Read"];

    // Redirect admin to dashboard
    useEffect(() => {
        if (user && user.role?.toLowerCase() === 'admin') {
            router.push('/admin/dashboard');
        }
    }, [user, router]);

    useEffect(() => {
        fetchLibrary();
    }, []);

    const fetchLibrary = async () => {
        setLoading(true);
        try {
            const data = await libraryService.getMyLibrary();
            setLibraryItems(data || []);
        } catch (err) {
            console.error('Failed to fetch library:', err?.message || err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProgress = async (id, pagesRead, totalPages) => {
        if (pagesRead > totalPages) {
            return Swal.fire("Wait!", "You can't read more pages than the book has!", "warning");
        }
        try {
            await libraryService.updateProgress(id, pagesRead);
            fetchLibrary();
            if (pagesRead === totalPages) {
                Swal.fire({
                    title: "Congratulations!",
                    text: "You've finished the book! Moving it to 'Read' shelf.",
                    icon: "success",
                    confirmButtonColor: "#8B4513"
                });
            }
        } catch (err) {
            Swal.fire("Error", "Failed to update progress", "error");
        }
    };

    const handleRemove = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You want to remove this book from your library?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#8B4513',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, remove it!'
        });

        if (result.isConfirmed) {
            try {
                await libraryService.removeFromLibrary(id);
                setLibraryItems(libraryItems.filter(item => item._id !== id));
                Swal.fire('Removed!', 'Book has been removed.', 'success');
            } catch (err) {
                Swal.fire('Error', "Failed to remove book", "error");
            }
        }
    };

    const filteredItems = libraryItems.filter(item => item.shelf === activeShelf);

    return (
        <ProtectedRoute>
            <div className="flex flex-col min-h-screen bg-base-100">
                <Navbar />

                <main className="flex-grow max-w-screen-2xl mx-auto px-8 py-12 w-full">
                    <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-2xl font-black text-base-content mb-1 tracking-tight">My Library</h1>
                            <p className="text-base-content/50 text-sm font-medium">Your personal collection and reading progress.</p>
                        </div>
                        <div className="flex bg-base-200 shadow-sm p-1.5 rounded-2xl border border-primary/10">
                            {shelves.map(shelf => (
                                <button
                                    key={shelf}
                                    onClick={() => setActiveShelf(shelf)}
                                    className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 text-sm ${activeShelf === shelf ? 'bg-primary text-primary-content shadow-lg' : 'hover:bg-primary/5 text-base-content/50'}`}
                                >
                                    {shelf}
                                </button>
                            ))}
                        </div>
                    </header>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-4">
                            <span className="loading loading-spinner loading-lg text-primary"></span>
                            <p className="font-bold text-primary animate-pulse uppercase tracking-widest text-xs">Organizing your shelves...</p>
                        </div>
                    ) : filteredItems.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <AnimatePresence mode="popLayout">
                                {filteredItems.map(item => (
                                    <motion.div
                                        key={item._id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all border border-primary/5 group"
                                    >
                                        <div className="flex h-48">
                                            <div className="w-1/3 shrink-0 relative">
                                                <img
                                                    src={item.book?.coverImage || "https://images.unsplash.com/photo-1543004471-2401c3eaa9c8?w=300"}
                                                    alt={item.book?.title}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            </div>
                                            <div className="flex-grow p-4 flex flex-col justify-between">
                                                <div>
                                                    <div className="flex justify-between items-start">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary/80">{item.book?.genre?.name}</span>
                                                        <button onClick={() => handleRemove(item._id)} className="text-error/30 hover:text-error transition-colors">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                    <h3 className="font-black text-base-content leading-tight mt-1 line-clamp-2">{item.book?.title}</h3>
                                                    <p className="text-xs opacity-50 font-bold">by {item.book?.author}</p>
                                                </div>

                                                {item.shelf === "Currently Reading" && (
                                                    <div className="mt-2">
                                                        <div className="flex justify-between text-[10px] font-black mb-1">
                                                            <span>PROGRESS</span>
                                                            <span>{Math.round((item.pagesRead / item.book?.totalPages) * 100) || 0}%</span>
                                                        </div>
                                                        <progress
                                                            className="progress progress-primary w-full h-2 shadow-inner"
                                                            value={item.pagesRead || 0}
                                                            max={item.book?.totalPages || 1}
                                                        ></progress>
                                                        <div className="mt-2 flex items-center gap-1">
                                                            <input
                                                                type="number"
                                                                className="input input-bordered input-xs w-16 font-bold"
                                                                defaultValue={item.pagesRead}
                                                                onBlur={(e) => handleUpdateProgress(item._id, parseInt(e.target.value), item.book?.totalPages)}
                                                            />
                                                            <span className="text-[10px] font-bold opacity-30">/ {item.book?.totalPages}</span>
                                                        </div>
                                                    </div>
                                                )}

                                                {item.shelf === "Read" && (
                                                    <div className="flex items-center gap-1 text-success text-[10px] font-black uppercase mt-2">
                                                        <CheckCircle2 size={12} /> Finished
                                                    </div>
                                                )}

                                                {item.shelf === "Want to Read" && (
                                                    <div className="flex items-center gap-1 text-primary text-[10px] font-black uppercase mt-2 italic">
                                                        <Bookmark size={12} /> Wishlist
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="text-center py-24 bg-white/50 rounded-[2rem] border-2 border-dashed border-primary/20">
                            <BookOpen size={48} className="mx-auto text-primary/20 mb-4" />
                            <h2 className="text-xl font-black text-neutral">Your "{activeShelf}" shelf is empty</h2>
                            <p className="text-neutral-content/60 text-sm mt-1">Discover your next favorite book and start tracking.</p>
                            <Link href="/books" className="btn btn-primary btn-sm mt-6 rounded-lg px-6 font-black text-white">
                                <Navigation size={14} /> Browse Books
                            </Link>
                        </div>
                    )}
                </main>

                <Footer />
            </div>
        </ProtectedRoute>
    );
};

export default MyLibrary;
