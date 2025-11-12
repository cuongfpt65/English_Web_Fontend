import React, { useEffect, useState } from 'react';
import { vocabularyService } from '../../../services/vocabularyService';

interface CreateQuizModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (quizData: QuizData) => Promise<void>;
    classId: string;
}

interface QuizData {
    title: string;
    description: string;
    timeLimit: number;
    dueDate?: string;
    questions: QuizQuestion[];
}

interface QuizQuestion {
    vocabularyId: string;
    questionType: 'MultipleChoice' | 'FillBlank' | 'Translation';
    questionText: string;
    correctAnswer: string;
    options?: string[];
    order: number;
}

interface Vocabulary {
    id: string;
    word: string;
    meaning: string;
    example: string;
    topic: string;
    level: string;
}

const CreateQuizModal: React.FC<CreateQuizModalProps> = ({ isOpen, onClose, onSubmit, classId }) => {
    const [step, setStep] = useState<'info' | 'questions'>('info');
    const [isLoading, setIsLoading] = useState(false);
    const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);
    const [selectedVocabs, setSelectedVocabs] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterTopic, setFilterTopic] = useState<string>('');
    const [filterLevel, setFilterLevel] = useState<string>('');

    const [quizData, setQuizData] = useState<QuizData>({
        title: '',
        description: '',
        timeLimit: 15,
        questions: [],
    });

    useEffect(() => {
        if (isOpen) {
            fetchVocabularies();
        }
    }, [isOpen]);

    const fetchVocabularies = async () => {
        try {
            const response = await vocabularyService.getVocabulary({
                topic: filterTopic || undefined,
                level: filterLevel || undefined,
                page: 1,
                pageSize: 100,
            });
            setVocabularies(response.items);
        } catch (error) {
            console.error('Failed to fetch vocabularies:', error);
        }
    };

    const handleVocabToggle = (vocabId: string) => {
        setSelectedVocabs(prev =>
            prev.includes(vocabId)
                ? prev.filter(id => id !== vocabId)
                : [...prev, vocabId]
        );
    };

    const generateQuestions = () => {
        const questions: QuizQuestion[] = selectedVocabs.map((vocabId, index) => {
            const vocab = vocabularies.find(v => v.id === vocabId);
            if (!vocab) return null;

            const questionTypes: Array<'MultipleChoice' | 'FillBlank' | 'Translation'> = ['MultipleChoice', 'FillBlank', 'Translation'];
            const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];

            let questionText = '';
            let correctAnswer = '';
            let options: string[] | undefined;

            switch (questionType) {
                case 'MultipleChoice':
                    questionText = `What is the meaning of "${vocab.word}"?`;
                    correctAnswer = vocab.meaning;
                    // Generate wrong options
                    const wrongOptions = vocabularies
                        .filter(v => v.id !== vocabId)
                        .map(v => v.meaning)
                        .sort(() => 0.5 - Math.random())
                        .slice(0, 3);
                    options = [correctAnswer, ...wrongOptions].sort(() => 0.5 - Math.random());
                    break;

                case 'FillBlank':
                    const words = vocab.example.split(' ');
                    const wordIndex = words.findIndex(w => w.toLowerCase().includes(vocab.word.toLowerCase()));
                    if (wordIndex !== -1) {
                        words[wordIndex] = '______';
                        questionText = `Fill in the blank: ${words.join(' ')}`;
                        correctAnswer = vocab.word;
                    } else {
                        questionText = `Complete: "${vocab.meaning}" in English is ______`;
                        correctAnswer = vocab.word;
                    }
                    break;

                case 'Translation':
                    questionText = `Translate to Vietnamese: "${vocab.word}"`;
                    correctAnswer = vocab.meaning;
                    break;
            }

            return {
                vocabularyId: vocabId,
                questionType,
                questionText,
                correctAnswer,
                options,
                order: index,
            };
        }).filter(q => q !== null) as QuizQuestion[];

        setQuizData(prev => ({ ...prev, questions }));
        setStep('questions');
    };

    const handleSubmit = async () => {
        if (!quizData.title.trim()) {
            alert('Please enter quiz title');
            return;
        }

        if (quizData.questions.length === 0) {
            alert('Please add at least one question');
            return;
        }

        setIsLoading(true);
        try {
            await onSubmit(quizData);
            onClose();
            resetForm();
        } catch (error) {
            console.error('Failed to create quiz:', error);
            alert('Failed to create quiz. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setQuizData({
            title: '',
            description: '',
            timeLimit: 15,
            questions: [],
        });
        setSelectedVocabs([]);
        setStep('info');
        setSearchTerm('');
    };

    const filteredVocabularies = vocabularies.filter(v =>
        v.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.meaning.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {step === 'info' ? 'Create New Quiz' : 'Configure Questions'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {step === 'info' ? (
                        <div className="space-y-6">
                            {/* Quiz Info */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Quiz Title *
                                </label>
                                <input
                                    type="text"
                                    value={quizData.title}
                                    onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., Weekly Vocabulary Quiz #1"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={quizData.description}
                                    onChange={(e) => setQuizData({ ...quizData, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                    rows={3}
                                    placeholder="Brief description of this quiz..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Time Limit (minutes) *
                                    </label>
                                    <input
                                        type="number"
                                        value={quizData.timeLimit}
                                        onChange={(e) => setQuizData({ ...quizData, timeLimit: parseInt(e.target.value) || 15 })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                        min={1}
                                        max={120}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Due Date (optional)
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={quizData.dueDate || ''}
                                        onChange={(e) => setQuizData({ ...quizData, dueDate: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Vocabulary Selection */}
                            <div className="border-t pt-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    Select Vocabulary ({selectedVocabs.length} selected)
                                </h3>

                                {/* Search and Filter */}
                                <div className="mb-4 space-y-2">
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search vocabulary..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Vocabulary List */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                                    {filteredVocabularies.map((vocab) => (
                                        <div
                                            key={vocab.id}
                                            onClick={() => handleVocabToggle(vocab.id)}
                                            className={`p-3 border rounded-md cursor-pointer transition-colors ${selectedVocabs.includes(vocab.id)
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-300 hover:border-gray-400'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="font-medium text-gray-900">{vocab.word}</div>
                                                    <div className="text-sm text-gray-600">{vocab.meaning}</div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-xs px-2 py-0.5 bg-gray-100 rounded">{vocab.topic}</span>
                                                        <span className="text-xs px-2 py-0.5 bg-gray-100 rounded">{vocab.level}</span>
                                                    </div>
                                                </div>
                                                {selectedVocabs.includes(vocab.id) && (
                                                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Generated Questions ({quizData.questions.length})
                                </h3>
                                <button
                                    onClick={() => setStep('info')}
                                    className="text-sm text-blue-600 hover:text-blue-700"
                                >
                                    ← Back to edit
                                </button>
                            </div>

                            {quizData.questions.map((question, index) => (
                                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                                    <div className="flex items-start justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-500">Question {index + 1}</span>
                                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                                            {question.questionType}
                                        </span>
                                    </div>
                                    <p className="text-gray-900 mb-2">{question.questionText}</p>
                                    {question.options && (
                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                            {question.options.map((option, optIndex) => (
                                                <div
                                                    key={optIndex}
                                                    className={`p-2 rounded text-sm ${option === question.correctAnswer
                                                            ? 'bg-green-50 border border-green-300 text-green-800'
                                                            : 'bg-gray-50 border border-gray-200'
                                                        }`}
                                                >
                                                    {option}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {!question.options && (
                                        <div className="mt-2 text-sm">
                                            <span className="text-gray-500">Correct Answer: </span>
                                            <span className="font-medium text-green-600">{question.correctAnswer}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    >
                        Cancel
                    </button>
                    {step === 'info' ? (
                        <button
                            onClick={generateQuestions}
                            disabled={selectedVocabs.length === 0}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Generate Questions ({selectedVocabs.length})
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                            {isLoading ? 'Creating...' : 'Create Quiz'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateQuizModal;
