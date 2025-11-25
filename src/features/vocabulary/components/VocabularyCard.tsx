import React, { useState } from 'react';
import { type Vocabulary, useVocabularyStore } from '../../../store/vocabularyStore';

interface VocabularyCardProps {
    vocabulary: Vocabulary;
    isLearned?: boolean;
    userNote?: string;
}

const VocabularyCard: React.FC<VocabularyCardProps> = ({ vocabulary, isLearned, userNote }) => {
    const [showMeaning, setShowMeaning] = useState(false);
    const [showLearnModal, setShowLearnModal] = useState(false);
    const [note, setNote] = useState(userNote || '');
    const { markAsLearned, isLoading } = useVocabularyStore();

    const handleMarkAsLearned = async () => {
        try {
            await markAsLearned(vocabulary.id, note);
            setShowLearnModal(false);
        } catch (error) {
            console.error('Failed to mark as learned:', error);
        }
    };

    const getLevelColor = (level: string) => {
        switch (level.toLowerCase()) {
            case 'beginner':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'intermediate':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'advanced':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getTopicColor = (topic: string) => {
        const colors = [
            'bg-blue-100 text-blue-800 border-blue-200',
            'bg-purple-100 text-purple-800 border-purple-200',
            'bg-pink-100 text-pink-800 border-pink-200',
            'bg-indigo-100 text-indigo-800 border-indigo-200',
            'bg-cyan-100 text-cyan-800 border-cyan-200',
        ];
        const hash = topic.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[hash % colors.length];
    };    return (
        <>
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:scale-105 transform">
                {/* Card Header */}
                <div className="p-3 lg:p-4 border-b border-gray-100">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg lg:text-xl font-bold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent mb-2 truncate">
                                {vocabulary.word}
                            </h3>
                            <div className="flex items-center flex-wrap gap-2 mb-2">
                                <span className={`px-2 py-1 text-xs font-bold rounded-full border ${getLevelColor(vocabulary.level)}`}>
                                    {vocabulary.level}
                                </span>
                                <span className={`px-2 py-1 text-xs font-bold rounded-full border ${getTopicColor(vocabulary.topic)} truncate max-w-[100px]`}>
                                    {vocabulary.topic}
                                </span>
                            </div>
                        </div>
                        {isLearned && (
                            <div className="flex-shrink-0">
                                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center shadow-md">
                                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        )}
                    </div>
                </div>                {/* Card Content */}
                <div className="p-3 lg:p-4">
                    {/* Meaning Section */}
                    <div className="mb-3 lg:mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-xs lg:text-sm font-bold text-gray-700">Meaning</h4>
                            <button
                                onClick={() => setShowMeaning(!showMeaning)}
                                className="text-blue-600 hover:text-blue-800 text-xs lg:text-sm font-bold transition-colors px-2 py-1 rounded-lg hover:bg-blue-50"
                            >
                                {showMeaning ? 'Hide' : 'Show'}
                            </button>
                        </div>
                        {showMeaning && (
                            <p className="text-gray-900 bg-gradient-to-r from-gray-50 to-gray-100 p-2 lg:p-3 rounded-lg border border-gray-200 text-sm">
                                {vocabulary.meaning}
                            </p>
                        )}
                    </div>

                    {/* Example Section */}
                    <div className="mb-3 lg:mb-4">
                        <h4 className="text-xs lg:text-sm font-bold text-gray-700 mb-2">Example</h4>
                        <p className="text-gray-600 italic text-xs lg:text-sm bg-gradient-to-r from-blue-50 to-blue-100 p-2 lg:p-3 rounded-lg border-l-4 border-blue-400">
                            "{vocabulary.example}"
                        </p>
                    </div>

                    {/* User Note */}
                    {isLearned && userNote && (
                        <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Your Note</h4>
                            <p className="text-gray-600 text-sm bg-yellow-50 p-3 rounded-md border-l-4 border-yellow-400">
                                {userNote}
                            </p>
                        </div>
                    )}

                    {/* Image */}
                    {vocabulary.imageUrl && (
                        <div className="mb-4">
                            <img
                                src={vocabulary.imageUrl}
                                alt={vocabulary.word}
                                className="w-full h-32 object-cover rounded-md border border-gray-200"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* Card Actions */}
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                            {/* Pronunciation Button */}
                            <button
                                onClick={() => {
                                    if ('speechSynthesis' in window) {
                                        const utterance = new SpeechSynthesisUtterance(vocabulary.word);
                                        utterance.lang = 'en-US';
                                        speechSynthesis.speak(utterance);
                                    }
                                }}
                                className="inline-flex items-center px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                title="Pronounce"
                            >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 12a1 1 0 01-1-1V9a1 1 0 011-1h1a1 1 0 011 1v2a1 1 0 01-1 1H9z" />
                                </svg>
                                🔊
                            </button>
                        </div>

                        {/* Learn Button */}
                        {!isLearned && (
                            <button
                                onClick={() => setShowLearnModal(true)}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-medium text-white text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Mark as Learned
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Learn Modal */}
            {showLearnModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Mark "{vocabulary.word}" as Learned
                            </h3>

                            <div className="mb-4">
                                <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
                                    Add a personal note (optional)
                                </label>
                                <textarea
                                    id="note"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="e.g., 'Remember to use this in formal situations'"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows={3}
                                />
                            </div>

                            <div className="flex space-x-3 justify-end">
                                <button
                                    onClick={() => setShowLearnModal(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleMarkAsLearned}
                                    disabled={isLoading}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                                >
                                    {isLoading ? 'Saving...' : 'Mark as Learned'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default VocabularyCard;
