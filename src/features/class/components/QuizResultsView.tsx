import React, { useEffect, useState } from 'react';

interface QuizResult {
    user: {
        id: string;
        fullName: string;
    };
    bestScore: number;
    totalQuestions: number;
    attemptCount: number;
    bestAttemptDate: string;
}

interface QuizResultsViewProps {
    quizId: string;
    onClose: () => void;
    fetchResults: (quizId: string) => Promise<QuizResult[]>;
    currentUserId?: string;
}

const QuizResultsView: React.FC<QuizResultsViewProps> = ({
    quizId,
    onClose,
    fetchResults,
    currentUserId,
}) => {
    const [results, setResults] = useState<QuizResult[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadResults();
    }, [quizId]);

    const loadResults = async () => {
        try {
            setIsLoading(true);
            const data = await fetchResults(quizId);
            setResults(data);
        } catch (err) {
            setError('Failed to load results');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const getPercentage = (score: number, total: number) => {
        return total > 0 ? Math.round((score / total) * 100) : 0;
    };

    const getMedalIcon = (rank: number) => {
        switch (rank) {
            case 1:
                return '🥇';
            case 2:
                return '🥈';
            case 3:
                return '🥉';
            default:
                return `#${rank}`;
        }
    };

    const getScoreColor = (percentage: number) => {
        if (percentage >= 90) return 'text-green-600 bg-green-50';
        if (percentage >= 70) return 'text-blue-600 bg-blue-50';
        if (percentage >= 50) return 'text-yellow-600 bg-yellow-50';
        return 'text-red-600 bg-red-50';
    };

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Loading results...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg max-w-4xl w-full my-8">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Quiz Results & Ranking</h2>
                        <p className="text-sm text-gray-600 mt-1">Top performers in this quiz</p>
                    </div>
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
                <div className="p-6">
                    {error ? (
                        <div className="text-center py-8 text-red-600">
                            {error}
                        </div>
                    ) : results.length === 0 ? (
                        <div className="text-center py-12">
                            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-gray-600">No results yet. Be the first to take this quiz!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Top 3 Podium */}
                            {results.length >= 3 && (
                                <div className="grid grid-cols-3 gap-4 mb-8">
                                    {/* 2nd Place */}
                                    <div className="text-center pt-8">
                                        <div className="inline-block p-4 bg-gray-100 rounded-full mb-2">
                                            <span className="text-3xl">🥈</span>
                                        </div>
                                        <h3 className="font-semibold text-gray-900">{results[1].user.fullName}</h3>
                                        <p className="text-2xl font-bold text-gray-700">
                                            {getPercentage(results[1].bestScore, results[1].totalQuestions)}%
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {results[1].bestScore}/{results[1].totalQuestions}
                                        </p>
                                    </div>

                                    {/* 1st Place */}
                                    <div className="text-center">
                                        <div className="inline-block p-6 bg-yellow-100 rounded-full mb-2 shadow-lg">
                                            <span className="text-5xl">🥇</span>
                                        </div>
                                        <h3 className="font-bold text-gray-900 text-lg">{results[0].user.fullName}</h3>
                                        <p className="text-3xl font-bold text-yellow-600">
                                            {getPercentage(results[0].bestScore, results[0].totalQuestions)}%
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {results[0].bestScore}/{results[0].totalQuestions}
                                        </p>
                                    </div>

                                    {/* 3rd Place */}
                                    <div className="text-center pt-12">
                                        <div className="inline-block p-3 bg-orange-100 rounded-full mb-2">
                                            <span className="text-2xl">🥉</span>
                                        </div>
                                        <h3 className="font-semibold text-gray-900">{results[2].user.fullName}</h3>
                                        <p className="text-xl font-bold text-orange-600">
                                            {getPercentage(results[2].bestScore, results[2].totalQuestions)}%
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {results[2].bestScore}/{results[2].totalQuestions}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Full Ranking Table */}
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Rank
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Student
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Score
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Percentage
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Attempts
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {results.map((result, index) => {
                                            const percentage = getPercentage(result.bestScore, result.totalQuestions);
                                            const isCurrentUser = currentUserId === result.user.id;

                                            return (
                                                <tr
                                                    key={result.user.id}
                                                    className={`${isCurrentUser ? 'bg-blue-50' : 'hover:bg-gray-50'
                                                        } transition-colors`}
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="text-2xl font-bold">
                                                            {getMedalIcon(index + 1)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                                                <span className="text-white font-semibold">
                                                                    {result.user.fullName.charAt(0).toUpperCase()}
                                                                </span>
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {result.user.fullName}
                                                                    {isCurrentUser && (
                                                                        <span className="ml-2 text-xs text-blue-600">(You)</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                                        <span className="text-sm font-semibold text-gray-900">
                                                            {result.bestScore}/{result.totalQuestions}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getScoreColor(percentage)}`}>
                                                            {percentage}%
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                                        {result.attemptCount}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                                        {new Date(result.bestAttemptDate).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Statistics Summary */}
                            <div className="grid grid-cols-3 gap-4 mt-6">
                                <div className="bg-blue-50 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-blue-600">{results.length}</div>
                                    <div className="text-sm text-gray-600">Total Participants</div>
                                </div>
                                <div className="bg-green-50 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                        {Math.round(
                                            results.reduce((acc, r) => acc + getPercentage(r.bestScore, r.totalQuestions), 0) / results.length
                                        )}%
                                    </div>
                                    <div className="text-sm text-gray-600">Average Score</div>
                                </div>
                                <div className="bg-yellow-50 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-yellow-600">
                                        {getPercentage(results[0]?.bestScore || 0, results[0]?.totalQuestions || 1)}%
                                    </div>
                                    <div className="text-sm text-gray-600">Highest Score</div>
                                </div>
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

export default QuizResultsView;
