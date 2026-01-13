"use client";


import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { MessageSquare, ShieldCheck, Check, X, Star, Loader2 } from "lucide-react";
import reviewService from "@/services/reviewService";
import Swal from "sweetalert2";

const ModerateReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await reviewService.getPendingReviews();
            setReviews(response.data || []);
        } catch (error) {
            console.error("Failed to load reviews:", error);
            // Don't show Swal for empty list errors, just log it
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (review) => {
        try {
            await reviewService.approveReview(review._id);
            Swal.fire({
                title: "Approved!",
                text: "Review is now live.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false
            });
            fetchReviews();
        } catch (error) {
            Swal.fire("Error", "Failed to approve review", "error");
        }
    };

    const handleReject = async (review) => {
        const result = await Swal.fire({
            title: "Reject Review?",
            text: "This will permanently delete this review.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Yes, Reject it"
        });

        if (result.isConfirmed) {
            try {
                await reviewService.deleteReview(review._id);
                Swal.fire({
                    title: "Rejected",
                    text: "Review has been removed.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                });
                fetchReviews();
            } catch (error) {
                Swal.fire("Error", "Failed to delete review", "error");
            }
        }
    };

    return (
        <ProtectedRoute adminOnly={true}>
            <AdminLayout>
                <div className="p-6 md:p-12 min-h-screen">
                    <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div>
                            <h1 className="text-2xl font-black text-base-content mb-1 tracking-tight">Review Moderation</h1>
                            <p className="text-base-content/50 text-sm font-medium">Approve or reject community contributions.</p>
                        </div>
                        <div className="bg-base-100 px-6 py-3 rounded-2xl font-bold text-base-content/60 border border-base-content/5 shadow-sm">
                            Pending: <span className="text-warning font-black">{reviews.length}</span>
                        </div>
                    </header>

                    <div className="bg-base-100/50 backdrop-blur-xl rounded-[2.5rem] overflow-hidden border border-primary/5 shadow-2xl relative p-8">
                        {loading ? (
                            <div className="flex justify-center items-center py-20">
                                <Loader2 className="animate-spin text-primary" size={40} />
                            </div>
                        ) : reviews.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <ShieldCheck size={48} className="text-base-content/20 mb-4" />
                                <h2 className="text-lg font-black text-base-content/40 uppercase tracking-widest">All Caught Up</h2>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6">
                                {reviews.map((review) => (
                                    <div key={review._id} className="bg-base-100/50 p-6 md:p-8 rounded-[2rem] border border-base-content/5 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all flex flex-col md:flex-row gap-6">
                                        <div className="flex-grow space-y-3">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="badge badge-primary badge-outline font-bold text-[10px] uppercase tracking-wider py-2">
                                                    {review.book?.title || "Unknown Book"}
                                                </span>
                                                <span className="text-base-content/30 text-xs font-bold">•</span>
                                                <span className="text-xs font-bold opacity-50">
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>

                                            <div className="flex items-start gap-4">
                                                <div className="avatar">
                                                    <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                                        {review.user?.photo ? (
                                                            <img src={review.user.photo} alt={review.user.name} />
                                                        ) : (
                                                            <img src={`https://ui-avatars.com/api/?name=${review.user?.name}&background=random`} alt={review.user?.name} />
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg leading-none mb-1">{review.user?.name || "Anonymous"}</h3>
                                                    <div className="flex text-warning mb-2">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-base-content/10"} />
                                                        ))}
                                                    </div>
                                                    <p className="text-base-content/80 leading-relaxed italic text-sm">
                                                        "{review.review}"
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex md:flex-col justify-end gap-3 md:w-32 flex-shrink-0 border-t md:border-t-0 md:border-l border-base-content/5 pt-4 md:pt-0 md:pl-6">
                                            <button
                                                onClick={() => handleApprove(review)}
                                                className="btn btn-primary rounded-xl font-bold flex-1 shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                                            >
                                                <Check size={18} /> Approve
                                            </button>
                                            <button
                                                onClick={() => handleReject(review)}
                                                className="btn btn-ghost text-error bg-error/10 hover:bg-error/20 rounded-xl font-bold flex-1"
                                            >
                                                <X size={18} /> Reject
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </AdminLayout>
        </ProtectedRoute>
    );
};

export default ModerateReviews;
