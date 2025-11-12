import React, { useEffect, useState } from 'react';
import api from '../../../services/api';

interface QuizAttempt {
    id: string;
    score: number;
    totalQuestions: number;
    completedAt: string;
    timeSpent?: number;
}

interface QuizScoreHistoryProps {
    quizId: string;
    userId: string;
    isOpen: boolean;
    onClose: () => void;
}

const QuizScoreHistory: React.FC<QuizScoreHistoryProps> = ({
    quizId,
    userId,
    isOpen,
    onClose,
}) => {
    const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            fetchAttempts();
        }
    }, [isOpen, quizId, userId]);

    const fetchAttempts = async () => {
        try {
            setIsLoading(true);
            const response = await api.get(`/ClassQuiz/${quizId}/attempts/${userId}`);
            setAttempts(response.data);
        } catch (error) {
            console.error('Failed to fetch attempts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getPercentage = (score: number, total: number) => {
        return total > 0 ? Math.round((score / total) * 100) : 0;
    };

    const getScoreColor = (percentage: number) => {
        if (percentage >= 90) return 'text-green-600 bg-green-50';
        if (percentage >= 70) return 'text-blue-600 bg-blue-50';
        if (percentage >= 50) return 'text-yellow-600 bg-yellow-50';
        return 'text-red-600 bg-red-50';
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Quiz Attempt History</h2>
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
                    {isLoading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="text-gray-600 mt-4">Loading attempts...</p>
                        </div>
                    ) : attempts.length === 0 ? (
                        <div className="text-center py-12">
                            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-gray-600">No attempts yet</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Stats Summary */}
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="bg-blue-50 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {attempts.length}
                                    </div>
                                    <div className="text-sm text-gray-600">Total Attempts</div>
                                </div>
                                <div className="bg-green-50 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                        {Math.max(...attempts.map(a => getPercentage(a.score, a.totalQuestions)))}%
                                    </div>
                                    <div className="text-sm text-gray-600">Best Score</div>
                                </div>
                                <div className="bg-purple-50 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-purple-600">
                                        {Math.round(
                                            attempts.reduce((sum, a) => sum + getPercentage(a.score, a.totalQuestions), 0) / attempts.length
                                        )}%
                                    </div>
                                    <div className="text-sm text-gray-600">Average</div>
                                </div>
                            </div>

                            {/* Attempts List */}
                            <div className="space-y-3">
                                {attempts.map((attempt, index) => {
                                    const percentage = getPercentage(attempt.score, attempt.totalQuestions);
                                    const isBest = percentage === Math.max(...attempts.map(a => getPercentage(a.score, a.totalQuestions)));

                                    return (
                                        <div
                                            key={attempt.id}
                                            className={`p-4 rounded-lg border-2 ${isBest ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200 bg-white'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm font-medium text-gray-500">
                                                        Attempt #{attempts.length - index}
                                                    </span>
                                                    {isBest && (
                                                        <span className="text-xs px-2 py-1 bg-yellow-200 text-yellow-800 rounded-full font-medium">
                                                            Best Score ⭐
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(attempt.completedAt).toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className={`inline-flex px-4 py-2 rounded-full font-semibold ${getScoreColor(percentage)}`}>
                                                        {attempt.score}/{attempt.totalQuestions}
                                                    </div>
                                                    <div className="text-2xl font-bold text-gray-900">
                                                        {percentage}%
                                                    </div>
                                                </div>
                                                {attempt.timeSpent && (
                                                    <div className="text-sm text-gray-600">
                                                        ⏱️ {Math.floor(attempt.timeSpent / 60)}:{(attempt.timeSpent % 60).toString().padStart(2, '0')}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuizScoreHistory;
