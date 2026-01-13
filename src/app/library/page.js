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
                setLibraryItems(libraryItems.filter(item => item.book._id !== id));
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'Book removed from library',
                    showConfirmButton: false,
                    timer: 2000
                });
            } catch (err) {
                Swal.fire('Error', "Failed to remove book", "error");
            }
        }
    };

    const handleStartReading = async (id) => {
        try {
            await libraryService.addToLibrary(id, "Currently Reading");
            fetchLibrary();
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Book moved to Currently Reading',
                showConfirmButton: false,
                timer: 2000
            });
            setActiveShelf("Currently Reading");
        } catch (err) {
            Swal.fire("Error", "Failed to start reading", "error");
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
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            <AnimatePresence mode="popLayout">
                                {filteredItems.map(item => (
                                    <motion.div
                                        key={item._id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="group relative bg-base-200/40 backdrop-blur-sm rounded-3xl border border-base-content/5 overflow-hidden shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all duration-500"
                                    >
                                        <div className="flex h-full sm:h-52 flex-col sm:flex-row">
                                            {/* Book Cover */}
                                            <Link href={`/books/${item.book?._id}`} className="sm:w-36 w-full h-48 sm:h-full shrink-0 relative overflow-hidden group-hover:shadow-lg transition-all duration-500">
                                                <img
                                                    src={item.book?.coverImage || "https://images.unsplash.com/photo-1543004471-2401c3eaa9c8?w=300"}
                                                    alt={item.book?.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span className="bg-white/90 text-primary text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">VIEW</span>
                                                </div>
                                            </Link>

                                            {/* Content */}
                                            <div className="flex-grow p-5 flex flex-col justify-between h-auto sm:h-full">
                                                <div className="space-y-1">
                                                    <div className="flex justify-between items-start">
                                                        <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary font-bold text-[9px] uppercase tracking-wider">{item.book?.genre?.name || 'BOOK'}</span>
                                                        <button
                                                            onClick={(e) => { e.preventDefault(); handleRemove(item.book._id); }}
                                                            className="text-base-content/20 hover:text-error transition-colors"
                                                            title="Remove from library"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                    <Link href={`/books/${item.book?._id}`}>
                                                        <h3 className="font-bold text-base-content leading-tight hover:text-primary transition-colors line-clamp-1 mt-1 text-lg" title={item.book?.title}>{item.book?.title}</h3>
                                                    </Link>
                                                    <p className="text-xs font-medium text-base-content/50 uppercase tracking-wide truncate">by {item.book?.author}</p>
                                                </div>

                                                <div className="mt-4">
                                                    {item.shelf === "Currently Reading" ? (
                                                        <div className="space-y-3">
                                                            <div className="flex justify-between items-center bg-base-100 rounded-lg border border-base-content/5 p-2">
                                                                <div className="text-xs font-bold text-base-content/60">
                                                                    {Math.round((item.pagesRead / item.book?.totalPages) * 100) || 0}%
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <input
                                                                        type="number"
                                                                        className="w-10 bg-transparent text-right font-bold text-sm focus:outline-none text-primary"
                                                                        defaultValue={item.pagesRead}
                                                                        onBlur={(e) => handleUpdateProgress(item.book._id, parseInt(e.target.value), item.book?.totalPages)}
                                                                    />
                                                                    <span className="text-[10px] font-bold opacity-40">/ {item.book?.totalPages}</span>
                                                                </div>
                                                            </div>
                                                            <div className="w-full bg-base-content/5 h-1.5 rounded-full overflow-hidden">
                                                                <motion.div
                                                                    className="h-full bg-primary"
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: `${(item.pagesRead / item.book?.totalPages) * 100 || 0}%` }}
                                                                    transition={{ duration: 1, ease: "easeOut" }}
                                                                ></motion.div>
                                                            </div>
                                                            {item.book?.pdfUrl ? (
                                                                <Link
                                                                    href={`/books/${item.book?._id}/read`}
                                                                    className="btn btn-primary btn-sm w-full rounded-lg font-bold text-primary-content shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 h-9 min-h-0"
                                                                >
                                                                    <BookOpen size={14} /> Continue
                                                                </Link>
                                                            ) : (
                                                                <Link
                                                                    href={`/books/${item.book?._id}`}
                                                                    className="btn btn-primary btn-sm w-full rounded-lg font-bold text-primary-content shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 h-9 min-h-0"
                                                                >
                                                                    <BookOpen size={14} /> Continue
                                                                </Link>
                                                            )}

                                                        </div>
                                                    ) : item.shelf === "Read" ? (
                                                        <div className="flex items-center gap-2 text-success bg-success/5 px-3 py-2 rounded-lg border border-success/10 w-full justify-center">
                                                            <CheckCircle2 size={16} />
                                                            <span className="text-xs font-bold uppercase tracking-wider">Completed</span>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-3">
                                                            <div className="flex items-center gap-2 text-primary bg-primary/5 px-3 py-2 rounded-lg border border-primary/10 w-full justify-center">
                                                                <Bookmark size={16} fill="currentColor" />
                                                                <span className="text-xs font-bold uppercase tracking-wider">Wishlist</span>
                                                            </div>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    handleStartReading(item.book._id);
                                                                }}
                                                                className="btn btn-primary btn-sm w-full rounded-lg font-bold text-primary-content shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 h-9 min-h-0"
                                                            >
                                                                <Flame size={14} /> Start Reading
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
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
            </div >
        </ProtectedRoute >
    );
};

export default MyLibrary;
