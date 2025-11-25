import React, { useEffect, useState } from 'react';
import { Button } from '../components/Button/Button';
import api from '../services/api';

interface Vocabulary {
    id: string;
    word: string;
    meaning: string;
    example?: string;
    topic?: string;
    level?: string;
    imageUrl?: string;
}

interface UserVocabulary {
    id: string;
    vocabularyId: string;
    isLearned: boolean;
    note?: string;
}

const LessonsPage: React.FC = () => {
    const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);
    const [userVocabularies, setUserVocabularies] = useState<UserVocabulary[]>([]);
    const [selectedTopic, setSelectedTopic] = useState<string>('');
    const [selectedLevel, setSelectedLevel] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const topics = ['General', 'Business', 'Technology', 'Travel', 'Food', 'Sports'];
    const levels = ['Beginner', 'Intermediate', 'Advanced'];

    useEffect(() => {
        fetchVocabulary();
        fetchUserVocabulary();
    }, [selectedTopic, selectedLevel, currentPage]);

    const fetchVocabulary = async () => {
        try {
            setIsLoading(true);
            const params = new URLSearchParams({
                page: currentPage.toString(),
                pageSize: '10'
            });

            if (selectedTopic) params.append('topic', selectedTopic);
            if (selectedLevel) params.append('level', selectedLevel);

            const response = await api.get(`/vocabulary?${params}`);
            setVocabularies(response.data.items);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching vocabulary:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUserVocabulary = async () => {
        try {
            const response = await api.get('/vocabulary/user');
            setUserVocabularies(response.data);
        } catch (error) {
            console.error('Error fetching user vocabulary:', error);
        }
    };

    const toggleLearnedStatus = async (vocabularyId: string) => {
        try {
            await api.post(`/vocabulary/${vocabularyId}/toggle-learned`);
            fetchUserVocabulary(); // Refresh user vocabulary
        } catch (error) {
            console.error('Error toggling learned status:', error);
        }
    };

    const addNote = async (vocabularyId: string, note: string) => {
        try {
            await api.post(`/vocabulary/${vocabularyId}/note`, { note });
            fetchUserVocabulary(); // Refresh user vocabulary
        } catch (error) {
            console.error('Error adding note:', error);
        }
    };

    const isWordLearned = (vocabularyId: string) => {
        return userVocabularies.some(uv => uv.vocabularyId === vocabularyId && uv.isLearned);
    };

    const getUserNote = (vocabularyId: string) => {
        return userVocabularies.find(uv => uv.vocabularyId === vocabularyId)?.note || '';
    };    return (
        <div className="max-w-6xl mx-auto px-4 py-4 lg:py-8">
            <div className="mb-6 lg:mb-8">
                <div className="flex items-center gap-2 lg:gap-3 mb-4 lg:mb-6">
                    <div className="w-10 lg:w-14 h-10 lg:h-14 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-2xl lg:text-3xl">📚</span>
                    </div>
                    <div>
                        <h1 className="text-2xl lg:text-4xl font-extrabold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
                            Vocabulary Lessons
                        </h1>
                        <p className="text-sm lg:text-base text-gray-600 font-medium">Build your English vocabulary! ✨</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 mb-4 lg:mb-6">
                    <div className="flex-1 sm:flex-initial">
                        <label className="block text-xs lg:text-sm font-bold text-gray-700 mb-2">🎯 Topic</label>
                        <select
                            value={selectedTopic}
                            onChange={(e) => {
                                setSelectedTopic(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full px-3 lg:px-4 py-2 lg:py-2.5 border-2 border-gray-200 rounded-lg lg:rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all bg-white font-medium text-sm lg:text-base"
                        >
                            <option value="">All Topics</option>
                            {topics.map(topic => (
                                <option key={topic} value={topic}>{topic}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex-1 sm:flex-initial">
                        <label className="block text-xs lg:text-sm font-bold text-gray-700 mb-2">📊 Level</label>
                        <select
                            value={selectedLevel}
                            onChange={(e) => {
                                setSelectedLevel(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full px-3 lg:px-4 py-2 lg:py-2.5 border-2 border-gray-200 rounded-lg lg:rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all bg-white font-medium text-sm lg:text-base"
                        >
                            <option value="">All Levels</option>
                            {levels.map(level => (
                                <option key={level} value={level}>{level}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>            {/* Vocabulary Cards */}
            {isLoading ? (
                <div className="text-center py-8 lg:py-12">
                    <div className="inline-block">
                        <div className="w-12 lg:w-16 h-12 lg:h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                        <p className="mt-3 lg:mt-4 text-base lg:text-lg font-bold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
                            Loading vocabulary...
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
                    {vocabularies.map((vocab) => (
                        <VocabularyCard
                            key={vocab.id}
                            vocabulary={vocab}
                            isLearned={isWordLearned(vocab.id)}
                            userNote={getUserNote(vocab.id)}
                            onToggleLearned={() => toggleLearnedStatus(vocab.id)}
                            onAddNote={(note) => addNote(vocab.id, note)}
                        />
                    ))}
                </div>
            )}            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-8 gap-3">
                    <Button
                        variant="outline"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                    >
                        ← Previous
                    </Button>
                    <span className="px-4 py-2 bg-gradient-to-r from-orange-50 to-pink-50 border-2 border-orange-200 rounded-xl text-sm font-bold text-gray-700">
                        Page {currentPage} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                    >
                        Next →
                    </Button>
                </div>
            )}
        </div>
    );
};

interface VocabularyCardProps {
    vocabulary: Vocabulary;
    isLearned: boolean;
    userNote: string;
    onToggleLearned: () => void;
    onAddNote: (note: string) => void;
}

const VocabularyCard: React.FC<VocabularyCardProps> = ({
    vocabulary,
    isLearned,
    userNote,
    onToggleLearned,
    onAddNote,
}) => {
    const [showNote, setShowNote] = useState(false);
    const [noteText, setNoteText] = useState(userNote);

    const handleSaveNote = () => {
        onAddNote(noteText);
        setShowNote(false);
    }; return (
        <div className={`border-2 rounded-2xl p-6 transition-all shadow-md hover:shadow-xl ${isLearned
                ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300'
                : 'bg-white border-gray-200 hover:border-pink-300'
            }`}>
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <h3 className="text-2xl font-extrabold text-gray-900 mb-3">
                        {vocabulary.word} {isLearned && <span className="text-green-500">✓</span>}
                    </h3>
                    <p className="text-gray-700 mb-3 leading-relaxed">
                        <strong className="text-pink-600">📖 Meaning:</strong> {vocabulary.meaning}
                    </p>
                    {vocabulary.example && (
                        <p className="text-gray-600 italic mb-3 pl-4 border-l-4 border-orange-300 bg-orange-50/50 py-2 rounded-r-lg">
                            <strong className="text-orange-600">💬 Example:</strong> "{vocabulary.example}"
                        </p>
                    )}
                    <div className="flex gap-2 text-sm">
                        {vocabulary.topic && (
                            <span className="px-3 py-1.5 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 rounded-xl font-bold">
                                🎯 {vocabulary.topic}
                            </span>
                        )}
                        {vocabulary.level && (
                            <span className="px-3 py-1.5 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 rounded-xl font-bold">
                                📊 {vocabulary.level}
                            </span>
                        )}
                    </div>
                </div>

                {vocabulary.imageUrl && (
                    <img
                        src={vocabulary.imageUrl}
                        alt={vocabulary.word}
                        className="w-24 h-24 object-cover rounded-2xl ml-4 shadow-lg border-2 border-white"
                    />
                )}
            </div>

            <div className="flex gap-3 mb-4">
                <Button
                    variant={isLearned ? "secondary" : "primary"}
                    size="sm"
                    onClick={onToggleLearned}
                >
                    {isLearned ? '✓ Learned' : '⭐ Mark as Learned'}
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowNote(!showNote)}
                >
                    {userNote ? '✏️ Edit Note' : '📝 Add Note'}
                </Button>
            </div>

            {showNote && (
                <div className="mt-4 p-4 bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl border-2 border-orange-200">
                    <textarea
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Add your personal note about this word..."
                        className="w-full h-24 px-4 py-3 border-2 border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                    />
                    <div className="flex gap-2 mt-3">
                        <Button size="sm" onClick={handleSaveNote}>
                            💾 Save Note
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setShowNote(false)}>
                            ✕ Cancel
                        </Button>
                    </div>
                </div>
            )}

            {userNote && !showNote && (
                <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-300 rounded-2xl">
                    <p className="text-sm text-gray-700 leading-relaxed">
                        <strong className="text-yellow-700">📝 Your Note:</strong> {userNote}
                    </p>
                </div>
            )}
        </div>
    );
};

export default LessonsPage;
