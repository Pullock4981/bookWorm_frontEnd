"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Video, Plus, Trash2, ExternalLink, Youtube, Loader2, Pen, ChevronLeft, ChevronRight } from "lucide-react";
import tutorialService from "@/services/tutorialService";
import Swal from "sweetalert2";

const ManageTutorials = () => {
    const [tutorials, setTutorials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        videoUrl: "",
        description: ""
    });
    const [submitting, setSubmitting] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const tutorialsPerPage = 8;

    useEffect(() => {
        fetchTutorials();
    }, []);

    const fetchTutorials = async () => {
        try {
            setLoading(true);
            const response = await tutorialService.getAllTutorials();
            setTutorials(response.data || []);
        } catch (error) {
            console.error("Failed to load tutorials:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const getYoutubeId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const handleEdit = (tutorial) => {
        setEditingId(tutorial._id);
        setFormData({
            title: tutorial.title,
            videoUrl: tutorial.videoUrl,
            description: tutorial.description || ""
        });
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({ title: "", videoUrl: "", description: "" });
        setIsModalOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const videoId = getYoutubeId(formData.videoUrl);
        if (!videoId) {
            return Swal.fire("Invalid URL", "Please enter a valid YouTube URL", "warning");
        }

        try {
            setSubmitting(true);

            if (editingId) {
                await tutorialService.updateTutorial(editingId, formData);
                Swal.fire({
                    title: "Updated!",
                    text: "Tutorial updated successfully.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                });
            } else {
                await tutorialService.createTutorial(formData);
                Swal.fire({
                    title: "Added!",
                    text: "Tutorial added successfully.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                });
            }

            resetForm();
            fetchTutorials();
        } catch (error) {
            Swal.fire("Error", error.response?.data?.message || "Failed to save tutorial", "error");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Delete Tutorial?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Yes, delete it"
        });

        if (result.isConfirmed) {
            try {
                await tutorialService.deleteTutorial(id);
                Swal.fire("Deleted!", "Tutorial has been removed.", "success");
                fetchTutorials();
            } catch (error) {
                Swal.fire("Error", "Failed to delete tutorial", "error");
            }
        }
    };

    // Pagination calculations
    const totalPages = Math.ceil(tutorials.length / tutorialsPerPage);
    const indexOfLastTutorial = currentPage * tutorialsPerPage;
    const indexOfFirstTutorial = indexOfLastTutorial - tutorialsPerPage;
    const currentTutorials = tutorials.slice(indexOfFirstTutorial, indexOfLastTutorial);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <ProtectedRoute adminOnly={true}>
            <AdminLayout>
                <div className="p-6 md:p-12 min-h-screen">
                    <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div>
                            <h1 className="text-2xl font-black text-base-content mb-1 tracking-tight">Video Library</h1>
                            <p className="text-base-content/50 text-sm font-medium">Manage tutorial content and embed YouTube guides.</p>
                            {!loading && tutorials.length > 0 && (
                                <p className="text-xs font-bold text-base-content/40 mt-1">
                                    Showing {indexOfFirstTutorial + 1}-{Math.min(indexOfLastTutorial, tutorials.length)} of {tutorials.length} videos
                                </p>
                            )}
                        </div>
                        <button
                            onClick={() => {
                                setEditingId(null);
                                setFormData({ title: "", videoUrl: "", description: "" });
                                setIsModalOpen(true);
                            }}
                            className="btn btn-primary rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                        >
                            <Plus size={20} /> Add Tutorial
                        </button>
                    </header>

                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="animate-spin text-primary" size={40} />
                        </div>
                    ) : tutorials.length === 0 ? (
                        <div className="bg-base-100/50 backdrop-blur-xl rounded-[2.5rem] p-12 text-center border border-base-content/5">
                            <div className="bg-base-200/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Youtube size={40} className="text-base-content/20" />
                            </div>
                            <h3 className="font-bold text-lg opacity-50 mb-2">NO TUTORIALS YET</h3>
                            <p className="text-sm opacity-40">Start by adding your first video guide.</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                                {currentTutorials.map((tutorial) => {
                                    const videoId = getYoutubeId(tutorial.videoUrl);
                                    return (
                                        <div key={tutorial._id} className="group flex flex-col gap-3 h-full">
                                            {/* Video Preview */}
                                            <div className="relative aspect-video rounded-3xl overflow-hidden bg-base-200 shadow-sm transition-transform group-hover:scale-[1.02] duration-300 flex-shrink-0">
                                                {videoId ? (
                                                    <a
                                                        href={`https://www.youtube.com/watch?v=${videoId}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="block w-full h-full relative group/play"
                                                    >
                                                        <img
                                                            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                                                            alt={tutorial.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/play:bg-black/40 transition-colors">
                                                            <div className="bg-red-600/90 text-white rounded-2xl px-4 py-2 flex items-center gap-2 transform group-hover/play:scale-110 transition-transform shadow-lg">
                                                                <Youtube size={24} fill="currentColor" />
                                                                <span className="font-bold text-sm">Play</span>
                                                            </div>
                                                        </div>
                                                    </a>
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-base-content/30">
                                                        <Video size={32} />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Minimal Details */}
                                            <div className="px-1 flex flex-col flex-grow">
                                                <h3 className="font-bold text-base leading-snug text-base-content/90 mb-1 line-clamp-1">
                                                    {tutorial.title}
                                                </h3>
                                                <p className="text-xs text-base-content/50 line-clamp-2 leading-relaxed mb-4">
                                                    {tutorial.description || "No description."}
                                                </p>

                                                <div className="flex gap-2 mt-auto">
                                                    <a
                                                        href={tutorial.videoUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn btn-xs btn-outline rounded-lg flex-1 font-bold gap-1"
                                                    >
                                                        <ExternalLink size={12} /> Watch
                                                    </a>
                                                    <button
                                                        onClick={() => handleEdit(tutorial)}
                                                        className="btn btn-xs btn-ghost text-primary bg-primary/10 hover:bg-primary/20 rounded-lg px-2"
                                                        title="Edit"
                                                    >
                                                        <Pen size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(tutorial._id)}
                                                        className="btn btn-xs btn-ghost text-error bg-error/10 hover:bg-error/20 rounded-lg px-2"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-2 mt-12">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="btn btn-circle btn-ghost hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>

                                    <div className="flex gap-2">
                                        {[...Array(totalPages)].map((_, index) => {
                                            const pageNumber = index + 1;
                                            if (
                                                pageNumber === 1 ||
                                                pageNumber === totalPages ||
                                                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                            ) {
                                                return (
                                                    <button
                                                        key={pageNumber}
                                                        onClick={() => handlePageChange(pageNumber)}
                                                        className={`btn btn-circle ${currentPage === pageNumber
                                                            ? 'btn-primary'
                                                            : 'btn-ghost hover:bg-primary/10'
                                                            }`}
                                                    >
                                                        {pageNumber}
                                                    </button>
                                                );
                                            } else if (
                                                pageNumber === currentPage - 2 ||
                                                pageNumber === currentPage + 2
                                            ) {
                                                return <span key={pageNumber} className="flex items-center px-2 text-base-content/30">...</span>;
                                            }
                                            return null;
                                        })}
                                    </div>

                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="btn btn-circle btn-ghost hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Add Tutorial Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className="bg-base-100 rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                            <div className="p-8">
                                <h3 className="text-2xl font-black mb-6">{editingId ? "Edit Tutorial" : "Add New Tutorial"}</h3>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-bold">Video Title</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            placeholder="e.g., How to write a book review"
                                            className="input input-bordered w-full rounded-xl bg-base-200/50 focus:bg-base-100 transition-all border-transparent focus:border-primary/20"
                                            required
                                        />
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-bold">YouTube URL</span>
                                        </label>
                                        <div className="relative">
                                            <Youtube className="absolute left-4 top-3.5 text-base-content/30" size={20} />
                                            <input
                                                type="url"
                                                name="videoUrl"
                                                value={formData.videoUrl}
                                                onChange={handleInputChange}
                                                placeholder="https://youtube.com/watch?v=..."
                                                className="input input-bordered w-full rounded-xl bg-base-200/50 focus:bg-base-100 transition-all pl-12 border-transparent focus:border-primary/20"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-bold">Description</span>
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            placeholder="Briefly describe what this video covers..."
                                            className="textarea textarea-bordered h-32 w-full rounded-xl bg-base-200/50 focus:bg-base-100 transition-all border-transparent focus:border-primary/20"
                                        ></textarea>
                                    </div>

                                    <div className="flex gap-3 pt-6">
                                        <button
                                            type="button"
                                            onClick={resetForm}
                                            className="btn btn-ghost flex-1 rounded-xl font-bold"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="btn btn-primary flex-1 rounded-xl font-bold shadow-lg shadow-primary/20"
                                        >
                                            {submitting ? <Loader2 className="animate-spin" /> : (editingId ? "Update Video" : "Add Video")}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </AdminLayout>
        </ProtectedRoute>
    );
};

export default ManageTutorials;
