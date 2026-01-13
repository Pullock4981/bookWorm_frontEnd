"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { BookText, Plus, Search, Filter, Pencil, Trash2, X, Upload, Loader2, FileText, ExternalLink } from "lucide-react";
import bookService from "@/services/bookService";
import genreService from "@/services/genreService";
import Swal from "sweetalert2";

const ManageBooks = () => {
    const [books, setBooks] = useState([]);
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("");

    // Modal & Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        genre: "",
        description: "",
        coverImage: null,
        pdfFile: null
    });

    // Previews
    const [coverPreview, setCoverPreview] = useState(null);
    const [pdfName, setPdfName] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [booksData, genresData] = await Promise.all([
                bookService.getAllBooks().catch(err => { console.error("Books fetch failed:", err?.message || err); return { data: { books: [] } }; }),
                genreService.getAllGenres().catch(err => { console.error("Genres fetch failed:", err?.message || err); return { data: [] }; })
            ]);

            setBooks(booksData?.books || []);
            setGenres(genresData?.data || []);
        } catch (error) {
            console.error("Failed to fetch data:", error?.message || error);
            Swal.fire("Error", "Failed to load data", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            setFormData(prev => ({ ...prev, [name]: files[0] }));

            if (name === "coverImage") {
                setCoverPreview(URL.createObjectURL(files[0]));
            } else if (name === "pdfFile") {
                setPdfName(files[0].name);
            }
        }
    };

    const openModal = (book = null) => {
        if (book) {
            setEditingBook(book);
            setFormData({
                title: book.title,
                author: book.author,
                genre: book.genre?._id || book.genre, // Handle populated vs id
                description: book.description,
                coverImage: null, // Keep null unless changed
                pdfFile: null
            });
            setCoverPreview(book.coverImage);
            setPdfName(book.pdfUrl ? "Current PDF Available" : null);
        } else {
            setEditingBook(null);
            setFormData({
                title: "",
                author: "",
                genre: "",
                description: "",
                coverImage: null,
                pdfFile: null
            });
            setCoverPreview(null);
            setPdfName(null);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingBook(null);
        setCoverPreview(null);
        setPdfName(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!editingBook && (!formData.coverImage || !formData.pdfFile)) {
            return Swal.fire("Error", "Please upload both Cover Image and PDF File", "warning");
        }

        try {
            setIsSubmitting(true);
            const data = new FormData();
            data.append("title", formData.title);
            data.append("author", formData.author);
            data.append("genre", formData.genre);
            data.append("description", formData.description);

            if (formData.coverImage) data.append("coverImage", formData.coverImage);
            if (formData.pdfFile) data.append("pdfFile", formData.pdfFile);

            if (editingBook) {
                await bookService.updateBook(editingBook._id, data);
                Swal.fire("Success", "Book updated successfully", "success");
            } else {
                await bookService.createBook(data);
                Swal.fire("Success", "Book created successfully", "success");
            }

            fetchData();
            closeModal();
        } catch (error) {
            console.error(error);
            Swal.fire("Error", error.response?.data?.message || "Operation failed", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await bookService.deleteBook(id);
                setBooks(prev => prev.filter(book => book._id !== id));
                Swal.fire('Deleted!', 'Book has been deleted.', 'success');
            } catch (error) {
                Swal.fire("Error", "Failed to delete book", "error");
            }
        }
    };

    const filteredBooks = books.filter(book => {
        const matchesSearch = book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGenre = selectedGenre ? (book.genre?._id === selectedGenre || book.genre === selectedGenre) : true;
        return matchesSearch && matchesGenre;
    });

    return (
        <ProtectedRoute adminOnly={true}>
            <AdminLayout>
                <div className="p-6 md:p-12 min-h-screen">
                    {/* Header Section */}
                    <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div>
                            <h1 className="text-2xl font-black text-base-content mb-1 tracking-tight">Inventory</h1>
                            <p className="text-base-content/50 text-sm font-medium">Manage and organize the entire book catalog.</p>
                        </div>
                        <button
                            onClick={() => openModal()}
                            className="btn btn-primary rounded-2xl px-8 font-black shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
                        >
                            <Plus size={20} /> Add New Book
                        </button>
                    </header>

                    {/* Filters */}
                    <div className="flex flex-col md:flex-row gap-4 mb-8">
                        <div className="relative flex-grow">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/30" size={20} />
                            <input
                                type="text"
                                placeholder="Search inventory..."
                                className="input input-bordered w-full pl-12 rounded-2xl bg-base-100 border-none shadow-sm focus:ring-2 focus:ring-primary/20"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="select select-bordered rounded-2xl bg-base-100 border-none shadow-sm font-bold min-w-[200px]"
                            value={selectedGenre}
                            onChange={(e) => setSelectedGenre(e.target.value)}
                        >
                            <option value="">All Genres</option>
                            {genres.map(genre => (
                                <option key={genre._id} value={genre._id}>{genre.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Books Table */}
                    {/* Books Table & Cards */}
                    <div className="bg-base-100/50 backdrop-blur-xl rounded-[2.5rem] overflow-hidden border border-primary/5 shadow-2xl relative">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Loader2 size={40} className="animate-spin text-primary mb-4" />
                                <p className="text-base-content/50 font-medium">Loading inventory...</p>
                            </div>
                        ) : filteredBooks.length === 0 ? (
                            <div className="text-center py-20">
                                <BookText size={48} className="mx-auto text-primary/20 mb-4" />
                                <h3 className="text-lg font-black text-base-content/40 uppercase tracking-widest">No books found</h3>
                            </div>
                        ) : (
                            <>
                                {/* Table View for Desktop */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="table table-lg w-full">
                                        <thead className="bg-primary/5 border-b border-primary/10">
                                            <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                                                <th className="py-6 px-10">Book Detail</th>
                                                <th>Genre</th>
                                                <th>Stats</th>
                                                <th className="text-right px-10">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredBooks.map((book) => (
                                                <tr key={book._id} className="border-b border-base-content/5 hover:bg-white/5 transition-colors group">
                                                    <td className="py-6 px-10">
                                                        <div className="flex items-center gap-6">
                                                            <div className="w-16 h-24 bg-base-200 rounded-xl overflow-hidden shadow-md border border-primary/10 relative group-hover:scale-105 transition-transform duration-300">
                                                                <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                                                            </div>
                                                            <div>
                                                                <div className="font-black text-lg text-base-content leading-tight mb-1">{book.title}</div>
                                                                <div className="text-sm font-bold text-base-content/40">by {book.author}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td><span className="badge badge-primary badge-outline font-black text-[10px] py-3">{book.genre?.name || 'Uncategorized'}</span></td>
                                                    <td>
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-xs font-bold opacity-60">Avg: ⭐ {(book.averageRating || 0).toFixed(1)}</span>
                                                            <span className="text-[10px] opacity-40">{book.totalReviews || 0} reviews</span>
                                                        </div>
                                                    </td>
                                                    <td className="text-right px-10">
                                                        <div className="flex justify-end gap-2">
                                                            <button onClick={() => openModal(book)} className="btn btn-ghost btn-sm btn-circle text-primary hover:bg-primary/10"><Pencil size={18} /></button>
                                                            <button onClick={() => handleDelete(book._id)} className="btn btn-ghost btn-sm btn-circle text-error hover:bg-error/10"><Trash2 size={18} /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Card View for Mobile */}
                                <div className="md:hidden grid grid-cols-1 gap-4 p-4">
                                    {filteredBooks.map((book) => (
                                        <div key={book._id} className="bg-base-100 rounded-3xl p-5 border border-primary/10 shadow-xl shadow-primary/5 flex gap-5 hover:border-primary/30 transition-all duration-300">
                                            <div className="w-24 h-36 flex-shrink-0 bg-base-200 rounded-2xl overflow-hidden shadow-md">
                                                <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-grow flex flex-col justify-between py-1">
                                                <div>
                                                    <div className="flex justify-between items-start">
                                                        <span className="badge badge-primary badge-sm font-black text-[10px] mb-2">{book.genre?.name}</span>
                                                        <div className="flex gap-1">
                                                            <button
                                                                onClick={() => openModal(book)}
                                                                className="btn btn-xs btn-circle btn-ghost text-primary bg-primary/10"
                                                            >
                                                                <Pencil size={12} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(book._id)}
                                                                className="btn btn-xs btn-circle btn-ghost text-error bg-error/10"
                                                            >
                                                                <Trash2 size={12} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <h3 className="font-black text-lg text-base-content leading-tight line-clamp-2 mb-1">{book.title}</h3>
                                                    <p className="text-sm text-base-content/60 font-bold mb-3">by {book.author}</p>

                                                    <div className="flex items-center gap-3 text-xs font-bold bg-base-200/50 p-2 rounded-lg w-fit">
                                                        <span className="flex items-center gap-1 text-warning"><span className="text-sm">★</span> {(book.averageRating || 0).toFixed(1)}</span>
                                                        <span className="w-1 h-1 rounded-full bg-base-content/20"></span>
                                                        <span className="opacity-60">{book.totalReviews || 0} reviews</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Create/Edit Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-base-100 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-primary/10">
                            <div className="p-8 border-b border-primary/5 flex justify-between items-center bg-primary/5">
                                <h2 className="text-2xl font-black text-base-content tracking-tight">
                                    {editingBook ? "Edit Book" : "Add New Book"}
                                </h2>
                                <button onClick={closeModal} className="btn btn-ghost btn-circle btn-sm hover:bg-black/5">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="form-control w-full">
                                        <label className="label"><span className="label-text font-bold text-base-content/70">Book Title</span></label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            placeholder="Enter book title"
                                            className="input input-bordered w-full rounded-xl bg-base-100 focus:bg-white focus:ring-2 focus:ring-primary/20 shadow-sm"
                                            required
                                        />
                                    </div>
                                    <div className="form-control w-full">
                                        <label className="label"><span className="label-text font-bold text-base-content/70">Author</span></label>
                                        <input
                                            type="text"
                                            name="author"
                                            value={formData.author}
                                            onChange={handleInputChange}
                                            placeholder="Author name"
                                            className="input input-bordered w-full rounded-xl bg-base-100 focus:bg-white focus:ring-2 focus:ring-primary/20 shadow-sm"
                                            required
                                        />
                                    </div>
                                    <div className="form-control w-full">
                                        <label className="label"><span className="label-text font-bold text-base-content/70">Genre</span></label>
                                        <select
                                            name="genre"
                                            value={formData.genre}
                                            onChange={handleInputChange}
                                            className="select select-bordered w-full rounded-xl bg-base-100 focus:bg-white focus:ring-2 focus:ring-primary/20 shadow-sm font-medium"
                                            required
                                        >
                                            <option value="">Select Genre</option>
                                            {genres.map(g => <option key={g._id} value={g._id} className="text-base-content">{g.name}</option>)}
                                        </select>
                                    </div>

                                    {/* File Uploads */}
                                    <div className="form-control w-full md:col-span-2">
                                        <label className="label"><span className="label-text font-bold">Description</span></label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            className="textarea textarea-bordered h-24 rounded-xl bg-base-200/50 focus:bg-base-100"
                                            placeholder="Book synopsis..."
                                            required
                                        ></textarea>
                                    </div>

                                    <div className="form-control w-full">
                                        <label className="label"><span className="label-text font-bold">Cover Image</span></label>
                                        <div className="relative group cursor-pointer border-2 border-dashed border-primary/20 rounded-2xl p-4 text-center hover:bg-primary/5 transition-colors">
                                            <input
                                                type="file"
                                                name="coverImage"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                            />
                                            {coverPreview ? (
                                                <div className="relative h-40 w-full rounded-lg overflow-hidden">
                                                    <img src={coverPreview} alt="Preview" className="h-full w-full object-contain" />
                                                </div>
                                            ) : (
                                                <div className="py-8 text-base-content/40">
                                                    <Upload size={32} className="mx-auto mb-2" />
                                                    <span className="text-xs font-bold uppercase tracking-widest block">Upload Cover</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="form-control w-full">
                                        <label className="label"><span className="label-text font-bold">PDF File</span></label>
                                        <div className="relative group cursor-pointer border-2 border-dashed border-primary/20 rounded-2xl p-4 text-center hover:bg-primary/5 transition-colors">
                                            <input
                                                type="file"
                                                name="pdfFile"
                                                accept="application/pdf"
                                                onChange={handleFileChange}
                                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                            />
                                            <div className="py-12 text-base-content/40">
                                                <FileText size={32} className={`mx-auto mb-2 ${pdfName ? 'text-primary' : ''}`} />
                                                <span className="text-xs font-bold uppercase tracking-widest block max-w-full truncate px-4">
                                                    {pdfName || "Upload PDF Book"}
                                                </span>
                                            </div>
                                        </div>
                                        {editingBook?.pdfUrl && !formData.pdfFile && (
                                            <div className="mt-2 text-center">
                                                <a
                                                    href={editingBook.pdfUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs font-bold text-primary hover:underline flex items-center justify-center gap-1"
                                                >
                                                    <ExternalLink size={12} /> View Stored PDF
                                                </a>
                                                <p className="text-[10px] text-base-content/40 mt-1">Confirmed from Database</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="btn btn-primary w-full rounded-xl font-black text-lg shadow-xl shadow-primary/20"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" /> : (editingBook ? "Update Book" : "Create Book")}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </AdminLayout>
        </ProtectedRoute>
    );
};

export default ManageBooks;
