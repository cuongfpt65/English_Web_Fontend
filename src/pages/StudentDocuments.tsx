import { useEffect, useState } from 'react';
import { FiBookOpen, FiDownload, FiEye, FiFile, FiSearch } from 'react-icons/fi';
import DocumentViewer from '../components/DocumentViewer';
import documentService, { type Document, type DocumentCategory } from '../services/documentService';

export default function StudentDocuments() {
    const [categories, setCategories] = useState<DocumentCategory[]>([]);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFileType, setSelectedFileType] = useState<string>('');
    const [viewerOpen, setViewerOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        loadDocuments();
    }, [currentPage, selectedCategory, searchTerm, selectedFileType]);

    const loadCategories = async () => {
        try {
            const data = await documentService.getAllCategories();
            setCategories(data);
        } catch (err: any) {
            console.error('Error loading categories:', err);
        }
    };

    const loadDocuments = async () => {
        try {
            setLoading(true);
            const response = await documentService.getDocuments({
                categoryId: selectedCategory || undefined,
                search: searchTerm || undefined,
                fileType: selectedFileType || undefined,
                page: currentPage,
                pageSize: 12,
            });
            setDocuments(response.items);
            setTotalPages(response.totalPages);
        } catch (err: any) {
            console.error('Error loading documents:', err);
        } finally {
            setLoading(false);
        }
    }; const handleViewDocument = async (doc: Document) => {
        try {
            await documentService.recordView(doc.id);

            // Open in modal viewer
            setSelectedDocument(doc);
            setViewerOpen(true);

            // Refresh to update view count
            loadDocuments();
        } catch (err: any) {
            console.error('Error recording view:', err);
        }
    }; const handleDownloadDocument = async (doc: Document) => {
        try {
            await documentService.recordDownload(doc.id);

            // Create a temporary link to force download
            const link = document.createElement('a');
            link.href = doc.fileUrl;
            link.download = doc.fileName;
            link.setAttribute('download', doc.fileName);
            link.target = '_blank';
            link.rel = 'noopener noreferrer';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Refresh to update download count
            loadDocuments();
        } catch (err: any) {
            console.error('Error recording download:', err);
        }
    }; const getFileIcon = (fileType: string) => {
        const type = fileType.toLowerCase();
        if (type === 'doc' || type === 'docx') return '📘';
        return '📎';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white">
                            <FiBookOpen className="text-2xl" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Thư viện Tài liệu</h1>
                            <p className="text-gray-600">Khám phá và học tập từ các tài liệu chất lượng</p>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm tài liệu..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <select
                            value={selectedCategory}
                            onChange={(e) => {
                                setSelectedCategory(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">📚 Tất cả danh mục</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name} ({cat.documentCount})
                                </option>
                            ))}
                        </select>                        <select
                            value={selectedFileType}
                            onChange={(e) => {
                                setSelectedFileType(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">📎 Tất cả định dạng</option>
                            <option value="doc">DOC</option>
                            <option value="docx">DOCX</option>
                        </select>
                    </div>
                </div>

                {/* Documents Grid */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    {loading ? (
                        <div className="text-center py-16">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Đang tải tài liệu...</p>
                        </div>
                    ) : documents.length === 0 ? (
                        <div className="text-center py-16 text-gray-500">
                            <FiFile className="mx-auto text-6xl mb-4 opacity-30" />
                            <p className="text-xl">Không tìm thấy tài liệu nào</p>
                            <p className="text-sm mt-2">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {documents.map(doc => (
                                    <div
                                        key={doc.id}
                                        className="group bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-5 hover:shadow-xl hover:scale-105 transition-all duration-300"
                                    >
                                        {/* File Icon */}
                                        <div className="w-full h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-6xl mb-4 group-hover:from-blue-600 group-hover:to-purple-600 transition">
                                            {getFileIcon(doc.fileType)}
                                        </div>

                                        {/* Document Info */}
                                        <div className="mb-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="font-bold text-gray-800 text-lg line-clamp-2 flex-1">
                                                    {doc.title}
                                                </h3>
                                                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                                                    {doc.fileType.toUpperCase()}
                                                </span>
                                            </div>

                                            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                                                {doc.description || 'Không có mô tả'}
                                            </p>

                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <FiEye className="text-blue-500" /> {doc.viewCount}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <FiDownload className="text-green-500" /> {doc.downloadCount}
                                                </span>
                                                <span className="text-gray-400">•</span>
                                                <span>{doc.fileSizeFormatted}</span>
                                            </div>

                                            <div className="mt-2 pt-2 border-t border-gray-200">
                                                <p className="text-xs text-gray-500">
                                                    📂 {doc.categoryName}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    👤 {doc.uploadedByName} • {new Date(doc.createdAt).toLocaleDateString('vi-VN')}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleViewDocument(doc)}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition font-medium"
                                            >
                                                <FiEye /> Xem
                                            </button>
                                            <button
                                                onClick={() => handleDownloadDocument(doc)}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition font-medium"
                                            >
                                                <FiDownload /> Tải
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center gap-2 mt-8">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        ← Trước
                                    </button>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`px-4 py-2 rounded-lg transition ${currentPage === page
                                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Sau →
                                    </button>
                                </div>
                            )}                            {/* Summary */}
                            <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
                                Hiển thị <span className="font-semibold text-blue-600">{documents.length}</span> tài liệu
                                {searchTerm && (
                                    <span> cho từ khóa "<span className="font-semibold">{searchTerm}</span>"</span>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Document Viewer Modal */}
            {selectedDocument && (
                <DocumentViewer
                    isOpen={viewerOpen}
                    onClose={() => {
                        setViewerOpen(false);
                        setSelectedDocument(null);
                    }}
                    document={selectedDocument}
                    onDownload={() => handleDownloadDocument(selectedDocument)}
                />
            )}
        </div>
    );
}
