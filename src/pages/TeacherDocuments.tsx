import { useEffect, useState } from 'react';
import { FiDownload, FiEye, FiFile, FiPlus, FiTrash2, FiUpload, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import documentService, { type Document, type DocumentCategory, type UploadDocumentDto } from '../services/documentService';
import { useAuthStore } from '../store';

export default function TeacherDocuments() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [categories, setCategories] = useState<DocumentCategory[]>([]);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');

    // Form states
    const [uploadForm, setUploadForm] = useState({
        title: '',
        description: '',
        categoryId: '',
    });

    const [categoryForm, setCategoryForm] = useState({
        name: '',
        description: '',
    });

    // Check if user is teacher
    useEffect(() => {
        if (user?.role !== 'Teacher' && user?.role !== 'Admin') {
            navigate('/');
        }
    }, [user, navigate]);

    useEffect(() => {
        loadCategories();
        loadDocuments();
    }, [currentPage, selectedCategory, searchTerm]);

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
                page: currentPage,
                pageSize: 10,
            });
            setDocuments(response.items);
            setTotalPages(response.totalPages);
        } catch (err: any) {
            setError('Không thể tải danh sách tài liệu');
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

            if (!allowedTypes.includes(file.type)) {
                setError('Chỉ chấp nhận file PDF, DOC, DOCX');
                return;
            }

            if (file.size > 52428800) { // 50MB
                setError('File không được vượt quá 50MB');
                return;
            }

            setSelectedFile(file);
            setError('');
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile) {
            setError('Vui lòng chọn file');
            return;
        }

        if (!uploadForm.categoryId) {
            setError('Vui lòng chọn danh mục');
            return;
        }

        try {
            setLoading(true);
            setError('');
            const dto: UploadDocumentDto = {
                ...uploadForm,
                file: selectedFile,
            };

            const result = await documentService.uploadDocument(dto);
            setSuccess(result.message);
            setUploadModalOpen(false);
            setUploadForm({ title: '', description: '', categoryId: '' });
            setSelectedFile(null);
            loadDocuments();

            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Không thể upload tài liệu');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            await documentService.createCategory(categoryForm);
            setSuccess('Tạo danh mục thành công');
            setCategoryModalOpen(false);
            setCategoryForm({ name: '', description: '' });
            loadCategories();

            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Không thể tạo danh mục');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteDocument = async (id: string) => {
        if (!window.confirm('Bạn có chắc muốn xóa tài liệu này?')) return;

        try {
            await documentService.deleteDocument(id);
            setSuccess('Xóa tài liệu thành công');
            loadDocuments();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Không thể xóa tài liệu');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Quản lý Tài liệu</h1>
                            <p className="text-gray-600 mt-2">Upload và quản lý tài liệu học tập</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setCategoryModalOpen(true)}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
                            >
                                <FiPlus /> Danh mục mới
                            </button>
                            <button
                                onClick={() => setUploadModalOpen(true)}
                                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition flex items-center gap-2"
                            >
                                <FiUpload /> Upload Tài liệu
                            </button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-4 mt-4">
                        <select
                            value={selectedCategory}
                            onChange={(e) => {
                                setSelectedCategory(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Tất cả danh mục</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>

                        <input
                            type="text"
                            placeholder="Tìm kiếm tài liệu..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Messages */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
                        {success}
                    </div>
                )}

                {/* Documents List */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Đang tải...</p>
                        </div>
                    ) : documents.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <FiFile className="mx-auto text-6xl mb-4 opacity-50" />
                            <p>Chưa có tài liệu nào</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid gap-4">
                                {documents.map(doc => (
                                    <div key={doc.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-4 flex-1">
                                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white">
                                                    <FiFile className="text-2xl" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-lg text-gray-800">{doc.title}</h3>
                                                    <p className="text-gray-600 text-sm mt-1">{doc.description}</p>
                                                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            <FiEye /> {doc.viewCount} lượt xem
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <FiDownload /> {doc.downloadCount} lượt tải
                                                        </span>
                                                        <span>{doc.fileSizeFormatted}</span>
                                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                                            {doc.fileType.toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-400 mt-2">
                                                        Danh mục: {doc.categoryName} • {new Date(doc.createdAt).toLocaleDateString('vi-VN')}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <a
                                                    href={doc.fileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                    title="Xem tài liệu"
                                                >
                                                    <FiEye className="text-xl" />
                                                </a>
                                                <button
                                                    onClick={() => handleDeleteDocument(doc.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                    title="Xóa"
                                                >
                                                    <FiTrash2 className="text-xl" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center gap-2 mt-6">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`px-4 py-2 rounded-lg transition ${currentPage === page
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Upload Modal */}
            {uploadModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-800">Upload Tài liệu</h2>
                            <button
                                onClick={() => setUploadModalOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition"
                            >
                                <FiX className="text-2xl" />
                            </button>
                        </div>

                        <form onSubmit={handleUpload} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề *</label>
                                <input
                                    type="text"
                                    required
                                    value={uploadForm.title}
                                    onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Nhập tiêu đề tài liệu"
                                />
                            </div>                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả *</label>
                                <textarea
                                    required
                                    value={uploadForm.description}
                                    onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows={3}
                                    placeholder="Mô tả về tài liệu"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục *</label>
                                <select
                                    required
                                    value={uploadForm.categoryId}
                                    onChange={(e) => setUploadForm({ ...uploadForm, categoryId: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Chọn danh mục</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">File *</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition">
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                        id="file-upload"
                                    />
                                    <label htmlFor="file-upload" className="cursor-pointer">
                                        <FiUpload className="mx-auto text-4xl text-gray-400 mb-2" />
                                        {selectedFile ? (
                                            <div>
                                                <p className="font-medium text-gray-700">{selectedFile.name}</p>
                                                <p className="text-sm text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </div>
                                        ) : (
                                            <div>
                                                <p className="text-gray-600">Nhấn để chọn file</p>
                                                <p className="text-sm text-gray-500">PDF, DOC, DOCX (tối đa 50MB)</p>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setUploadModalOpen(false)}
                                    className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || !selectedFile}
                                    className="flex-1 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Đang upload...' : 'Upload'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Category Modal */}
            {categoryModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-800">Tạo Danh mục</h2>
                            <button
                                onClick={() => setCategoryModalOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition"
                            >
                                <FiX className="text-2xl" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateCategory} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tên danh mục *</label>
                                <input
                                    type="text"
                                    required
                                    value={categoryForm.name}
                                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Ví dụ: Ngữ pháp, Từ vựng..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                                <textarea
                                    value={categoryForm.description}
                                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows={3}
                                    placeholder="Mô tả về danh mục"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setCategoryModalOpen(false)}
                                    className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition disabled:opacity-50"
                                >
                                    {loading ? 'Đang tạo...' : 'Tạo'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
