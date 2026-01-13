"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Search, Filter, BookOpen, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import bookService from "@/services/bookService";
import genreService from "@/services/genreService";

const BrowseBooks = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [minRating, setMinRating] = useState(0);
    const [sortBy, setSortBy] = useState("-createdAt");
    const [genres, setGenres] = useState([]);
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    const booksPerPage = 8;

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1); // Reset to page 1 on new search
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedGenres, minRating, sortBy]);

    // Fetch filters and initial data
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const res = await genreService.getAllGenres();
                setGenres(res.data || []);
            } catch (error) {
                console.error("Failed to load genres");
            }
        };
        fetchGenres();
    }, []);

    // Fetch books when filters or page change
    useEffect(() => {
        fetchBooks();
    }, [debouncedSearch, selectedGenres, minRating, sortBy, currentPage]);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const params = {
                page: currentPage,
                limit: booksPerPage,
                sort: sortBy
            };
            if (debouncedSearch) params.search = debouncedSearch;
            if (selectedGenres.length > 0) params.genre = selectedGenres.join(',');
            if (minRating > 0) params.rating = minRating;

            const response = await bookService.getAllBooks(params);
            setBooks(response.books || []);
            setTotalPages(response.totalPages || 1);
        } catch (error) {
            console.error("Failed to fetch books:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <div className="flex flex-col min-h-screen bg-base-100">
                <Navbar />
                <main className="flex-grow max-w-screen-2xl mx-auto px-4 md:px-8 py-10 w-full relative">
                    <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-30">
                        <div>
                            <h1 className="text-2xl font-black text-base-content mb-1 tracking-tight uppercase">Browse Collection</h1>
                            <p className="text-base-content/50 text-sm font-medium">Find your next great adventure. Search by title, author, or explore by genre.</p>
                        </div>

                        <div className="flex flex-col gap-4 w-full md:w-auto">
                            <div className="flex flex-col md:flex-row gap-3">
                                {/* Search Input */}
                                <div className="relative flex-grow md:w-80">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/30" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search title, author..."
                                        className="input input-bordered w-full pl-11 rounded-xl bg-base-200/50 border-transparent focus:border-primary/20 focus:bg-base-100 font-bold transition-all text-sm h-12"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`btn h-12 rounded-xl border-none font-bold text-sm px-6 ${showFilters ? 'bg-primary text-primary-content' : 'bg-base-200/50 hover:bg-base-200'}`}
                                >
                                    <Filter size={18} /> {showFilters ? 'Hide Filters' : 'Filters'}
                                </button>

                                <select
                                    className="select select-bordered rounded-xl bg-base-100 border-base-content/10 font-bold text-sm h-12 w-full md:w-48 shadow-sm focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="-createdAt">📅 Latest First</option>
                                    <option value="-averageRating">⭐ Top Rated</option>
                                    <option value="-totalReviews">💬 Most Reviewed</option>
                                    <option value="title">🔤 A-Z</option>
                                </select>
                            </div>

                            {/* Advanced Filters Panel */}
                            {showFilters && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    className="bg-base-100 p-6 rounded-[2rem] border border-base-content/10 shadow-2xl space-y-6 relative z-40"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Genre Multi-select */}
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-base-content/40 mb-3 block">Genres</label>
                                            <div className="flex flex-wrap gap-2">
                                                {genres.map(g => (
                                                    <button
                                                        key={g._id}
                                                        onClick={() => {
                                                            setSelectedGenres(prev =>
                                                                prev.includes(g._id)
                                                                    ? prev.filter(id => id !== g._id)
                                                                    : [...prev, g._id]
                                                            );
                                                        }}
                                                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedGenres.includes(g._id) ? 'bg-primary text-primary-content shadow-lg shadow-primary/20' : 'bg-base-100 hover:bg-base-200 text-base-content/60'}`}
                                                    >
                                                        {g.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Rating Filter */}
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-base-content/40 mb-3 block">Minimum Rating</label>
                                            <div className="flex items-center gap-4">
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="5"
                                                    step="1"
                                                    value={minRating}
                                                    onChange={(e) => setMinRating(parseInt(e.target.value))}
                                                    className="range range-primary range-sm"
                                                />
                                                <div className="flex items-center gap-1 min-w-[3rem] font-black text-primary">
                                                    {minRating}+ <Star size={14} fill="currentColor" />
                                                </div>
                                            </div>
                                            <div className="flex justify-between px-2 mt-2 text-[10px] font-bold opacity-30">
                                                <span>ANY</span>
                                                <span>1+</span>
                                                <span>2+</span>
                                                <span>3+</span>
                                                <span>4+</span>
                                                <span>5</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-2">
                                        <button
                                            onClick={() => {
                                                setSelectedGenres([]);
                                                setMinRating(0);
                                                setSearchTerm("");
                                            }}
                                            className="text-[10px] font-black uppercase tracking-widest text-error hover:opacity-70 transition-opacity"
                                        >
                                            Clear All Filters
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </header>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="card bg-base-200 animate-pulse rounded-[2.5rem] h-[28rem]"></div>
                            ))}
                        </div>
                    ) : books.length === 0 ? (
                        <div className="text-center py-24 bg-base-100/50 backdrop-blur-xl rounded-[3rem] border border-base-content/5">
                            <BookOpen size={48} className="mx-auto text-base-content/10 mb-4" />
                            <h3 className="text-xl font-black text-base-content/30 mb-1 uppercase">No Books Found</h3>
                            <p className="text-sm text-base-content/30 font-medium">Try adjusting your search or filters.</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {books.map((book) => (
                                    <Link href={`/books/${book._id}`} key={book._id} className="group flex flex-col items-stretch">
                                        <div className="card bg-base-100 shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-1 rounded-2xl border border-base-content/5 overflow-hidden">
                                            {/* Cover Image */}
                                            <div className="relative aspect-[16/10] w-full overflow-hidden bg-base-200">
                                                {book.coverImage ? (
                                                    <Image
                                                        src={book.coverImage}
                                                        alt={book.title}
                                                        fill
                                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center text-base-content/20">
                                                        <BookOpen size={32} />
                                                    </div>
                                                )}

                                                {/* Badge */}
                                                <div className="absolute top-2 left-2">
                                                    <span className="badge badge-primary font-bold shadow-lg bg-primary/90 border-none text-[8px] uppercase tracking-widest px-2 py-2 h-auto flex items-center">
                                                        {book.genre?.name || 'Book'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-3">
                                                <h2 className="text-sm font-black leading-tight line-clamp-1 mb-0.5 group-hover:text-primary transition-colors">
                                                    {book.title}
                                                </h2>
                                                <div className="flex items-center justify-between">
                                                    <p className="text-[9px] font-bold text-base-content/40 uppercase truncate mr-2">
                                                        {book.author}
                                                    </p>
                                                    <div className="flex items-center gap-0.5 text-warning font-black text-[10px]">
                                                        <Star size={10} fill="currentColor" />
                                                        <span>{book.averageRating?.toFixed(1) || '0.0'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* Ultra-minimal Pagination */}
                            {totalPages > 1 && (
                                <div className="mt-20 mb-10 flex justify-center">
                                    <div className="flex items-center gap-1 bg-base-200/30 p-1 rounded-full border border-base-content/5 backdrop-blur-sm">
                                        <button
                                            className={`btn btn-ghost btn-xs w-8 h-8 p-0 rounded-full ${currentPage === 1 ? 'btn-disabled opacity-30' : 'hover:bg-primary/10 hover:text-primary'}`}
                                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                            aria-label="Previous page"
                                        >
                                            <ChevronLeft size={14} />
                                        </button>

                                        <div className="flex items-center gap-1 px-1">
                                            {[...Array(totalPages)].map((_, i) => (
                                                <button
                                                    key={i + 1}
                                                    className={`btn btn-xs min-w-[2rem] h-8 rounded-full border-none font-black text-[10px] transition-all duration-300 ${currentPage === i + 1
                                                        ? 'bg-primary text-primary-content shadow-md shadow-primary/20 scale-110'
                                                        : 'bg-transparent text-base-content/40 hover:bg-base-200 hover:text-base-content'
                                                        }`}
                                                    onClick={() => setCurrentPage(i + 1)}
                                                >
                                                    {i + 1}
                                                </button>
                                            ))}
                                        </div>

                                        <button
                                            className={`btn btn-ghost btn-xs w-8 h-8 p-0 rounded-full ${currentPage === totalPages ? 'btn-disabled opacity-30' : 'hover:bg-primary/10 hover:text-primary'}`}
                                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                            aria-label="Next page"
                                        >
                                            <ChevronRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </main>
                <Footer />
            </div>
        </ProtectedRoute>
    );
};

export default BrowseBooks;
