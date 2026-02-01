import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { myVocabService } from '../../services/myVocabService';
import AddVocabularyModal from './components/AddVocabularyModal';
import EditVocabularyModal from './components/EditVocabularyModal';
import VocabularyCard from './components/VocabularyCard';
import VocabularyStats from './components/VocabularyStats';
import type { MyVocab } from './types';

const MyVocabularyPage: React.FC = () => {
    const [vocabularies, setVocabularies] = useState<MyVocab[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingVocab, setEditingVocab] = useState<MyVocab | null>(null);

    // Filters
    const [selectedTopic, setSelectedTopic] = useState<string>('');
    const [selectedLevel, setSelectedLevel] = useState<string>('');
    const [isLearnedFilter, setIsLearnedFilter] = useState<string>('all'); // 'all', 'learned', 'not-learned'
    const [searchQuery, setSearchQuery] = useState('');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const pageSize = 12;    // Available topics and levels
    const [topics, setTopics] = useState<string[]>([]);
    const [levels, setLevels] = useState<string[]>([]);    // Batch selection
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isSelectionMode, setIsSelectionMode] = useState(false);

    // Track words that already exist in global vocabulary
    const [existingInGlobal, setExistingInGlobal] = useState<Set<string>>(new Set());

    // Statistics
    const [stats, setStats] = useState({
        totalWords: 0,
        learnedWords: 0,
        notLearnedWords: 0
    });

    useEffect(() => {
        fetchVocabularies();
        fetchTopics();
        fetchLevels();
        fetchStatistics();
    }, [currentPage, selectedTopic, selectedLevel, isLearnedFilter, searchQuery]);

    const fetchVocabularies = async () => {
        setLoading(true);
        try {
            const params: any = {
                page: currentPage,
                pageSize: pageSize
            };

            if (selectedTopic) params.topic = selectedTopic;
            if (selectedLevel) params.level = selectedLevel;
            if (isLearnedFilter !== 'all') {
                params.isLearned = isLearnedFilter === 'learned';
            }
            if (searchQuery) params.search = searchQuery; const response = await api.get('/MyVocab', { params });

            setVocabularies(response.data.items);
            setTotalPages(response.data.totalPages);
            setTotalItems(response.data.totalItems);

            // Check which words already exist in global vocabulary
            if (response.data.items.length > 0) {
                const existing = await myVocabService.checkExistingInGlobalVocabulary(response.data.items);
                setExistingInGlobal(existing);
            } else {
                setExistingInGlobal(new Set());
            }
        } catch (error) {
            console.error('Failed to fetch vocabularies:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTopics = async () => {
        try {
            const response = await api.get('/MyVocab/topics');
            setTopics(response.data);
        } catch (error) {
            console.error('Failed to fetch topics:', error);
        }
    };

    const fetchLevels = async () => {
        try {
            const response = await api.get('/MyVocab/levels');
            setLevels(response.data);
        } catch (error) {
            console.error('Failed to fetch levels:', error);
        }
    };

    const fetchStatistics = async () => {
        try {
            const response = await api.get('/MyVocab/statistics');
            setStats({
                totalWords: response.data.totalWords,
                learnedWords: response.data.learnedWords,
                notLearnedWords: response.data.notLearnedWords
            });
        } catch (error) {
            console.error('Failed to fetch statistics:', error);
        }
    };

    const handleAddVocabulary = async (vocab: Partial<MyVocab>) => {
        try {
            await api.post('/MyVocab', vocab);
            setShowAddModal(false);
            fetchVocabularies();
            fetchStatistics();
            fetchTopics();
            fetchLevels();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Không thể thêm từ vựng');
            throw error;
        }
    };

    const handleUpdateVocabulary = async (id: string, vocab: Partial<MyVocab>) => {
        try {
            await api.put(`/MyVocab/${id}`, vocab);
            setEditingVocab(null);
            fetchVocabularies();
            fetchStatistics();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Không thể cập nhật từ vựng');
            throw error;
        }
    };

    const handleDeleteVocabulary = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xóa từ vựng này?')) return;

        try {
            await api.delete(`/MyVocab/${id}`);
            fetchVocabularies();
            fetchStatistics();
        } catch (error) {
            alert('Không thể xóa từ vựng');
        }
    }; const handleToggleLearned = async (id: string) => {
        try {
            await api.patch(`/MyVocab/${id}/toggle-learned`);
            fetchVocabularies();
            fetchStatistics();
        } catch (error) {
            alert('Không thể cập nhật trạng thái');
        }
    }; const handleAddToGlobalVocabulary = async (id: string, word: string) => {
        if (!confirm(`Bạn có muốn thêm từ "${word}" vào từ điển chung?`)) return;

        try {
            const result = await myVocabService.addToGlobalVocabulary(id);

            if (result.success) {
                alert(`✅ ${result.message}`);
            } else {
                alert(`ℹ️ ${result.message}`);
            }
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || 'Không thể thêm từ vào từ điển chung';
            alert(`❌ ${errorMsg}`);
            console.error('Error adding to global vocabulary:', error);
        }
    };

    const handleBatchAddToGlobal = async () => {
        if (selectedIds.size === 0) {
            alert('Vui lòng chọn ít nhất một từ vựng');
            return;
        }

        if (!confirm(`Bạn có muốn thêm ${selectedIds.size} từ vào từ điển chung?`)) return;

        try {
            const ids = Array.from(selectedIds);
            const result = await myVocabService.addMultipleToGlobalVocabulary(ids);

            let message = `✅ Kết quả:\n`;
            message += `- Đã thêm: ${result.addedCount} từ\n`;
            message += `- Bỏ qua (đã tồn tại): ${result.skippedCount} từ\n`;
            if (result.failedCount > 0) {
                message += `- Lỗi: ${result.failedCount} từ\n`;
            }

            alert(message);

            // Reset selection
            setSelectedIds(new Set());
            setIsSelectionMode(false);
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || 'Không thể thêm từ vào từ điển chung';
            alert(`❌ ${errorMsg}`);
            console.error('Error batch adding to global vocabulary:', error);
        }
    };

    const toggleSelection = (id: string) => {
        const newSelection = new Set(selectedIds);
        if (newSelection.has(id)) {
            newSelection.delete(id);
        } else {
            newSelection.add(id);
        }
        setSelectedIds(newSelection);
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === vocabularies.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(vocabularies.map(v => v.id)));
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchVocabularies();
    };

    const clearFilters = () => {
        setSelectedTopic('');
        setSelectedLevel('');
        setIsLearnedFilter('all');
        setSearchQuery('');
        setCurrentPage(1);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                📚 My Vocabulary
                            </h1>
                            <p className="text-gray-600 mt-1">Kho từ vựng cá nhân của bạn</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setIsSelectionMode(!isSelectionMode);
                                    setSelectedIds(new Set());
                                }}
                                className={`px-6 py-3 font-bold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center gap-2 ${isSelectionMode
                                    ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700'
                                    : 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700'
                                    }`}
                            >
                                {isSelectionMode ? '❌ Hủy chọn' : '☑️ Chọn nhiều'}
                            </button>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                            >
                                <span className="text-xl">+</span>
                                Thêm từ mới
                            </button>
                        </div>
                    </div>

                    {/* Batch Actions Bar */}
                    {isSelectionMode && (
                        <div className="mb-4 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border-2 border-emerald-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={toggleSelectAll}
                                        className="px-4 py-2 bg-white border-2 border-emerald-500 text-emerald-700 font-semibold rounded-lg hover:bg-emerald-50 transition-colors"
                                    >
                                        {selectedIds.size === vocabularies.length ? '✓ Bỏ chọn tất cả' : '☑️ Chọn tất cả'}
                                    </button>
                                    <span className="text-emerald-700 font-semibold">
                                        Đã chọn: {selectedIds.size} / {vocabularies.length}
                                    </span>
                                </div>
                                <button
                                    onClick={handleBatchAddToGlobal}
                                    disabled={selectedIds.size === 0}
                                    className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-lg hover:from-emerald-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                                >
                                    🌐 Thêm {selectedIds.size > 0 ? selectedIds.size : ''} từ vào Vocabulary
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Statistics */}
                    <VocabularyStats
                        totalWords={stats.totalWords}
                        learnedWords={stats.learnedWords}
                        notLearnedWords={stats.notLearnedWords}
                    />
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <form onSubmit={handleSearch} className="space-y-4">
                        {/* Search */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                🔍 Tìm kiếm
                            </label>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Tìm từ hoặc nghĩa..."
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>

                        {/* Filters Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    📂 Chủ đề
                                </label>
                                <select
                                    value={selectedTopic}
                                    onChange={(e) => {
                                        setSelectedTopic(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                >
                                    <option value="">Tất cả chủ đề</option>
                                    {topics.map(topic => (
                                        <option key={topic} value={topic}>{topic}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    📊 Cấp độ
                                </label>
                                <select
                                    value={selectedLevel}
                                    onChange={(e) => {
                                        setSelectedLevel(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                >
                                    <option value="">Tất cả cấp độ</option>
                                    {levels.map(level => (
                                        <option key={level} value={level}>{level}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    ✅ Trạng thái
                                </label>
                                <select
                                    value={isLearnedFilter}
                                    onChange={(e) => {
                                        setIsLearnedFilter(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                >
                                    <option value="all">Tất cả</option>
                                    <option value="learned">Đã học</option>
                                    <option value="not-learned">Chưa học</option>
                                </select>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition-colors"
                            >
                                Tìm kiếm
                            </button>
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Xóa bộ lọc
                            </button>
                        </div>
                    </form>
                </div>

                {/* Vocabulary Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
                            <p className="text-gray-600 font-semibold">Đang tải...</p>
                        </div>
                    </div>
                ) : vocabularies.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <div className="text-6xl mb-4">📝</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">
                            Chưa có từ vựng nào
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Hãy bắt đầu thêm từ vựng của riêng bạn!
                        </p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all shadow-lg"
                        >
                            + Thêm từ đầu tiên
                        </button>
                    </div>
                ) : (
                    <>                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        {vocabularies.map(vocab => (
                            <VocabularyCard
                                key={vocab.id}
                                vocabulary={vocab}
                                onEdit={() => setEditingVocab(vocab)}
                                onDelete={() => handleDeleteVocabulary(vocab.id)}
                                onToggleLearned={() => handleToggleLearned(vocab.id)}
                                onAddToGlobal={() => handleAddToGlobalVocabulary(vocab.id, vocab.word)}
                                isSelectionMode={isSelectionMode}
                                isSelected={selectedIds.has(vocab.id)}
                                onToggleSelect={() => toggleSelection(vocab.id)}
                                existsInGlobal={existingInGlobal.has(vocab.word.toLowerCase())}
                            />
                        ))}
                    </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-600">
                                        Hiển thị {vocabularies.length} / {totalItems} từ vựng
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            ← Trước
                                        </button>
                                        <span className="px-4 py-2 bg-purple-100 text-purple-700 font-semibold rounded-lg">
                                            {currentPage} / {totalPages}
                                        </span>
                                        <button
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Sau →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modals */}
            {showAddModal && (
                <AddVocabularyModal
                    onClose={() => setShowAddModal(false)}
                    onAdd={handleAddVocabulary}
                />
            )}

            {editingVocab && (
                <EditVocabularyModal
                    vocabulary={editingVocab}
                    onClose={() => setEditingVocab(null)}
                    onUpdate={handleUpdateVocabulary}
                />
            )}
        </div>
    );
};

export default MyVocabularyPage;
