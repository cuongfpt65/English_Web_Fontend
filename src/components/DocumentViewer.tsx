import { useEffect, useState } from 'react';
import { FiDownload, FiExternalLink, FiX } from 'react-icons/fi';

interface DocumentViewerProps {
    isOpen: boolean;
    onClose: () => void;
    document: {
        id: string;
        title: string;
        fileName: string;
        fileUrl: string;
        fileType: string;
        fileSizeFormatted: string;
    };
    onDownload?: () => void;
}

export default function DocumentViewer({ isOpen, onClose, document: doc, onDownload }: DocumentViewerProps) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            setIsLoading(true);
            // Disable body scroll when modal is open
            window.document.body.style.overflow = 'hidden';
        } else {
            window.document.body.style.overflow = 'unset';
        }

        return () => {
            window.document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]); if (!isOpen) return null;

    // Use Google Docs Viewer for all documents (DOC/DOCX only)
    const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(doc.fileUrl)}&embedded=true`;

    const handleOpenInNewTab = () => {
        window.open(doc.fileUrl, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full h-full max-w-7xl max-h-[95vh] flex flex-col">
                {/* Header */}                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-2xl">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-bold truncate">{doc.title}</h2>
                        <p className="text-sm opacity-90 truncate">
                            {doc.fileName} • {doc.fileSizeFormatted} • {doc.fileType.toUpperCase()}
                        </p>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                        {onDownload && (
                            <button
                                onClick={onDownload}
                                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition"
                                title="Tải xuống"
                            >
                                <FiDownload className="text-xl" />
                            </button>
                        )}
                        <button
                            onClick={handleOpenInNewTab}
                            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition"
                            title="Mở trong tab mới"
                        >
                            <FiExternalLink className="text-xl" />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition"
                            title="Đóng"
                        >
                            <FiX className="text-2xl" />
                        </button>
                    </div>
                </div>                {/* Document Viewer */}
                <div className="flex-1 relative overflow-hidden bg-gray-100">
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-gray-600 font-medium">Đang tải tài liệu...</p>
                                <p className="text-gray-500 text-sm mt-2">
                                    Đang khởi chạy Google Docs Viewer
                                </p>
                            </div>
                        </div>
                    )}
                    <iframe
                        src={viewerUrl}
                        className="w-full h-full border-0"
                        title={doc.title}
                        onLoad={() => setIsLoading(false)}
                        onError={() => {
                            setIsLoading(false);
                            alert('Không thể tải tài liệu. Vui lòng thử mở trong tab mới.');
                        }}
                    />
                </div>                {/* Footer */}
                <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-2xl flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-4">
                        <span>📘 Google Docs Viewer</span>
                        <span className="text-gray-400">•</span>
                        <span>Nhấn ESC để đóng</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition font-medium"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}
