import React, { useEffect, useState } from 'react';
import api from '../../../services/api';
import { useAuthStore } from '../../../store';
import { useClassStore } from '../../../store/classStore';
import CreateQuizModal from './CreateQuizModal';
import QuizResultsView from './QuizResultsView';
import QuizTakingView from './QuizTakingView';

interface ClassQuizzesProps {
    classId: string;
}

const ClassQuizzes: React.FC<ClassQuizzesProps> = ({ classId }) => {
    const {
        quizzes,
        error,
        fetchQuizzes,
    } = useClassStore();

    const { user } = useAuthStore();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [takingQuiz, setTakingQuiz] = useState<any>(null);
    const [viewingResults, setViewingResults] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false); useEffect(() => {
        fetchQuizzes(classId);
    }, [classId, fetchQuizzes]);

    const handleCreateQuiz = async (quizData: any) => {
        try {
            await api.post(`/ClassQuiz/${classId}`, quizData);
            await fetchQuizzes(classId);
            setShowCreateModal(false);
        } catch (error) {
            console.error('Failed to create quiz:', error);
            throw error;
        }
    };

    const handleStartQuiz = async (quizId: string) => {
        setIsLoading(true);
        try {
            const response = await api.get(`/ClassQuiz/${quizId}/start`);
            setTakingQuiz(response.data);
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to start quiz');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmitQuiz = async (answers: { questionId: string; answer: string }[]) => {
        if (!takingQuiz) return;

        try {
            const response = await api.post(`/ClassQuiz/attempts/${takingQuiz.attemptId}/submit`, {
                answers,
            });

            // Show result
            alert(`Quiz submitted! Score: ${response.data.score}/${response.data.totalQuestions} (${response.data.percentage.toFixed(1)}%)`);

            // Refresh quizzes and show results
            await fetchQuizzes(classId);
            setViewingResults(takingQuiz.quiz.id);
            setTakingQuiz(null);
        } catch (error) {
            console.error('Failed to submit quiz:', error);
            throw error;
        }
    };

    const fetchQuizResults = async (quizId: string) => {
        const response = await api.get(`/ClassQuiz/${quizId}/results`);
        return response.data;
    };

    // If taking a quiz, show the quiz taking view
    if (takingQuiz) {
        return (
            <QuizTakingView
                quiz={takingQuiz.quiz}
                questions={takingQuiz.questions}
                attemptId={takingQuiz.attemptId}
                onSubmit={handleSubmitQuiz}
                onCancel={() => setTakingQuiz(null)}
            />
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Class Quizzes</h3>
                        <p className="text-sm text-gray-500">
                            Practice and compete with class quizzes
                        </p>
                    </div>                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        onClick={() => setShowCreateModal(true)}
                    >
                        Create Quiz
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                    {error}
                </div>
            )}

            {/* Quizzes List */}
            <div className="p-6">
                {quizzes.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                        <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                        <p>No quizzes available yet.</p>
                        <p className="text-xs text-gray-400 mt-1">Teachers can create quizzes for the class to practice vocabulary!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {quizzes.map((quiz) => (
                            <div key={quiz.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <h4 className="font-semibold text-gray-900">{quiz.title}</h4>
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${quiz.isActive
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {quiz.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>

                                {quiz.description && (
                                    <p className="text-sm text-gray-600 mb-4">{quiz.description}</p>
                                )}                                <div className="flex items-center text-sm text-gray-500 mb-4">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{quiz.timeLimit} minutes</span>
                                    <span className="mx-2">•</span>
                                    <span>{quiz.questionCount || quiz.questions?.length || 0} questions</span>
                                </div><div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-gray-400">
                                            by {quiz.createdByName}
                                        </span>
                                        <button
                                            onClick={() => setViewingResults(quiz.id)}
                                            className="text-xs text-blue-600 hover:text-blue-700"
                                        >
                                            View Results
                                        </button>
                                    </div>
                                    <button
                                        disabled={!quiz.isActive || isLoading}
                                        onClick={() => handleStartQuiz(quiz.id)}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                                    >
                                        {isLoading ? 'Starting...' : 'Take Quiz'}
                                    </button>
                                </div>
                            </div>
                        ))}                    </div>
                )}
            </div>

            {/* Create Quiz Modal */}
            {showCreateModal && (
                <CreateQuizModal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    onSubmit={handleCreateQuiz}
                    classId={classId}
                />
            )}

            {/* Quiz Results Modal */}
            {viewingResults && (
                <QuizResultsView
                    quizId={viewingResults}
                    onClose={() => setViewingResults(null)}
                    fetchResults={fetchQuizResults}
                    currentUserId={user?.id}
                />
            )}
        </div>
    );
};

export default ClassQuizzes;
