import React from 'react';
import { useVocabularyStore, type VocabularyFilters as FilterType } from '../../../store/vocabularyStore';

interface VocabularyFiltersProps {
    filters: FilterType;
    onFilterChange: (filters: Partial<FilterType>) => void;
    onReset: () => void;
}

const VocabularyFilters: React.FC<VocabularyFiltersProps> = ({
    filters,
    onFilterChange,
    onReset,
}) => {
    const { topics, levels } = useVocabularyStore();

    const hasActiveFilters = filters.topic || filters.level || filters.search;

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
                    {/* Topic Filter */}
                    <div className="flex-1 min-w-0">
                        <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
                            Topic
                        </label>
                        <select
                            id="topic"
                            value={filters.topic || ''}
                            onChange={(e) => onFilterChange({ topic: e.target.value || undefined })}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                            <option value="">All Topics</option>
                            {topics.map((topic) => (
                                <option key={topic} value={topic}>
                                    {topic}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Level Filter */}
                    <div className="flex-1 min-w-0">
                        <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                            Level
                        </label>
                        <select
                            id="level"
                            value={filters.level || ''}
                            onChange={(e) => onFilterChange({ level: e.target.value || undefined })}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                            <option value="">All Levels</option>
                            {levels.map((level) => (
                                <option key={level} value={level}>
                                    {level}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Page Size Filter */}
                    <div className="flex-1 min-w-0">
                        <label htmlFor="pageSize" className="block text-sm font-medium text-gray-700 mb-1">
                            Per Page
                        </label>
                        <select
                            id="pageSize"
                            value={filters.pageSize}
                            onChange={(e) => onFilterChange({ pageSize: parseInt(e.target.value), page: 1 })}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                            <option value={12}>12 words</option>
                            <option value={20}>20 words</option>
                            <option value={36}>36 words</option>
                            <option value={48}>48 words</option>
                        </select>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                    {hasActiveFilters && (
                        <button
                            onClick={onReset}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Clear Filters
                        </button>
                    )}

                    {/* Filter Status */}
                    <div className="text-sm text-gray-500">
                        {hasActiveFilters && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {[
                                    filters.topic && `Topic: ${filters.topic}`,
                                    filters.level && `Level: ${filters.level}`,
                                    filters.search && `Search: "${filters.search}"`
                                ].filter(Boolean).length} filter{[filters.topic, filters.level, filters.search].filter(Boolean).length > 1 ? 's' : ''} active
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex flex-wrap gap-2">
                        {filters.topic && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Topic: {filters.topic}
                                <button
                                    onClick={() => onFilterChange({ topic: undefined })}
                                    className="ml-2 text-blue-600 hover:text-blue-800"
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </span>
                        )}

                        {filters.level && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Level: {filters.level}
                                <button
                                    onClick={() => onFilterChange({ level: undefined })}
                                    className="ml-2 text-green-600 hover:text-green-800"
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </span>
                        )}

                        {filters.search && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                Search: "{filters.search}"
                                <button
                                    onClick={() => onFilterChange({ search: undefined })}
                                    className="ml-2 text-purple-600 hover:text-purple-800"
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VocabularyFilters;
