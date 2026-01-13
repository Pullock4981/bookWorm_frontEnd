"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import bookService from "@/services/bookService";
import libraryService from "@/services/libraryService";
import { Loader2, ArrowLeft, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const BookReader = () => {
    const { id } = useParams();
    const router = useRouter();
    const containerRef = useRef(null);
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);
    const [containerWidth, setContainerWidth] = useState(null);
    const [initialLoad, setInitialLoad] = useState(true);

    useEffect(() => {
        const fetchBookAndProgress = async () => {
            try {
                const [bookData, libraryData] = await Promise.all([
                    bookService.getBookById(id),
                    libraryService.getMyLibrary()
                ]);

                setBook(bookData);

                // Find progress for this book
                const entry = libraryData.find(item => item.book._id === id || item.book === id);
                if (entry && entry.pagesRead > 0) {
                    setPageNumber(entry.pagesRead);
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
                setInitialLoad(false);
            }
        };

        if (id) {
            fetchBookAndProgress();
        }
    }, [id]);

    // Handle responsive width
    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.clientWidth);
            }
        };

        // Initial set
        updateWidth();

        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, [loading]);

    // Sync progress with backend
    const updateProgress = async (pageNum, total) => {
        try {
            // Use local numPages state if 'total' arg is missing, but 'total' is safer if coming from event
            const finalTotal = total || numPages;
            await libraryService.updateProgress(id, pageNum, finalTotal);
        } catch (error) {
            console.error("Failed to update progress:", error);
        }
    };

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        // If it's a 1-page book, mark it as read immediately
        if (numPages === 1) {
            updateProgress(1, 1);
        }
    }

    const changePage = (offset) => {
        setPageNumber(prevPageNumber => {
            const newPage = prevPageNumber + offset;
            updateProgress(newPage, numPages);
            return newPage;
        });
    };

    const previousPage = () => changePage(-1);
    const nextPage = () => changePage(1);

    const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 2.0));
    const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5));

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-base-100">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    if (!book || !book.pdfUrl) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-base-100 gap-4">
                <h2 className="text-2xl font-bold text-error">PDF Not Found</h2>
                <button onClick={() => router.back()} className="btn btn-primary">Go Back</button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-base-200">
            {/* Header */}
            <header className="bg-base-100 shadow-md p-4 flex flex-col md:flex-row items-center justify-between gap-4 z-10 shrink-0">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <button onClick={() => router.back()} className="btn btn-circle btn-ghost btn-sm">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex-grow md:flex-grow-0">
                        <h1 className="font-bold text-lg line-clamp-1">{book.title}</h1>
                        <p className="text-xs text-base-content/60">
                            {book.author}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4 justify-between w-full md:w-auto">
                    {/* Zoom Controls */}
                    <div className="join bg-base-200 rounded-lg">
                        <button className="btn btn-sm join-item btn-ghost" onClick={handleZoomOut}><ZoomOut size={16} /></button>
                        <span className="btn btn-sm join-item btn-ghost no-animation pointer-events-none font-mono text-xs w-16">
                            {Math.round(scale * 100)}%
                        </span>
                        <button className="btn btn-sm join-item btn-ghost" onClick={handleZoomIn}><ZoomIn size={16} /></button>
                    </div>

                    {pageNumber === numPages && (
                        <div className="badge badge-success gap-1 font-bold animate-in zoom-in">
                            ✓ Completed
                        </div>
                    )}

                    {/* Page Controls */}
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-bold opacity-70 whitespace-nowrap hidden sm:block">
                            Page {pageNumber} of {numPages || '--'}
                        </p>
                        <div className="join">
                            <button
                                className="btn btn-sm join-item"
                                disabled={pageNumber <= 1}
                                onClick={previousPage}
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button
                                className="btn btn-sm join-item"
                                disabled={pageNumber >= numPages}
                                onClick={nextPage}
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* PDF Viewer */}
            <div className="flex-grow w-full relative bg-base-300 overflow-auto flex justify-center p-4 md:p-8" ref={containerRef}>
                <div className="shadow-2xl transition-transform duration-200" style={{ transformOrigin: 'top center' }}>
                    <Document
                        file={book.pdfUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                        loading={
                            <div className="flex items-center justify-center h-96 w-full md:w-[600px] bg-white rounded-lg">
                                <Loader2 className="animate-spin text-primary" size={32} />
                            </div>
                        }
                        error={
                            <div className="flex items-center justify-center h-96 w-full md:w-[600px] bg-white rounded-lg text-error font-bold p-4 text-center">
                                Failed to load PDF file.
                            </div>
                        }
                        className="flex justify-center"
                    >
                        <Page
                            pageNumber={pageNumber}
                            scale={scale}
                            className="text-transparent bg-white"
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                            width={containerWidth ? Math.min(containerWidth - 40, 800) : 300} // Responsive width calculation
                        />
                    </Document>
                </div>
            </div>

            {/* Mobile Page Indicator (Sticky Bottom) */}
            <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 bg-base-100/90 backdrop-blur shadow-lg px-4 py-2 rounded-full border border-base-content/10 z-20">
                <span className="text-xs font-bold">
                    Page {pageNumber} of {numPages || '--'}
                </span>
            </div>
        </div>
    );
};

export default BookReader;
