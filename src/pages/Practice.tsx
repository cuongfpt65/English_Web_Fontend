import React, { useState } from 'react';
import { Button } from '../components/Button/Button';

interface GameMode {
    id: string;
    title: string;
    description: string;
    icon: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
}

const PracticePage: React.FC = () => {
    const [selectedGame, setSelectedGame] = useState<string | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);

    const gameModes: GameMode[] = [
        {
            id: 'vocabulary-match',
            title: 'Vocabulary Matching',
            description: 'Match English words with their meanings',
            icon: '🎯',
            difficulty: 'Easy'
        },
        {
            id: 'fill-blanks',
            title: 'Fill in the Blanks',
            description: 'Complete sentences with the correct words',
            icon: '📝',
            difficulty: 'Medium'
        },
        {
            id: 'pronunciation',
            title: 'Pronunciation Practice',
            description: 'Practice speaking English words correctly',
            icon: '🎤',
            difficulty: 'Medium'
        },
        {
            id: 'grammar-quiz',
            title: 'Grammar Quiz',
            description: 'Test your grammar knowledge',
            icon: '📚',
            difficulty: 'Hard'
        }
    ];

    const mockQuestions = [
        {
            question: "What does 'abundant' mean?",
            options: ['Scarce', 'Plentiful', 'Difficult', 'Beautiful'],
            correct: 1
        },
        {
            question: "Choose the correct sentence:",
            options: [
                'I have went to the store',
                'I had went to the store',
                'I have gone to the store',
                'I has gone to the store'
            ],
            correct: 2
        },
        {
            question: "What is the synonym of 'rapidly'?",
            options: ['Slowly', 'Quickly', 'Carefully', 'Loudly'],
            correct: 1
        }
    ];

    const startGame = (gameId: string) => {
        setSelectedGame(gameId);
        setGameStarted(true);
        setCurrentQuestion(0);
        setScore(0);
    };

    const handleAnswer = (selectedOption: number) => {
        if (selectedOption === mockQuestions[currentQuestion].correct) {
            setScore(score + 1);
        }

        if (currentQuestion + 1 < mockQuestions.length) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            // Game finished
            setGameStarted(false);
            alert(`Game completed! Your score: ${score + (selectedOption === mockQuestions[currentQuestion].correct ? 1 : 0)}/${mockQuestions.length}`);
        }
    };

    const resetGame = () => {
        setSelectedGame(null);
        setGameStarted(false);
        setCurrentQuestion(0);
        setScore(0);
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy': return 'text-green-600 bg-green-100';
            case 'Medium': return 'text-yellow-600 bg-yellow-100';
            case 'Hard': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    if (gameStarted && selectedGame) {
        const question = mockQuestions[currentQuestion];
        const selectedGameInfo = gameModes.find(g => g.id === selectedGame);        return (
            <div className="max-w-4xl mx-auto px-4 py-4 lg:py-8">
                <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg border border-gray-200 p-4 lg:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 lg:mb-6 gap-3">
                        <div className="flex-1">
                            <h2 className="text-lg lg:text-xl font-bold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
                                {selectedGameInfo?.title}
                            </h2>
                            <p className="text-sm lg:text-base text-gray-600">
                                Question {currentQuestion + 1} of {mockQuestions.length}
                            </p>
                        </div>
                        <div className="flex items-center justify-between sm:flex-col sm:items-end gap-3 sm:gap-2">
                            <div className="text-base lg:text-lg font-semibold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                                Score: {score}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={resetGame}
                                className="!text-xs lg:!text-sm !px-3 lg:!px-4"
                            >
                                Exit Game
                            </Button>
                        </div>
                    </div>

                    <div className="mb-4 lg:mb-6">
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                            <div
                                className="bg-gradient-to-r from-orange-400 to-pink-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${((currentQuestion + 1) / mockQuestions.length) * 100}%` }}
                            />
                        </div>
                    </div>

                    <div className="mb-6 lg:mb-8">
                        <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-4 lg:mb-6 text-center lg:text-left">
                            {question.question}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {question.options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleAnswer(index)}
                                    className="p-4 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                                >
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                                            {String.fromCharCode(65 + index)}
                                        </div>
                                        <span className="text-gray-900">{option}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }    return (
        <div className="max-w-6xl mx-auto px-4 py-4 lg:py-8">
            <div className="text-center mb-6 lg:mb-8 px-4">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="w-10 lg:w-14 h-10 lg:h-14 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-2xl lg:text-3xl">✏️</span>
                    </div>
                </div>
                <h1 className="text-2xl lg:text-3xl font-extrabold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent mb-2">
                    Practice & Games
                </h1>
                <p className="text-sm lg:text-base text-gray-600 max-w-2xl mx-auto font-medium">
                    Improve your English skills through interactive games and exercises.
                    Choose a game mode to start practicing! 🎯
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
                {gameModes.map((game) => (
                    <div key={game.id} className="bg-white rounded-xl lg:rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all hover:scale-105 transform">
                        <div className="p-4 lg:p-6">
                            <div className="text-center mb-3 lg:mb-4">
                                <div className="text-3xl lg:text-4xl mb-2">{game.icon}</div>
                                <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-2">
                                    {game.title}
                                </h3>
                                <p className="text-xs lg:text-sm text-gray-600 mb-3 line-clamp-2">
                                    {game.description}
                                </p>
                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${getDifficultyColor(game.difficulty)}`}>
                                    {game.difficulty}
                                </span>
                            </div>
                            <Button
                                className="w-full !text-sm lg:!text-base !py-2 lg:!py-2.5"
                                onClick={() => startGame(game.id)}
                            >
                                Start Game
                            </Button>
                        </div>
                    </div>
                ))}
            </div>            {/* Statistics */}
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg border border-gray-200 p-4 lg:p-6 mb-6 lg:mb-8">
                <h2 className="text-lg lg:text-xl font-bold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent mb-3 lg:mb-4">Your Practice Stats</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                    <div className="text-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 lg:p-4">
                        <div className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent mb-1">12</div>
                        <div className="text-xs lg:text-sm text-gray-600 font-medium">Games Played</div>
                    </div>
                    <div className="text-center bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3 lg:p-4">
                        <div className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent mb-1">85%</div>
                        <div className="text-xs lg:text-sm text-gray-600 font-medium">Average Score</div>
                    </div>
                    <div className="text-center bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3 lg:p-4">
                        <div className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent mb-1">45</div>
                        <div className="text-xs lg:text-sm text-gray-600 font-medium">Minutes Practiced</div>
                    </div>
                </div>
            </div>

            {/* Recent Games */}
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg border border-gray-200 p-4 lg:p-6">
                <h2 className="text-lg lg:text-xl font-bold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent mb-3 lg:mb-4">Recent Games</h2>
                <div className="space-y-2 lg:space-y-3">
                    {[
                        { game: 'Vocabulary Matching', score: '8/10', date: '2 hours ago' },
                        { game: 'Grammar Quiz', score: '7/10', date: '1 day ago' },
                        { game: 'Fill in the Blanks', score: '9/10', date: '2 days ago' },
                    ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 lg:p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg lg:rounded-xl hover:from-orange-50 hover:to-pink-50 transition-colors">
                            <div className="flex-1 min-w-0">
                                <div className="font-bold text-gray-900 text-sm lg:text-base truncate">{item.game}</div>
                                <div className="text-xs lg:text-sm text-gray-500">{item.date}</div>
                            </div>
                            <div className="text-right ml-3 flex-shrink-0">
                                <div className="font-bold text-gray-900 text-sm lg:text-base">{item.score}</div>
                                <div className="text-xs text-gray-500">Score</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PracticePage;
