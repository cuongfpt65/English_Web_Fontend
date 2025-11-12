import React, { useEffect, useState } from 'react';
import type { Vocabulary } from '../../../store/vocabularyStore';

interface VocabularyQuizProps {
    vocabularies: Vocabulary[];
    onClose: () => void;
    onComplete: (score: number, totalQuestions: number) => void;
}

interface QuizQuestion {
    vocabulary: Vocabulary;
    options: string[];
    correctAnswer: string;
    type: 'meaningToWord' | 'wordToMeaning';
}

const VocabularyQuiz: React.FC<VocabularyQuizProps> = ({
    vocabularies,
    onClose,
    onComplete,
}) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string>('');
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
    const [showResults, setShowResults] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30); // 30 seconds per question
    const [quizStarted, setQuizStarted] = useState(false);

    const quizSettings = {
        questionsCount: Math.min(vocabularies.length, 10),
        timePerQuestion: 30,
    };

    useEffect(() => {
        if (vocabularies.length > 0) {
            generateQuestions();
        }
    }, [vocabularies]);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (quizStarted && timeLeft > 0 && !showResults) {
            timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        } else if (timeLeft === 0 && !showResults) {
            handleNextQuestion();
        }
        return () => clearTimeout(timer);
    }, [timeLeft, quizStarted, showResults]);

    const generateQuestions = () => {
        const shuffledVocab = [...vocabularies].sort(() => Math.random() - 0.5);
        const selectedVocab = shuffledVocab.slice(0, quizSettings.questionsCount);

        const newQuestions: QuizQuestion[] = selectedVocab.map(vocab => {
            const questionType = Math.random() > 0.5 ? 'meaningToWord' : 'wordToMeaning';

            // Generate wrong options
            const wrongOptions = vocabularies
                .filter(v => v.id !== vocab.id)
                .sort(() => Math.random() - 0.5)
                .slice(0, 3)
                .map(v => questionType === 'meaningToWord' ? v.word : v.meaning);

            const correctAnswer = questionType === 'meaningToWord' ? vocab.word : vocab.meaning;
            const allOptions = [correctAnswer, ...wrongOptions].sort(() => Math.random() - 0.5);

            return {
                vocabulary: vocab,
                options: allOptions,
                correctAnswer,
                type: questionType,
            };
        });

        setQuestions(newQuestions);
    };

    const handleStartQuiz = () => {
        setQuizStarted(true);
        setTimeLeft(quizSettings.timePerQuestion);
    };

    const handleAnswerSelect = (answer: string) => {
        setSelectedAnswer(answer);
    };

    const handleNextQuestion = () => {
        // Save the answer
        setUserAnswers(prev => ({
            ...prev,
            [currentQuestionIndex]: selectedAnswer
        }));

        // Check if this was the last question
        if (currentQuestionIndex === questions.length - 1) {
            finishQuiz();
        } else {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedAnswer('');
            setTimeLeft(quizSettings.timePerQuestion);
        }
    };

    const finishQuiz = () => {
        setShowResults(true);
        const finalAnswers = { ...userAnswers, [currentQuestionIndex]: selectedAnswer };

        const score = questions.reduce((acc, question, index) => {
            return acc + (finalAnswers[index] === question.correctAnswer ? 1 : 0);
        }, 0);

        onComplete(score, questions.length);
    };

    const calculateScore = () => {
        const finalAnswers = { ...userAnswers, [currentQuestionIndex]: selectedAnswer };
        return questions.reduce((acc, question, index) => {
            return acc + (finalAnswers[index] === question.correctAnswer ? 1 : 0);
        }, 0);
    };

    const getScoreColor = (score: number, total: number) => {
        const percentage = (score / total) * 100;
        if (percentage >= 80) return 'text-green-600';
        if (percentage >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    if (!quizStarted) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Vocabulary Quiz</h2>
                    <div className="space-y-4 mb-6">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Questions:</span>
                            <span className="font-semibold">{quizSettings.questionsCount}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Time per question:</span>
                            <span className="font-semibold">{quizSettings.timePerQuestion} seconds</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Total time:</span>
                            <span className="font-semibold">~{Math.ceil((quizSettings.questionsCount * quizSettings.timePerQuestion) / 60)} minutes</span>
                        </div>
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleStartQuiz}
                            className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Start Quiz
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (showResults) {
        const score = calculateScore();
        const percentage = Math.round((score / questions.length) * 100);

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
                        <div className={`text-6xl font-bold mb-4 ${getScoreColor(score, questions.length)}`}>
                            {percentage}%
                        </div>
                        <p className="text-gray-600">
                            You got {score} out of {questions.length} questions correct!
                        </p>
                    </div>

                    {/* Results breakdown */}
                    <div className="space-y-4 mb-6">
                        {questions.map((question, index) => {
                            const userAnswer = userAnswers[index];
                            const isCorrect = userAnswer === question.correctAnswer;

                            return (
                                <div key={index} className={`p-4 rounded-lg border-2 ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">
                                                Question {index + 1}: {question.type === 'meaningToWord' ? question.vocabulary.meaning : question.vocabulary.word}
                                            </p>
                                            <p className="text-sm text-gray-600 mt-1">
                                                What is the {question.type === 'meaningToWord' ? 'English word' : 'meaning'}?
                                            </p>
                                        </div>
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                {isCorrect ? (
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                ) : (
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                )}
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="space-y-1 text-sm">
                                        <p>
                                            <span className="text-gray-600">Your answer: </span>
                                            <span className={isCorrect ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                                                {userAnswer || 'No answer'}
                                            </span>
                                        </p>
                                        {!isCorrect && (
                                            <p>
                                                <span className="text-gray-600">Correct answer: </span>
                                                <span className="text-green-600 font-medium">{question.correctAnswer}</span>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex space-x-3">
                        <button
                            onClick={() => {
                                setShowResults(false);
                                setCurrentQuestionIndex(0);
                                setUserAnswers({});
                                setSelectedAnswer('');
                                setQuizStarted(false);
                                generateQuestions();
                            }}
                            className="flex-1 px-4 py-2 text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                            Retake Quiz
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">
                            Question {currentQuestionIndex + 1} of {questions.length}
                        </h2>
                        <div className="flex items-center space-x-4">
                            <div className={`text-lg font-bold ${timeLeft <= 5 ? 'text-red-600' : 'text-gray-600'}`}>
                                {timeLeft}s
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
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                {/* Question */}
                <div className="p-6">
                    <div className="mb-6">
                        <p className="text-sm text-gray-600 mb-2">
                            {currentQuestion?.type === 'meaningToWord'
                                ? 'What is the English word for:'
                                : 'What is the meaning of:'
                            }
                        </p>
                        <h3 className="text-3xl font-bold text-gray-900 text-center py-8 bg-gray-50 rounded-lg">
                            {currentQuestion?.type === 'meaningToWord'
                                ? currentQuestion.vocabulary.meaning
                                : currentQuestion.vocabulary.word
                            }
                        </h3>
                    </div>

                    {/* Options */}
                    <div className="grid grid-cols-1 gap-3 mb-6">
                        {currentQuestion?.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswerSelect(option)}
                                className={`p-4 text-left rounded-lg border-2 transition-colors ${selectedAnswer === option
                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                <div className="flex items-center">
                                    <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${selectedAnswer === option
                                        ? 'border-blue-500 bg-blue-500'
                                        : 'border-gray-300'
                                        }`}>
                                        {selectedAnswer === option && (
                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className="text-lg">{option}</span>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Next Button */}
                    <button
                        onClick={handleNextQuestion}
                        disabled={!selectedAnswer}
                        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg font-medium"
                    >
                        {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VocabularyQuiz;
