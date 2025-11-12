import React, { useEffect, useState } from 'react';

interface QuizQuestion {
    id: string;
    vocabularyId: string;
    questionType: string;
    questionText: string;
    correctAnswer: string;
    options?: string[];
    order: number;
    vocabulary: {
        id: string;
        word: string;
        meaning: string;
        example: string;
    };
}

interface QuizTakingViewProps {
    quiz: {
        id: string;
        title: string;
        description: string;
        timeLimit: number;
    };
    questions: QuizQuestion[];
    attemptId: string;
    onSubmit: (answers: { questionId: string; answer: string }[]) => Promise<void>;
    onCancel: () => void;
}

const QuizTakingView: React.FC<QuizTakingViewProps> = ({
    quiz,
    questions,
    attemptId,
    onSubmit,
    onCancel,
}) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [timeLeft, setTimeLeft] = useState(quiz.timeLimit * 60); // Convert to seconds
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

    const currentQuestion = questions[currentQuestionIndex];
    const totalQuestions = questions.length;
    const answeredCount = Object.keys(answers).length;

    // Timer
    useEffect(() => {
        if (timeLeft <= 0) {
            handleSubmit();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswerChange = (questionId: string, answer: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleQuestionNavigate = (index: number) => {
        setCurrentQuestionIndex(index);
    };

    const handleSubmit = async () => {
        setShowConfirmSubmit(false);
        setIsSubmitting(true);

        try {
            const answersList = questions.map(q => ({
                questionId: q.id,
                answer: answers[q.id] || '',
            }));

            await onSubmit(answersList);
        } catch (error) {
            console.error('Failed to submit quiz:', error);
            alert('Failed to submit quiz. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getTimeColor = () => {
        const percentage = (timeLeft / (quiz.timeLimit * 60)) * 100;
        if (percentage > 50) return 'text-green-600';
        if (percentage > 20) return 'text-yellow-600';
        return 'text-red-600';
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
                            {quiz.description && (
                                <p className="text-gray-600 mt-1">{quiz.description}</p>
                            )}
                        </div>
                        <div className="text-right">
                            <div className={`text-3xl font-bold ${getTimeColor()}`}>
                                {formatTime(timeLeft)}
                            </div>
                            <div className="text-sm text-gray-500">Time Left</div>
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
                        <span>Answered: {answeredCount} / {totalQuestions}</span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Question Card */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-gray-500">
                                Question {currentQuestionIndex + 1}
                            </span>
                            <span className="text-xs px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                                {currentQuestion.questionType}
                            </span>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            {currentQuestion.questionText}
                        </h2>

                        {/* Answer Options */}
                        {currentQuestion.options ? (
                            <div className="space-y-3">
                                {currentQuestion.options.map((option, index) => {
                                    const isSelected = answers[currentQuestion.id] === option;
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => handleAnswerChange(currentQuestion.id, option)}
                                            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${isSelected
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="flex items-center">
                                                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${isSelected
                                                        ? 'border-blue-500 bg-blue-500'
                                                        : 'border-gray-300'
                                                    }`}>
                                                    {isSelected && (
                                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <span className="text-gray-900">{option}</span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <div>
                                <input
                                    type="text"
                                    value={answers[currentQuestion.id] || ''}
                                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                                    placeholder="Type your answer here..."
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
                                />
                            </div>
                        )}
                    </div>

                    {/* Vocabulary Reference */}
                    {currentQuestion.vocabulary && (
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Vocabulary Reference:</h3>
                            <div className="text-sm text-gray-600">
                                <p><strong>Word:</strong> {currentQuestion.vocabulary.word}</p>
                                <p><strong>Example:</strong> {currentQuestion.vocabulary.example}</p>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                        <button
                            onClick={handlePrevious}
                            disabled={currentQuestionIndex === 0}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            ← Previous
                        </button>
                        <button
                            onClick={() => setShowConfirmSubmit(true)}
                            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        >
                            Submit Quiz
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={currentQuestionIndex === totalQuestions - 1}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Next →
                        </button>
                    </div>
                </div>

                {/* Question Navigator */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Question Navigator</h3>
                    <div className="grid grid-cols-10 gap-2">
                        {questions.map((q, index) => {
                            const isAnswered = !!answers[q.id];
                            const isCurrent = index === currentQuestionIndex;
                            return (
                                <button
                                    key={q.id}
                                    onClick={() => handleQuestionNavigate(index)}
                                    className={`aspect-square rounded-md text-sm font-medium transition-colors ${isCurrent
                                            ? 'bg-blue-600 text-white'
                                            : isAnswered
                                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {index + 1}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Confirm Submit Modal */}
            {showConfirmSubmit && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Submit Quiz?</h2>
                        <p className="text-gray-600 mb-2">
                            You have answered {answeredCount} out of {totalQuestions} questions.
                        </p>
                        {answeredCount < totalQuestions && (
                            <p className="text-yellow-600 text-sm mb-4">
                                ⚠️ Warning: You haven't answered all questions!
                            </p>
                        )}
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to submit? You cannot change your answers after submission.
                        </p>
                        <div className="flex items-center justify-end gap-3">
                            <button
                                onClick={() => setShowConfirmSubmit(false)}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuizTakingView;
