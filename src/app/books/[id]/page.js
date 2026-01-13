"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Star, BookOpen, Clock, Calendar, Heart, Share2, MessageSquare, BookMarked, Download, FileText } from "lucide-react";
import bookService from "@/services/bookService";
import reviewService from "@/services/reviewService";
import libraryService from "@/services/libraryService";
import Swal from "sweetalert2";

const BookDetails = () => {
    const { id } = useParams(); // Get book ID from URL
    const router = useRouter();

    const [book, setBook] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const [submittingReview, setSubmittingReview] = useState(false);
    const [addingToShelf, setAddingToShelf] = useState(false);

    useEffect(() => {
        if (id) {
            fetchBookDetails();
            fetchBookReviews();
        }
    }, [id]);

    const fetchBookDetails = async () => {
        try {
            const data = await bookService.getBookById(id);
            setBook(data);
        } catch (error) {
            console.error("Failed to load book:", error);
            Swal.fire("Error", "Failed to load book details", "error");
            router.push('/books');
        } finally {
            setLoading(false);
        }
    };

    const fetchBookReviews = async () => {
        try {
            const response = await reviewService.getBookReviews(id);
            setReviews(response.data || []);
        } catch (error) {
            console.error("Failed to load reviews:", error);
        }
    };

    const handleAddToShelf = async (shelf) => {
        try {
            setAddingToShelf(true);
            await libraryService.addToLibrary(id, shelf);
            Swal.fire({
                title: "Added to Library!",
                text: `${book.title} has been added to your ${shelf} shelf.`,
                icon: "success",
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            Swal.fire("Info", error.response?.data?.message || "Could not add to library", "info");
        } finally {
            setAddingToShelf(false);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            return Swal.fire("Rating Required", "Please select a star rating", "warning");
        }

        try {
            setSubmittingReview(true);
            await reviewService.createReview({
                bookId: id,
                rating,
                review: reviewText
            });
            Swal.fire("Review Submitted", "Your review is pending moderation.", "success");
            setReviewText("");
            setRating(0);
        } catch (error) {
            Swal.fire("Error", error.response?.data?.message || "Failed to submit review", "error");
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-base-100 flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (!book) return null;

    return (
        <ProtectedRoute>
            <div className="flex flex-col min-h-screen bg-base-100">
                <Navbar />

                <main className="flex-grow">
                    {/* Hero Section with Blur Background */}
                    <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
                        <div
                            className="absolute inset-0 bg-cover bg-center blur-2xl opacity-50 scale-110"
                            style={{ backgroundImage: `url(${process.env.NEXT_PUBLIC_API_URL.replace('/api', '')}/${book.coverImage.replace(/\\/g, '/')})` }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-base-100 via-base-100/60 to-transparent"></div>
                        <div className="absolute inset-0 bg-black/20"></div>

                        {/* Content Overlay */}
                        <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-end pb-12 gap-8">
                            {/* Book Cover */}
                            <div className="hidden md:block w-64 aspect-[2/3] relative rounded-2xl overflow-hidden shadow-2xl skew-y-0 hover:-skew-y-2 transition-transform duration-500 border-4 border-base-100/20">
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_API_URL.replace('/api', '')}/${book.coverImage.replace(/\\/g, '/')}`}
                                    alt={book.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Info */}
                            <div className="flex-1 space-y-4 mb-4">
                                <span className="px-4 py-1.5 rounded-full bg-primary/20 text-primary font-bold text-xs uppercase tracking-widest backdrop-blur-md border border-primary/20">
                                    {book.genre?.name || "Uncategorized"}
                                </span>
                                <h1 className="text-4xl md:text-6xl font-black text-base-content leading-tight tracking-tight">
                                    {book.title}
                                </h1>
                                <p className="text-xl md:text-2xl font-medium text-base-content/70">
                                    by <span className="text-primary">{book.author}</span>
                                </p>

                                <div className="flex flex-wrap gap-4 md:gap-8 pt-4">
                                    <div className="flex items-center gap-2 text-warning">
                                        <Star fill="currentColor" size={24} />
                                        <span className="text-2xl font-bold">{book.averageRating.toFixed(1)}</span>
                                        <span className="text-sm font-medium opacity-60">({book.totalReviews} reviews)</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-base-content/60">
                                        <FileText size={20} />
                                        <span className="font-bold">{book.totalPages || "?"} Pages</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-base-content/60">
                                        <Calendar size={20} />
                                        <span className="font-bold">{new Date(book.createdAt).getFullYear()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-12">

                        {/* Left Column: Actions & Details */}
                        <div className="md:col-span-2 space-y-12">
                            {/* Action Bar for Mobile (Cover visible here) */}
                            <div className="md:hidden flex gap-6 items-start">
                                <div className="w-32 aspect-[2/3] relative rounded-xl overflow-hidden shadow-lg flex-shrink-0">
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_API_URL.replace('/api', '')}/${book.coverImage.replace(/\\/g, '/')}`}
                                        alt={book.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="space-y-3 w-full">
                                    <div className="dropdown w-full">
                                        <div tabIndex={0} role="button" className="btn btn-primary w-full rounded-xl font-bold shadow-lg shadow-primary/30">
                                            <BookMarked size={20} /> Add to Shelf
                                        </div>
                                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-xl bg-base-200 rounded-box w-52 mt-2">
                                            <li><a onClick={() => handleAddToShelf('Want to Read')}>Want to Read</a></li>
                                            <li><a onClick={() => handleAddToShelf('Reading')}>Currently Reading</a></li>
                                            <li><a onClick={() => handleAddToShelf('Read')}>Read</a></li>
                                        </ul>
                                    </div>
                                    <a
                                        href={`${process.env.NEXT_PUBLIC_API_URL.replace('/api', '')}/${book.pdfUrl.replace(/\\/g, '/')}`}
                                        target="_blank"
                                        className="btn btn-outline w-full rounded-xl font-bold"
                                    >
                                        <BookOpen size={20} /> Read Sample
                                    </a>
                                </div>
                            </div>

                            {/* Actions for Desktop */}
                            <div className="hidden md:flex gap-4">
                                <div className="dropdown dropdown-hover">
                                    <div tabIndex={0} role="button" className="btn btn-primary btn-lg rounded-2xl font-black text-lg px-8 shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                                        <BookMarked size={24} /> Add to Shelf
                                    </div>
                                    <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-2xl bg-base-200 rounded-2xl w-52 mt-2 border border-base-content/5">
                                        <li><a className="font-bold p-3" onClick={() => handleAddToShelf('Want to Read')}>Want to Read</a></li>
                                        <li><a className="font-bold p-3" onClick={() => handleAddToShelf('Reading')}>Currently Reading</a></li>
                                        <li><a className="font-bold p-3" onClick={() => handleAddToShelf('Read')}>Read</a></li>
                                    </ul>
                                </div>
                                <a
                                    href={`${process.env.NEXT_PUBLIC_API_URL.replace('/api', '')}/${book.pdfUrl.replace(/\\/g, '/')}`}
                                    target="_blank"
                                    className="btn btn-secondary btn-lg rounded-2xl font-black text-lg px-8 shadow-xl shadow-secondary/20 hover:scale-105 transition-transform"
                                >
                                    <BookOpen size={24} /> Read Now
                                </a>
                                <button className="btn btn-ghost btn-lg btn-square rounded-2xl">
                                    <Heart size={24} />
                                </button>
                                <button className="btn btn-ghost btn-lg btn-square rounded-2xl">
                                    <Share2 size={24} />
                                </button>
                            </div>

                            {/* Synopsis */}
                            <section>
                                <h3 className="text-2xl font-black text-base-content mb-4 flex items-center gap-2">
                                    <FileText className="text-primary" /> Synopsis
                                </h3>
                                <div className="prose prose-lg text-base-content/80 leading-relaxed">
                                    <p>{book.description}</p>
                                </div>
                            </section>

                            {/* Reviews Section */}
                            <section className="pt-8 border-t border-base-content/10">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-2xl font-black text-base-content flex items-center gap-2">
                                        <MessageSquare className="text-accent" /> Community Reviews
                                    </h3>
                                    <span className="badge badge-lg font-bold">{reviews.length} Reviews</span>
                                </div>

                                {/* Review Form */}
                                <div className="bg-base-200/50 p-6 rounded-3xl mb-12 border border-base-content/5">
                                    <h4 className="font-bold mb-4">Write a Review</h4>
                                    <form onSubmit={handleSubmitReview}>
                                        <div className="flex gap-2 mb-4">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setRating(star)}
                                                    className={`transition-all hover:scale-110 ${rating >= star ? 'text-warning' : 'text-base-content/20'}`}
                                                >
                                                    <Star size={32} fill={rating >= star ? "currentColor" : "none"} />
                                                </button>
                                            ))}
                                        </div>
                                        <textarea
                                            className="textarea textarea-bordered w-full h-32 rounded-2xl text-lg mb-4 bg-base-100 focus:outline-none focus:border-primary/50"
                                            placeholder="Sharing your thoughts helps others finding great books..."
                                            value={reviewText}
                                            onChange={(e) => setReviewText(e.target.value)}
                                            required
                                        ></textarea>
                                        <button
                                            type="submit"
                                            className="btn btn-primary rounded-xl font-bold px-8 shadow-lg shadow-primary/20"
                                            disabled={submittingReview}
                                        >
                                            {submittingReview ? <span className="loading loading-spinner"></span> : "Post Review"}
                                        </button>
                                    </form>
                                </div>

                                {/* Reviews List */}
                                <div className="space-y-6">
                                    {reviews.length === 0 ? (
                                        <p className="text-center py-10 text-base-content/40 italic">No reviews yet. Be the first to review!</p>
                                    ) : (
                                        reviews.map((review) => (
                                            <div key={review._id} className="bg-base-100 p-6 rounded-3xl border border-base-content/5 shadow-sm">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="avatar placeholder">
                                                            <div className="bg-neutral text-neutral-content rounded-full w-10">
                                                                <span className="text-xs font-bold">{review.user?.name?.[0] || 'U'}</span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h5 className="font-bold">{review.user?.name || 'Anonymous User'}</h5>
                                                            <p className="text-xs text-base-content/50">{new Date(review.createdAt).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex text-warning">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-base-content/10"} />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-base-content/80 leading-relaxed pl-14">
                                                    "{review.review}"
                                                </p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* Right Column: Suggested / More info */}
                        <div className="space-y-8">
                            <div className="bg-base-200/50 p-6 rounded-[2rem] border-2 border-dashed border-base-content/5">
                                <h4 className="font-black text-lg mb-4 opacity-50 uppercase tracking-widest">About the Author</h4>
                                <p className="text-sm leading-relaxed opacity-70">
                                    Information about <strong>{book.author}</strong> is currently being updated. Check back soon for more bio details and other works.
                                </p>
                            </div>

                            {/* Placeholder for "You might also like" */}
                            <div>
                                <h4 className="font-black text-lg mb-4 opacity-50 uppercase tracking-widest">Similar Books</h4>
                                <div className="space-y-4">
                                    {[1, 2, 3].map((_, i) => (
                                        <div key={i} className="flex gap-4 items-center group cursor-pointer hover:bg-base-200 p-2 rounded-xl transition-colors">
                                            <div className="w-12 h-16 bg-base-300 rounded-lg"></div>
                                            <div>
                                                <div className="h-4 w-32 bg-base-300 rounded mb-2"></div>
                                                <div className="h-3 w-20 bg-base-300/50 rounded"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </main>
                <Footer />
            </div>
        </ProtectedRoute>
    );
};

export default BookDetails;
