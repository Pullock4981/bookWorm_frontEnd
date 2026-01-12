"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import bookService from "@/services/bookService";
import { Search, Filter, BookOpen, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const BrowseBooks = () => {
    const [books, setBooks] = useState([]);
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: "",
        genre: "",
        sort: "-createdAt",
        page: 1,
        limit: 12
    });
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchGenres();
    }, []);

    useEffect(() => {
        fetchBooks();
    }, [filters]);

    const fetchGenres = async () => {
        try {
            const data = await bookService.getGenres();
            setGenres(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchBooks = async () => {
        setLoading(true);
        try {
            const data = await bookService.getAllBooks(filters);
            setBooks(data.data);
            setTotalPages(data.totalPages);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        setFilters({ ...filters, search: e.target.value, page: 1 });
    };

    const handleGenreChange = (genreId) => {
        setFilters({ ...filters, genre: genreId, page: 1 });
    };

    return (
        <ProtectedRoute>
            <div className="flex flex-col min-h-screen bg-base-100">
                <Navbar />

                <main className="flex-grow">
                    {/* Hero Banner Space */}
                    <div className="bg-primary/5 border-b border-primary/10 py-12">
                        <div className="max-w-7xl mx-auto px-6">
                            <h1 className="text-4xl font-bold text-neutral">Discover Your Next Favorite</h1>
                            <p className="text-neutral-content/60 mt-2 text-lg">Browse through our curated collection of books from across the globe.</p>

                            {/* Search & Filter Bar */}
                            <div className="mt-8 flex flex-col md:flex-row gap-4 items-center bg-base-100 p-4 rounded-2xl shadow-lg border border-primary/5">
                                <div className="relative flex-grow w-full">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-content/40" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Search by title or author..."
                                        className="input input-bordered w-full pl-12 focus:outline-primary border-primary/10"
                                        value={filters.search}
                                        onChange={handleSearchChange}
                                    />
                                </div>
                                <div className="flex gap-2 w-full md:w-auto">
                                    <select
                                        className="select select-bordered border-primary/10 flex-grow"
                                        onChange={(e) => handleGenreChange(e.target.value)}
                                        value={filters.genre}
                                    >
                                        <option value="">All Genres</option>
                                        {genres.map(g => (
                                            <option key={g._id} value={g._id}>{g.name}</option>
                                        ))}
                                    </select>
                                    <select
                                        className="select select-bordered border-primary/10"
                                        onChange={(e) => setFilters({ ...filters, sort: e.target.value, page: 1 })}
                                        value={filters.sort}
                                    >
                                        <option value="-createdAt">Newest First</option>
                                        <option value="-averageRating">Top Rated</option>
                                        <option value="title">Title (A-Z)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Book Grid */}
                    <div className="max-w-7xl mx-auto px-6 py-12">
                        {loading ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                                {[...Array(12)].map((_, i) => (
                                    <div key={i} className="flex flex-col gap-4">
                                        <div className="skeleton h-64 w-full rounded-xl"></div>
                                        <div className="skeleton h-4 w-28"></div>
                                        <div className="skeleton h-4 w-full"></div>
                                    </div>
                                ))}
                            </div>
                        ) : books.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                                <AnimatePresence mode="popLayout">
                                    {books.map((book) => (
                                        <motion.div
                                            key={book._id}
                                            layout
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0.9, opacity: 0 }}
                                            className="group cursor-pointer"
                                        >
                                            <Link href={`/books/${book._id}`}>
                                                <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-md group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-300">
                                                    <img
                                                        src={book.coverImage || "https://images.unsplash.com/photo-1543004471-2401c3eaa9c8?auto=format&fit=crop&q=80&w=400"}
                                                        alt={book.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                                        <p className="text-white text-sm font-bold truncate">{book.title}</p>
                                                        <p className="text-white/70 text-xs">{book.author}</p>
                                                    </div>
                                                </div>
                                                <div className="mt-4 px-1">
                                                    <div className="flex items-center gap-1 text-primary text-xs font-bold uppercase tracking-wider mb-1">
                                                        <BookOpen size={12} /> {book.genre?.name || "Uncategorized"}
                                                    </div>
                                                    <h3 className="font-bold text-neutral leading-tight truncate">{book.title}</h3>
                                                    <div className="flex items-center justify-between mt-2">
                                                        <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                                                            <Star size={14} fill="currentColor" /> {book.averageRating?.toFixed(1) || "New"}
                                                        </div>
                                                        <span className="text-xs opacity-50 font-medium">{book.totalReviews || 0} reviews</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="text-center py-24 bg-base-200/30 rounded-3xl border-2 border-dashed border-primary/10">
                                <Search size={64} className="mx-auto text-primary/20 mb-4" />
                                <h2 className="text-2xl font-bold">No books found</h2>
                                <p className="text-neutral-content/60 mt-2">Try adjusting your filters or searching for something else.</p>
                                <button
                                    onClick={() => setFilters({ ...filters, search: "", genre: "", page: 1 })}
                                    className="btn btn-primary btn-outline mt-6"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-16 flex justify-center items-center gap-4">
                                <button
                                    className="btn btn-circle btn-ghost border-primary/10"
                                    disabled={filters.page === 1}
                                    onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                                >
                                    <ChevronLeft />
                                </button>
                                <div className="join bg-base-100 border border-primary/10 shadow-sm">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            className={`join-item btn btn-sm w-10 ${filters.page === i + 1 ? 'btn-primary text-white' : 'btn-ghost'}`}
                                            onClick={() => setFilters({ ...filters, page: i + 1 })}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    className="btn btn-circle btn-ghost border-primary/10"
                                    disabled={filters.page === totalPages}
                                    onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                                >
                                    <ChevronRight />
                                </button>
                            </div>
                        )}
                    </div>
                </main>

                <Footer />
            </div>
        </ProtectedRoute>
    );
};

export default BrowseBooks;
