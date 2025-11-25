import React, { useEffect, useState } from 'react';
import { useVocabularyStore } from '../../store/vocabularyStore';
import AddVocabularyModal from './components/AddVocabularyModal';
import SearchBar from './components/SearchBar';
import StudyMode from './components/StudyMode';
import VocabularyCard from './components/VocabularyCard';
import VocabularyFilters from './components/VocabularyFilters';
import VocabularyQuiz from './components/VocabularyQuiz';
import VocabularyStatsPanel from './components/VocabularyStatsPanel';

const VocabularyPage: React.FC = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showStudyMode, setShowStudyMode] = useState(false);
    const [showQuiz, setShowQuiz] = useState(false);
    const [viewMode, setViewMode] = useState<'all' | 'learned'>('all');

    const {
        vocabularies,
        userVocabularies,
        isLoading,
        error,
        filters,
        fetchVocabularies,
        fetchUserVocabularies,
        fetchTopics,
        fetchLevels,
        setFilters,
        resetFilters,
        setError,
    } = useVocabularyStore();

    useEffect(() => {
        fetchTopics();
        fetchLevels();
        if (viewMode === 'all') {
            fetchVocabularies();
        } else {
            fetchUserVocabularies(true);
        }
    }, [fetchVocabularies, fetchUserVocabularies, fetchTopics, fetchLevels, viewMode, filters]);

    const handleSearch = (searchTerm: string) => {
        if (searchTerm.trim()) {
            setFilters({ search: searchTerm, page: 1 });
        } else {
            setFilters({ search: undefined });
            fetchVocabularies();
        }
    };

    const handleFilterChange = (newFilters: any) => {
        setFilters({ ...newFilters, page: 1 });
    };

    const handlePageChange = (page: number) => {
        setFilters({ page });
    };

    const handleResetFilters = () => {
        resetFilters();
        setError(null);
    };

    const displayVocabularies = viewMode === 'all'
        ? vocabularies
        : userVocabularies.map(uv => uv.vocabulary);    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-peach-50 py-4 lg:py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-6 lg:mb-8">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2 lg:gap-3">
                            <div className="w-10 lg:w-14 h-10 lg:h-14 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg">
                                <span className="text-2xl lg:text-3xl">📖</span>
                            </div>
                            <div>
                                <h1 className="text-2xl lg:text-4xl font-extrabold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
                                    My Vocabulary
                                </h1>
                                <p className="mt-1 text-sm lg:text-base text-gray-600 font-medium">
                                    Expand your English vocabulary! ✨
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">                            <button
                                onClick={() => setShowStudyMode(true)}
                                disabled={displayVocabularies.length === 0}
                                className="flex-1 sm:flex-initial inline-flex items-center justify-center px-3 lg:px-4 py-2 lg:py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 border-2 border-transparent rounded-lg lg:rounded-xl font-bold text-white hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm lg:text-base"
                            >
                                <svg className="w-4 lg:w-5 h-4 lg:h-5 mr-1 lg:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                <span className="hidden sm:inline">Study Mode</span>
                                <span className="sm:hidden">Study</span>
                            </button>
                            <button
                                onClick={() => setShowQuiz(true)}
                                disabled={displayVocabularies.length < 4}
                                className="flex-1 sm:flex-initial inline-flex items-center justify-center px-3 lg:px-4 py-2 lg:py-2.5 bg-gradient-to-r from-purple-500 to-violet-600 border-2 border-transparent rounded-lg lg:rounded-xl font-bold text-white hover:from-purple-600 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm lg:text-base"
                            >
                                <svg className="w-4 lg:w-5 h-4 lg:h-5 mr-1 lg:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                                Quiz
                            </button>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="flex-1 sm:flex-initial inline-flex items-center justify-center px-3 lg:px-4 py-2 lg:py-2.5 bg-gradient-to-r from-orange-500 to-pink-600 border-2 border-transparent rounded-lg lg:rounded-xl font-bold text-white hover:from-orange-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform text-sm lg:text-base"
                            >
                                <svg className="w-4 lg:w-5 h-4 lg:h-5 mr-1 lg:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <span className="hidden sm:inline">Add Word</span>
                                <span className="sm:hidden">Add</span>
                            </button>
                            </div>
                        </div>
                    </div>                {/* View Mode Toggle */}
                    <div className="mb-6">
                        <div className="flex bg-white rounded-2xl p-1.5 shadow-lg border-2 border-gray-100 w-fit">
                            <button
                                onClick={() => setViewMode('all')}
                                className={`px-5 py-3 rounded-xl text-sm font-bold transition-all transform ${viewMode === 'all'
                                    ? 'bg-gradient-to-r from-orange-400 to-pink-500 text-white shadow-lg scale-105'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                📚 All Words ({vocabularies.length})
                            </button>
                            <button
                                onClick={() => setViewMode('learned')}
                                className={`px-5 py-3 rounded-xl text-sm font-bold transition-all transform ${viewMode === 'learned'
                                    ? 'bg-gradient-to-r from-orange-400 to-pink-500 text-white shadow-lg scale-105'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                ⭐ Learned ({userVocabularies.filter(uv => uv.isLearned).length})
                            </button>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="mb-6 space-y-4">
                        <SearchBar onSearch={handleSearch} />
                        <VocabularyFilters
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            onReset={handleResetFilters}
                        />
                    </div>                {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 text-red-700 rounded-2xl shadow-md">
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">⚠️</span>
                                <span className="flex-1 font-medium">{error}</span>
                            </div>
                        </div>
                    )}

                    {/* Loading Spinner */}
                    {isLoading && (
                        <div className="flex justify-center items-center py-12">
                            <div className="inline-block">
                                <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                                <p className="mt-4 text-lg font-bold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
                                    Loading vocabulary...
                                </p>
                            </div>
                        </div>
                    )}{/* Vocabulary Grid */}
                    {!isLoading && (
                        <>
                            {displayVocabularies.length > 0 ? (
                                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                                    {/* Stats Panel */}
                                    <div className="lg:col-span-1">
                                        <VocabularyStatsPanel />
                                    </div>

                                    {/* Vocabulary Cards */}
                                    <div className="lg:col-span-3">
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                            {displayVocabularies.map((vocabulary) => (
                                                <VocabularyCard
                                                    key={vocabulary.id}
                                                    vocabulary={vocabulary}
                                                    isLearned={userVocabularies.some(uv =>
                                                        uv.vocabulary.id === vocabulary.id && uv.isLearned
                                                    )}
                                                    userNote={userVocabularies.find(uv =>
                                                        uv.vocabulary.id === vocabulary.id
                                                    )?.note}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>) : (
                                <div className="text-center py-16">
                                    <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-orange-100 to-pink-100 rounded-3xl flex items-center justify-center">
                                        <span className="text-6xl">📖</span>
                                    </div>
                                    <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent mb-3">
                                        No vocabulary found
                                    </h3>
                                    <p className="text-gray-500 font-medium mb-4">
                                        {viewMode === 'learned'
                                            ? "You haven't learned any words yet. Start learning! 🚀"
                                            : "No words match your search criteria. Try adjusting your filters. 🔍"
                                        }
                                    </p>
                                    {viewMode === 'all' && (
                                        <button
                                            onClick={handleResetFilters}
                                            className="mt-4 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform"
                                        >
                                            Clear all filters
                                        </button>
                                    )}
                                </div>
                            )}                        {/* Pagination */}
                            {displayVocabularies.length > 0 && viewMode === 'all' && (
                                <div className="mt-8 flex justify-center">
                                    <nav className="relative z-0 inline-flex gap-2 items-center">
                                        <button
                                            onClick={() => handlePageChange(Math.max(1, filters.page - 1))}
                                            disabled={filters.page <= 1}
                                            className="px-4 py-2.5 rounded-xl border-2 border-gray-200 bg-white text-sm font-bold text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 hover:border-pink-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            ← Previous
                                        </button>

                                        <span className="px-5 py-2.5 bg-gradient-to-r from-orange-50 to-pink-50 border-2 border-orange-200 rounded-xl text-sm font-bold text-gray-700">
                                            Page {filters.page}
                                        </span>

                                        <button
                                            onClick={() => handlePageChange(filters.page + 1)}
                                            disabled={displayVocabularies.length < filters.pageSize}
                                            className="px-4 py-2.5 rounded-xl border-2 border-gray-200 bg-white text-sm font-bold text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 hover:border-pink-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Next →
                                        </button>
                                    </nav>
                                </div>
                            )}
                        </>
                    )}
                </div>            {/* Add Vocabulary Modal */}
                <AddVocabularyModal
                    isOpen={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    onSuccess={() => {
                        setShowAddModal(false);
                        if (viewMode === 'all') {
                            fetchVocabularies();
                        }
                    }}
                />            {/* Study Mode */}
                {showStudyMode && displayVocabularies.length > 0 && (
                    <StudyMode
                        vocabularies={displayVocabularies}
                        onClose={() => setShowStudyMode(false)}
                    />
                )}

                {/* Quiz */}
                {showQuiz && displayVocabularies.length >= 4 && (
                    <VocabularyQuiz
                        vocabularies={displayVocabularies}
                        onClose={() => setShowQuiz(false)}
                        onComplete={(score, total) => {
                            console.log(`Quiz completed: ${score}/${total}`);
                            setShowQuiz(false);
                        }}
                    />
                )}
            </div>
        );
};

export default VocabularyPage;
