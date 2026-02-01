import React, { useState } from 'react';
import api from '../../../services/api';

interface AIQuizModalProps {
    onClose: () => void;
    totalVocabularyCount: number;
}

interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
    relatedWords: string[];
}

interface QuizData {
    questions: QuizQuestion[];
}

const AIQuizModal: React.FC<AIQuizModalProps> = ({ onClose, totalVocabularyCount }) => {
    const [step, setStep] = useState<'setup' | 'quiz' | 'results'>('setup');
    const [wordCount, setWordCount] = useState(Math.min(10, totalVocabularyCount));
    const [loading, setLoading] = useState(false);
    const [quizData, setQuizData] = useState<QuizData | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
    const [selectedAnswer, setSelectedAnswer] = useState<string>('');
    const [timeLeft, setTimeLeft] = useState(30);
    const [timerActive, setTimerActive] = useState(false);    // Timer effect
    React.useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (timerActive && timeLeft > 0 && step === 'quiz') {
            timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        } else if (timeLeft === 0 && step === 'quiz') {
            handleNextQuestion();
        }
        return () => clearTimeout(timer);
    }, [timeLeft, timerActive, step]); const handleStartQuiz = async () => {
        setLoading(true);
        try {
            console.log('📊 Requesting quiz with', wordCount, 'words');

            const response = await api.post('/vocabulary/generate-ai-quiz', {
                count: wordCount
            });

            console.log('✅ Quiz data received:', response.data);
            setQuizData(response.data.quiz);
            setStep('quiz');
            setTimerActive(true);
        } catch (error: any) {
            console.error('❌ Failed to generate quiz:', error);
            console.error('❌ Error response:', error.response?.data);
            alert(error.response?.data?.message || 'Không thể tạo quiz. Vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerSelect = (answer: string) => {
        setSelectedAnswer(answer);
    };

    const handleNextQuestion = () => {
        // Lưu câu trả lời
        setUserAnswers(prev => ({
            ...prev,
            [currentQuestionIndex]: selectedAnswer
        }));

        // Kiểm tra xem có phải câu cuối không
        if (quizData && currentQuestionIndex === quizData.questions.length - 1) {
            setStep('results');
            setTimerActive(false);
        } else {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedAnswer('');
            setTimeLeft(30);
        }
    };

    const calculateScore = () => {
        if (!quizData) return 0;
        let correct = 0;
        quizData.questions.forEach((q, index) => {
            if (userAnswers[index] === q.correctAnswer) {
                correct++;
            }
        });
        return correct;
    };

    const getScoreColor = (score: number, total: number) => {
        const percentage = (score / total) * 100;
        if (percentage >= 80) return 'text-green-600';
        if (percentage >= 60) return 'text-blue-600';
        if (percentage >= 40) return 'text-orange-600';
        return 'text-red-600';
    };

    const getScoreEmoji = (score: number, total: number) => {
        const percentage = (score / total) * 100;
        if (percentage >= 80) return '🎉';
        if (percentage >= 60) return '👍';
        if (percentage >= 40) return '😊';
        return '💪';
    };

    // Setup screen
    if (step === 'setup') {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 lg:p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            🤖 Học với AI
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="mb-6">
                        <p className="text-gray-600 mb-4">
                            AI sẽ tạo <span className="font-bold text-purple-600">10 câu hỏi trắc nghiệm</span> từ từ vựng của bạn với ngữ cảnh tự nhiên! 📚
                        </p>

                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Số lượng từ vựng muốn học:
                            </label>
                            <input
                                type="number"
                                min="5"
                                max={totalVocabularyCount}
                                value={wordCount}
                                onChange={(e) => setWordCount(Math.min(Math.max(5, parseInt(e.target.value) || 5), totalVocabularyCount))}
                                className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-semibold text-center"
                            />
                            <p className="text-xs text-gray-500 mt-2 text-center">
                                Tối thiểu 5 từ, tối đa {totalVocabularyCount} từ
                            </p>
                        </div>

                        <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                            <h3 className="font-bold text-blue-900 mb-2">📋 Quy tắc:</h3>
                            <ul className="text-sm text-blue-800 space-y-1">
                                <li>• 10 câu hỏi trắc nghiệm</li>
                                <li>• Mỗi câu có 30 giây</li>
                                <li>• Câu hỏi ngữ cảnh tự nhiên</li>
                                <li>• Xem lại đáp án sau khi làm xong</li>
                            </ul>
                        </div>
                    </div>

                    <button
                        onClick={handleStartQuiz}
                        disabled={loading || wordCount < 5}
                        className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Đang tạo quiz...
                            </>
                        ) : (
                            <>
                                <span className="text-2xl">🚀</span>
                                Bắt đầu Quiz
                            </>
                        )}
                    </button>
                </div>
            </div>
        );
    }

    // Quiz screen
    if (step === 'quiz' && quizData) {
        const currentQuestion = quizData.questions[currentQuestionIndex];
        const progress = ((currentQuestionIndex + 1) / quizData.questions.length) * 100;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 lg:p-8">
                    {/* Header với progress bar */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl font-bold text-purple-600">
                                    Câu {currentQuestionIndex + 1}/{quizData.questions.length}
                                </span>
                                <div className={`px-3 py-1 rounded-full font-bold ${timeLeft <= 10 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-blue-100 text-blue-600'}`}>
                                    ⏱️ {timeLeft}s
                                </div>
                            </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Question */}
                    <div className="mb-6">
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-4 border-2 border-purple-200">
                            <p className="text-lg lg:text-xl font-semibold text-gray-800 leading-relaxed">
                                {currentQuestion.question}
                            </p>
                        </div>

                        {/* Related words */}
                        {currentQuestion.relatedWords && currentQuestion.relatedWords.length > 0 && (
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-sm text-gray-500">📚 Từ liên quan:</span>
                                {currentQuestion.relatedWords.map((word, idx) => (
                                    <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium">
                                        {word}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Options */}
                        <div className="space-y-3">
                            {currentQuestion.options.map((option, index) => {
                                const optionLetter = option.charAt(0); // A, B, C, D
                                const isSelected = selectedAnswer === optionLetter;

                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleAnswerSelect(optionLetter)}
                                        className={`w-full p-4 text-left rounded-xl border-2 transition-all ${isSelected
                                            ? 'border-purple-500 bg-purple-50 shadow-md'
                                            : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                                            }`}
                                    >
                                        <span className="font-semibold text-gray-800">{option}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Next button */}
                    <button
                        onClick={handleNextQuestion}
                        disabled={!selectedAnswer}
                        className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {currentQuestionIndex === quizData.questions.length - 1 ? 'Hoàn thành' : 'Câu tiếp theo'} →
                    </button>
                </div>
            </div>
        );
    }

    // Results screen
    if (step === 'results' && quizData) {
        const score = calculateScore();
        const total = quizData.questions.length;
        const percentage = (score / total) * 100;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-6 lg:p-8 my-8">
                    {/* Score */}
                    <div className="text-center mb-8">
                        <div className="text-6xl mb-4">{getScoreEmoji(score, total)}</div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Kết quả của bạn</h2>
                        <div className={`text-5xl font-bold mb-2 ${getScoreColor(score, total)}`}>
                            {score}/{total}
                        </div>
                        <p className="text-xl text-gray-600">Điểm: {percentage.toFixed(0)}%</p>

                        {percentage >= 80 && <p className="text-green-600 font-semibold mt-2">🎉 Xuất sắc!</p>}
                        {percentage >= 60 && percentage < 80 && <p className="text-blue-600 font-semibold mt-2">👍 Tốt lắm!</p>}
                        {percentage >= 40 && percentage < 60 && <p className="text-orange-600 font-semibold mt-2">😊 Cố gắng hơn nhé!</p>}
                        {percentage < 40 && <p className="text-red-600 font-semibold mt-2">💪 Tiếp tục luyện tập!</p>}
                    </div>

                    {/* Review answers */}
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">📝 Xem lại đáp án:</h3>
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                            {quizData.questions.map((question, index) => {
                                const userAnswer = userAnswers[index];
                                const isCorrect = userAnswer === question.correctAnswer;

                                return (
                                    <div
                                        key={index}
                                        className={`p-4 rounded-xl border-2 ${isCorrect ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
                                            }`}
                                    >
                                        <div className="flex items-start gap-2 mb-2">
                                            <span className="text-2xl">{isCorrect ? '✅' : '❌'}</span>
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-800 mb-2">
                                                    Câu {index + 1}: {question.question}
                                                </p>
                                                <div className="space-y-1 text-sm">
                                                    {userAnswer ? (
                                                        <>
                                                            <p className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                                                                <span className="font-semibold">Bạn chọn:</span> {userAnswer}
                                                            </p>
                                                            {!isCorrect && (
                                                                <p className="text-green-700">
                                                                    <span className="font-semibold">Đáp án đúng:</span> {question.correctAnswer}
                                                                </p>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <p className="text-red-700">
                                                                <span className="font-semibold">Bạn chưa chọn</span>
                                                            </p>
                                                            <p className="text-green-700">
                                                                <span className="font-semibold">Đáp án đúng:</span> {question.correctAnswer}
                                                            </p>
                                                        </>
                                                    )}
                                                    <p className="text-gray-600 italic mt-2">
                                                        💡 {question.explanation}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => {
                                setStep('setup');
                                setCurrentQuestionIndex(0);
                                setUserAnswers({});
                                setSelectedAnswer('');
                                setTimeLeft(30);
                                setQuizData(null);
                            }}
                            className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
                        >
                            🔄 Làm lại
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-all"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default AIQuizModal;
