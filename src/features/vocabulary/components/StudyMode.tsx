import React, { useEffect, useState } from 'react';
import { useVocabularyStore, type Vocabulary } from '../../../store/vocabularyStore';

interface StudyModeProps {
    vocabularies: Vocabulary[];
    onClose: () => void;
}

const StudyMode: React.FC<StudyModeProps> = ({ vocabularies, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showMeaning, setShowMeaning] = useState(false);
    const [learnedWords, setLearnedWords] = useState<Set<string>>(new Set());
    const { markAsLearned } = useVocabularyStore();

    const currentWord = vocabularies[currentIndex];
    const progress = ((currentIndex + 1) / vocabularies.length) * 100;

    const handleNext = () => {
        setShowMeaning(false);
        if (currentIndex < vocabularies.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            // Study session complete
            handleComplete();
        }
    };

    const handlePrevious = () => {
        setShowMeaning(false);
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleMarkAsLearned = async () => {
        try {
            await markAsLearned(currentWord.id);
            setLearnedWords(prev => new Set(prev).add(currentWord.id));
        } catch (error) {
            console.error('Failed to mark as learned:', error);
        }
    };

    const handleComplete = () => {
        alert(`Study session complete! You learned ${learnedWords.size} new words.`);
        onClose();
    };

    const handleKeyPress = (e: KeyboardEvent) => {
        switch (e.key) {
            case 'ArrowRight':
            case ' ':
                e.preventDefault();
                if (showMeaning) {
                    handleNext();
                } else {
                    setShowMeaning(true);
                }
                break;
            case 'ArrowLeft':
                e.preventDefault();
                handlePrevious();
                break;
            case 'Enter':
                e.preventDefault();
                setShowMeaning(!showMeaning);
                break;
            case 'Escape':
                e.preventDefault();
                onClose();
                break;
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [showMeaning, currentIndex]);

    const getLevelColor = (level: string) => {
        switch (level.toLowerCase()) {
            case 'beginner':
                return 'bg-green-500';
            case 'intermediate':
                return 'bg-yellow-500';
            case 'advanced':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
            <div className="max-w-4xl w-full mx-4">
                {/* Header */}
                <div className="bg-white rounded-t-lg p-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Study Mode</h2>
                        <p className="text-sm text-gray-600">
                            {currentIndex + 1} of {vocabularies.length} words
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="bg-white px-4 pb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                {/* Flashcard */}
                <div className="bg-white p-8 min-h-[400px] flex flex-col justify-center items-center text-center">
                    <div className="mb-4 flex items-center space-x-2">
                        <span className={`px-3 py-1 text-sm font-medium text-white rounded-full ${getLevelColor(currentWord.level)}`}>
                            {currentWord.level}
                        </span>
                        <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                            {currentWord.topic}
                        </span>
                    </div>

                    <h1 className="text-6xl font-bold text-gray-900 mb-8">
                        {currentWord.word}
                    </h1>

                    {showMeaning ? (
                        <div className="space-y-6">
                            <div className="text-2xl text-gray-700 bg-gray-50 p-4 rounded-lg">
                                {currentWord.meaning}
                            </div>

                            <div className="text-lg text-gray-600 italic bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                                "{currentWord.example}"
                            </div>

                            {!learnedWords.has(currentWord.id) && (
                                <button
                                    onClick={handleMarkAsLearned}
                                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Mark as Learned
                                </button>
                            )}

                            {learnedWords.has(currentWord.id) && (
                                <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Learned!
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-lg text-gray-500 mb-8">
                            Click "Show Meaning" or press Space to reveal the answer
                        </p>
                    )}
                </div>

                {/* Controls */}
                <div className="bg-white rounded-b-lg p-4 flex items-center justify-between">
                    <button
                        onClick={handlePrevious}
                        disabled={currentIndex === 0}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Previous
                    </button>

                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => setShowMeaning(!showMeaning)}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            {showMeaning ? 'Hide Meaning' : 'Show Meaning'}
                        </button>

                        <button
                            onClick={() => {
                                if ('speechSynthesis' in window) {
                                    const utterance = new SpeechSynthesisUtterance(currentWord.word);
                                    utterance.lang = 'en-US';
                                    speechSynthesis.speak(utterance);
                                }
                            }}
                            className="p-2 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            title="Pronounce"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 12a1 1 0 01-1-1V9a1 1 0 011-1h1a1 1 0 011 1v2a1 1 0 01-1 1H9z" />
                            </svg>
                        </button>
                    </div>

                    <button
                        onClick={handleNext}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        {currentIndex === vocabularies.length - 1 ? 'Complete' : 'Next'}
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* Keyboard shortcuts */}
                <div className="mt-4 text-center text-white text-sm opacity-75">
                    <p>Keyboard shortcuts: ← Previous | → or Space: Next/Show | Enter: Toggle | Esc: Exit</p>
                </div>
            </div>
        </div>
    );
};

export default StudyMode;
