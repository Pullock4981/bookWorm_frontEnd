"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Star, BookOpen, Clock, Calendar, Heart, Share2, MessageSquare, BookMarked, ChevronLeft, FileText, Layout } from "lucide-react";
import bookService from "@/services/bookService";
import reviewService from "@/services/reviewService";
import libraryService from "@/services/libraryService";
import Swal from "sweetalert2";

const BookDetails = () => {
    const { id } = useParams();
    const router = useRouter();

    const [book, setBook] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const [submittingReview, setSubmittingReview] = useState(false);
    const [addingToShelf, setAddingToShelf] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

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
                text: `"${book.title}" added to your ${shelf} shelf.`,
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
                toast: true,
                position: 'top-end'
            });
        } catch (error) {
            Swal.fire({
                title: "Heads up!",
                text: error.response?.data?.message || "Already in your library or an error occurred.",
                icon: "info",
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });
        } finally {
            setAddingToShelf(false);
        }
    };

    const handleShare = async () => {
        const shareData = {
            title: book.title,
            text: `Check out "${book.title}" by ${book.author} on BookWorm!`,
            url: typeof window !== 'undefined' ? window.location.href : '',
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'Link copied to clipboard',
                    showConfirmButton: false,
                    timer: 3000
                });
            }
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const handleFavorite = () => {
        setIsLiked(!isLiked);
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: !isLiked ? 'success' : 'info',
            title: !isLiked ? 'Added to favorites' : 'Removed from favorites',
            showConfirmButton: false,
            timer: 2000
        });
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
            Swal.fire("Success!", "Your review has been submitted for moderation.", "success");
            setReviewText("");
            setRating(0);
            fetchBookReviews(); // Refresh list
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
                    {/* Premium Hero Section */}
                    <div className="relative w-full pt-12">
                        {/* Dynamic Background Blur */}
                        <div className="absolute inset-0 -z-10 h-full w-full overflow-hidden">
                            <div
                                className="absolute inset-0 bg-cover bg-center blur-[100px] opacity-20 scale-150"
                                style={{ backgroundImage: `url(${book.coverImage})` }}
                            ></div>
                            <div className="absolute inset-0 bg-gradient-to-b from-base-100/0 via-base-100/50 to-base-100"></div>
                        </div>

                        <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
                            {/* Back Button */}
                            <Link href="/books" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-base-content/40 hover:text-primary transition-colors mb-8 group">
                                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Collection
                            </Link>

                            <div className="flex flex-col md:flex-row gap-12 items-start pb-12">
                                {/* Book Cover with Shadow Effect */}
                                <div className="relative w-full md:w-[320px] aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl group flex-shrink-0">
                                    <Image
                                        src={book.coverImage}
                                        alt={book.title}
                                        fill
                                        priority
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                </div>

                                {/* Book Info Block */}
                                <div className="flex-1 space-y-6">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary font-bold text-[10px] uppercase tracking-[0.2em]">
                                            {book.genre?.name || "Uncategorized"}
                                        </span>
                                        <div className="h-1 w-1 rounded-full bg-base-content/20"></div>
                                        <div className="flex items-center gap-1.5 text-warning font-black text-xs">
                                            <Star size={14} fill="currentColor" />
                                            <span>{book.averageRating?.toFixed(1) || '0.0'}</span>
                                            <span className="text-base-content/30 font-bold ml-1">({book.totalReviews || 0} reviews)</span>
                                        </div>
                                    </div>

                                    <h1 className="text-4xl md:text-6xl font-black text-base-content leading-[1.1] tracking-tight">
                                        {book.title}
                                    </h1>
                                    <p className="text-xl md:text-2xl font-bold text-base-content/50 italic">
                                        by <span className="text-base-content opacity-100 not-italic">{book.author}</span>
                                    </p>

                                    <div className="flex flex-wrap gap-6 text-sm">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-base-content/30">Pages</span>
                                            <span className="font-bold flex items-center gap-2"><Layout size={14} className="text-primary" /> {book.totalPages || "N/A"}</span>
                                        </div>
                                        <div className="flex flex-col border-l border-base-content/10 pl-6">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-base-content/30">Published</span>
                                            <span className="font-bold flex items-center gap-2"><Calendar size={14} className="text-primary" /> {new Date(book.createdAt).getFullYear()}</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap gap-4 pt-6">
                                        <div className="dropdown dropdown-bottom dropdown-end md:dropdown-start">
                                            <button tabIndex={0} className="btn btn-primary rounded-2xl font-black h-14 px-8 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                                                <BookMarked size={20} /> {addingToShelf ? "ADDING..." : "ADD TO SHELF"}
                                            </button>
                                            <ul tabIndex={0} className="dropdown-content z-[50] menu p-3 shadow-2xl bg-base-100 rounded-[2rem] w-64 mt-4 border border-base-content/10 border-t-primary/20">
                                                <li className="menu-title px-4 py-2 text-[10px] font-black uppercase tracking-widest opacity-40">Choose a shelf</li>
                                                <li><button className="font-bold py-4 hover:bg-primary hover:text-white transition-all rounded-xl mb-1" onClick={() => handleAddToShelf('Want to Read')}>Want to Read</button></li>
                                                <li><button className="font-bold py-4 hover:bg-primary hover:text-white transition-all rounded-xl mb-1" onClick={() => handleAddToShelf('Currently Reading')}>Currently Reading</button></li>
                                                <li><button className="font-bold py-4 hover:bg-primary hover:text-white transition-all rounded-xl" onClick={() => handleAddToShelf('Read')}>Finished Read</button></li>
                                            </ul>
                                        </div>

                                        <a href={book.pdfUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline border-base-content/20 hover:bg-base-200 hover:border-transparent rounded-2xl font-black h-14 px-8 transition-all">
                                            <BookOpen size={20} /> READ SAMPLE
                                        </a>

                                        <button
                                            onClick={handleFavorite}
                                            className="btn btn-ghost border-base-content/10 rounded-2xl h-14 w-14 group transition-all"
                                        >
                                            <Heart
                                                size={20}
                                                className={`transition-all ${isLiked ? 'text-red-500 fill-red-500 scale-125' : 'group-hover:text-red-500 fill-transparent group-hover:fill-red-500'}`}
                                            />
                                        </button>
                                        <button
                                            onClick={handleShare}
                                            className="btn btn-ghost border-base-content/10 rounded-2xl h-14 w-14 hover:bg-base-200 transition-all"
                                        >
                                            <Share2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Sections */}
                    <div className="max-w-screen-2xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 lg:grid-cols-12 gap-16">
                        {/* Middle: Synopsis & Reviews */}
                        <div className="lg:col-span-8 space-y-20">
                            {/* Synopsis Section */}
                            <section>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="h-8 w-1 bg-primary rounded-full"></div>
                                    <h3 className="text-xl font-black text-base-content tracking-tight uppercase">Synopsis</h3>
                                </div>
                                <div className="prose prose-lg max-w-none text-base-content/70 leading-relaxed font-medium">
                                    {book.description || "No description available for this book."}
                                </div>
                            </section>

                            {/* Review Section (List First, then Form) */}
                            <section className="space-y-12">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-1 bg-accent rounded-full"></div>
                                        <h3 className="text-xl font-black text-base-content tracking-tight uppercase">Reader Reviews</h3>
                                    </div>
                                    <div className="text-xs font-black uppercase tracking-widest text-base-content/40">{reviews.length} total reviews</div>
                                </div>

                                {/* Reviews List */}
                                <div className="grid gap-6">
                                    {reviews.length === 0 ? (
                                        <div className="text-center py-16 bg-base-200/20 rounded-[2.5rem] border-2 border-dashed border-base-content/5">
                                            <p className="text-base-content/30 font-black uppercase tracking-[0.2em]">No reviews yet</p>
                                        </div>
                                    ) : (
                                        reviews.map((review) => (
                                            <div key={review._id} className="bg-base-100 p-8 rounded-[2.5rem] border border-base-content/5 shadow-sm hover:shadow-md transition-shadow group">
                                                <div className="flex justify-between items-start mb-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="avatar">
                                                            <div className="rounded-2xl w-14 h-14 shadow-inner overflow-hidden bg-primary/5">
                                                                {review.user?.photo ? (
                                                                    <Image
                                                                        src={review.user.photo}
                                                                        alt={review.user.name}
                                                                        width={56}
                                                                        height={56}
                                                                        className="object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-xl font-black">
                                                                        {review.user?.name?.[0].toUpperCase() || 'U'}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h5 className="font-black text-lg text-base-content/90 tracking-tight">{review.user?.name || 'Reader'}</h5>
                                                            <p className="text-[10px] uppercase font-black tracking-widest text-base-content/30">{new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 px-4 py-2 bg-warning/5 text-warning rounded-xl border border-warning/10">
                                                        <Star size={14} fill="currentColor" />
                                                        <span className="font-black text-sm">{review.rating}</span>
                                                    </div>
                                                </div>
                                                <p className="text-base-content/70 font-medium leading-[1.8] italic px-2">
                                                    "{review.review}"
                                                </p>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Write a Review Glassy Card (Now at the bottom) */}
                                <div className="bg-base-200/40 backdrop-blur-sm p-8 rounded-[2.5rem] border border-base-content/5 shadow-sm">
                                    <h4 className="text-lg font-black mb-6 uppercase tracking-wider text-base-content/80">Share your thoughts</h4>
                                    <form onSubmit={handleSubmitReview} className="space-y-6">
                                        <div className="flex gap-3">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setRating(star)}
                                                    className={`transition-all hover:scale-125 ${rating >= star ? 'text-warning' : 'text-base-content/10'}`}
                                                >
                                                    <Star size={36} fill={rating >= star ? "currentColor" : "none"} />
                                                </button>
                                            ))}
                                        </div>
                                        <textarea
                                            className="textarea textarea-bordered w-full h-40 rounded-3xl text-sm p-6 bg-base-100/50 border-base-content/10 focus:border-primary/30 transition-all font-medium"
                                            placeholder="What did you think about this masterpiece?..."
                                            value={reviewText}
                                            onChange={(e) => setReviewText(e.target.value)}
                                            required
                                        ></textarea>
                                        <button
                                            type="submit"
                                            className="btn btn-primary rounded-2xl font-black px-12 h-14 shadow-lg shadow-primary/20"
                                            disabled={submittingReview}
                                        >
                                            {submittingReview ? <span className="loading loading-spinner"></span> : "SUBMIT REVIEW"}
                                        </button>
                                    </form>
                                </div>
                            </section>
                        </div>

                        {/* Right: Author info / Stats */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="sticky top-24 space-y-8">
                                <div className="bg-base-200/50 p-10 rounded-[3rem] border border-base-content/5 group overflow-hidden relative">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-150 transition-transform duration-700">
                                        <FileText size={120} />
                                    </div>
                                    <h4 className="font-black text-xs mb-6 opacity-30 uppercase tracking-[0.3em] flex items-center gap-2">
                                        <div className="h-1 w-4 bg-primary rounded-full"></div> Author Bio
                                    </h4>
                                    <p className="text-sm leading-[1.8] font-bold text-base-content/60 relative z-10">
                                        Dive into the world of <strong>{book.author}</strong>. This author is known for their unique storytelling and deep character development.
                                        More works are available in the collection.
                                    </p>
                                    <div className="mt-8 pt-6 border-t border-base-content/5">
                                        <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:gap-3 flex items-center gap-2 transition-all">
                                            View Author profile <ChevronLeft className="rotate-180" size={14} />
                                        </button>
                                    </div>
                                </div>

                                {/* Quick Stats Card */}
                                <div className="bg-primary p-10 rounded-[3rem] text-primary-content shadow-2xl shadow-primary/30 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <h4 className="font-black text-xs mb-8 opacity-60 uppercase tracking-[0.3em]">Quick Stats</h4>
                                    <div className="space-y-6 relative z-10">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-bold opacity-70">Popularity</span>
                                            <span className="font-black">Top 1%</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-bold opacity-70">Read Time</span>
                                            <span className="font-black">~{Math.round(book.totalPages / 50) || 4} Hours</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-bold opacity-70">Difficulty</span>
                                            <span className="font-black">Moderate</span>
                                        </div>
                                    </div>
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
