"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Search, Filter, BookOpen, Star } from "lucide-react";
import bookService from "@/services/bookService";
import genreService from "@/services/genreService";

const BrowseBooks = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("");
    const [genres, setGenres] = useState([]);
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

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

    // Fetch books when filters change
    useEffect(() => {
        fetchBooks();
    }, [debouncedSearch, selectedGenre]);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const params = {};
            if (debouncedSearch) params.search = debouncedSearch;
            if (selectedGenre) params.genre = selectedGenre;

            const response = await bookService.getAllBooks(params);
            setBooks(response.data || []);
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
                <main className="flex-grow max-w-screen-2xl mx-auto px-4 md:px-8 py-12 w-full">
                    <header className="mb-8 flex flex-col md:flex-row justify-between items-end gap-6">
                        <div className="flex-1">
                            <h1 className="text-3xl md:text-4xl font-black text-base-content mb-2 tracking-tight">Browse Collection</h1>
                            <p className="text-base-content/60 text-lg font-medium max-w-2xl">
                                Find your next great adventure. Search by title, author, or explore by genre.
                            </p>
                        </div>

                        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                            {/* Search Input */}
                            <div className="relative flex-grow md:w-80">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/30" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search title, author..."
                                    className="input input-lg w-full pl-12 rounded-2xl bg-base-200 border-transparent focus:border-primary/30 focus:bg-base-100 font-bold transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* Genre Filter */}
                            <select
                                className="select select-lg rounded-2xl bg-base-200 border-transparent focus:border-primary/30 font-bold w-full md:w-48"
                                value={selectedGenre}
                                onChange={(e) => setSelectedGenre(e.target.value)}
                            >
                                <option value="">All Genres</option>
                                {genres.map(g => (
                                    <option key={g._id} value={g._id}>{g.name}</option>
                                ))}
                            </select>
                        </div>
                    </header>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="card bg-base-200 animate-pulse rounded-[2rem] h-[28rem]"></div>
                            ))}
                        </div>
                    ) : books.length === 0 ? (
                        <div className="text-center py-32 bg-base-200/30 rounded-[3rem] border-2 border-dashed border-base-content/5">
                            <BookOpen size={64} className="mx-auto text-base-content/20 mb-6" />
                            <h3 className="text-2xl font-black text-base-content/40 mb-2">No Books Found</h3>
                            <p className="text-base-content/40 font-medium">Try adjusting your search or filters.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {books.map((book) => (
                                <Link href={`/books/${book._id}`} key={book._id} className="group relative block h-full">
                                    <div className="card bg-base-100 h-full shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 rounded-[2rem] border border-base-content/5 overflow-hidden">
                                        {/* Cover Image */}
                                        <div className="relative aspect-[2/3] w-full overflow-hidden">
                                            <Image
                                                src={`${process.env.NEXT_PUBLIC_API_URL.replace('/api', '')}/${book.coverImage.replace(/\\/g, '/')}`}
                                                alt={book.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>

                                            {/* Badge */}
                                            <div className="absolute top-4 left-4">
                                                <span className="badge badge-primary font-bold shadow-lg backdrop-blur-md bg-primary/90 border-none text-xs uppercase tracking-wider">
                                                    {book.genre?.name || 'Book'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="card-body p-6">
                                            <div className="flex justify-between items-start mb-2">
                                                <h2 className="card-title text-xl font-black leading-tight line-clamp-2 min-h-[3.5rem]">
                                                    {book.title}
                                                </h2>
                                            </div>
                                            <p className="text-sm font-bold text-base-content/60 mb-4 h-5 truncate">
                                                by {book.author}
                                            </p>

                                            <div className="mt-auto flex items-center justify-between pt-4 border-t border-base-content/5">
                                                <div className="flex items-center gap-1.5 text-warning font-bold">
                                                    <Star size={18} fill="currentColor" />
                                                    <span>{book.averageRating?.toFixed(1) || 'New'}</span>
                                                </div>
                                                <div className="badge badge-ghost font-bold bg-base-200">
                                                    View Details
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </main>
                <Footer />
            </div>
        </ProtectedRoute>
    );
};

export default BrowseBooks;
