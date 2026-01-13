"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Tags, Plus, Pencil, Trash2, Search, Loader2 } from "lucide-react";
import genreService from "@/services/genreService";
import Swal from "sweetalert2";

const ManageGenres = () => {
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGenre, setEditingGenre] = useState(null);
    const [genreName, setGenreName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchGenres();
    }, []);

    const fetchGenres = async () => {
        try {
            setLoading(true);
            const response = await genreService.getAllGenres();
            setGenres(response.data || []);
        } catch (error) {
            console.error("Failed to fetch genres:", error);
            Swal.fire("Error", "Failed to load genres", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (genre = null) => {
        if (genre) {
            setEditingGenre(genre);
            setGenreName(genre.name);
        } else {
            setEditingGenre(null);
            setGenreName("");
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingGenre(null);
        setGenreName("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!genreName.trim()) return;

        try {
            setIsSubmitting(true);
            if (editingGenre) {
                await genreService.updateGenre(editingGenre._id, { name: genreName });
                Swal.fire("Updated!", "Genre has been updated.", "success");
            } else {
                await genreService.createGenre({ name: genreName });
                Swal.fire("Created!", "New genre has been added.", "success");
            }
            fetchGenres();
            handleCloseModal();
        } catch (error) {
            console.error("Operation failed:", error);
            Swal.fire("Error", error.response?.data?.message || "Operation failed", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "Books associated with this genre might be affected.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        });

        if (result.isConfirmed) {
            try {
                await genreService.deleteGenre(id);
                Swal.fire("Deleted!", "Genre has been removed.", "success");
                fetchGenres();
            } catch (error) {
                console.error("Delete failed:", error);
                Swal.fire("Error", error.response?.data?.message || "Failed to delete genre", "error");
            }
        }
    };

    const filteredGenres = genres.filter(genre =>
        genre.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <ProtectedRoute adminOnly={true}>
            <AdminLayout>
                <div className="p-6 md:p-12 min-h-screen">
                    {/* Header Section */}
                    <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div>
                            <h1 className="text-2xl font-black text-base-content mb-1 tracking-tight">Manage Genres</h1>
                            <p className="text-base-content/50 text-sm font-medium">Organize your library categories</p>
                        </div>
                        <button
                            onClick={() => handleOpenModal()}
                            className="btn btn-primary rounded-2xl px-8 font-black shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
                        >
                            <Plus size={20} /> Add New Genre
                        </button>
                    </header>

                    {/* Search & Filter Bar */}
                    <div className="flex flex-col md:flex-row gap-4 mb-8">
                        <div className="relative flex-grow">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/30" size={20} />
                            <input
                                type="text"
                                placeholder="Search genres..."
                                className="input input-bordered w-full pl-12 rounded-2xl bg-base-100 border-none shadow-sm focus:ring-2 focus:ring-primary/20"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="bg-base-100/50 backdrop-blur-xl rounded-[2.5rem] overflow-hidden border border-primary/5 shadow-2xl relative p-8">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Loader2 size={40} className="animate-spin text-primary mb-4" />
                                <p className="text-base-content/50 font-medium">Loading genres...</p>
                            </div>
                        ) : filteredGenres.length === 0 ? (
                            <div className="text-center py-20">
                                <Tags size={48} className="mx-auto text-primary/20 mb-4" />
                                <h3 className="text-lg font-black text-base-content/40 uppercase tracking-widest">No genres found</h3>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {filteredGenres.map((genre) => (
                                    <div
                                        key={genre._id}
                                        className="group relative bg-base-200 hover:bg-base-300 border border-base-content/10 hover:border-primary/30 
                                        p-6 rounded-[2rem] transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-3 bg-base-300 group-hover:bg-primary/20 rounded-2xl transition-colors">
                                                <Tags size={24} className="text-base-content/60 group-hover:text-primary transition-colors" />
                                            </div>
                                            <div className="flex gap-2 opacity-100">
                                                {/* Always visible */}
                                                <button
                                                    onClick={() => handleOpenModal(genre)}
                                                    className="btn btn-ghost btn-xs btn-circle hover:bg-primary/10 hover:text-primary text-base-content/60"
                                                >
                                                    <Pencil size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(genre._id)}
                                                    className="btn btn-ghost btn-xs btn-circle hover:bg-error/10 hover:text-error text-base-content/60"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-black text-base-content tracking-tight mb-1 truncate">
                                            {genre.name}
                                        </h3>
                                        <p className="text-[10px] font-bold text-base-content/40 uppercase tracking-widest">
                                            ID: {genre._id.slice(-6)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Create/Edit Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-base-100 w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-200 border border-base-content/5">
                            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                                {editingGenre ? <Pencil className="text-warning" /> : <Plus className="text-primary" />}
                                {editingGenre ? 'Edit Genre' : 'New Genre'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold ml-2 text-base-content/70">Genre Name</label>
                                    <input
                                        type="text"
                                        className="input input-lg w-full bg-base-200 focus:bg-base-100 border-transparent focus:border-primary/20 rounded-2xl font-medium transition-all"
                                        placeholder="e.g. Science Fiction"
                                        value={genreName}
                                        onChange={(e) => setGenreName(e.target.value)}
                                        autoFocus
                                    />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="btn btn-ghost btn-lg flex-1 rounded-xl font-bold"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`btn btn-lg flex-1 rounded-xl font-bold shadow-lg ${editingGenre ? 'btn-warning shadow-warning/20' : 'btn-primary shadow-primary/20'}`}
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin" /> : (editingGenre ? 'Update' : 'Create')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </AdminLayout>
        </ProtectedRoute>
    );
};

export default ManageGenres;
