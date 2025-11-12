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
        const selectedGameInfo = gameModes.find(g => g.id === selectedGame);

        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                {selectedGameInfo?.title}
                            </h2>
                            <p className="text-gray-600">
                                Question {currentQuestion + 1} of {mockQuestions.length}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-lg font-semibold text-blue-600">
                                Score: {score}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={resetGame}
                            >
                                Exit Game
                            </Button>
                        </div>
                    </div>

                    <div className="mb-6">
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${((currentQuestion + 1) / mockQuestions.length) * 100}%` }}
                            />
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-lg font-medium text-gray-900 mb-6">
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
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Practice & Games
                </h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Improve your English skills through interactive games and exercises.
                    Choose a game mode to start practicing!
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {gameModes.map((game) => (
                    <div key={game.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
                        <div className="p-6">
                            <div className="text-center mb-4">
                                <div className="text-4xl mb-2">{game.icon}</div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    {game.title}
                                </h3>
                                <p className="text-sm text-gray-600 mb-3">
                                    {game.description}
                                </p>
                                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(game.difficulty)}`}>
                                    {game.difficulty}
                                </span>
                            </div>
                            <Button
                                className="w-full"
                                onClick={() => startGame(game.id)}
                            >
                                Start Game
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Statistics */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Your Practice Stats</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 mb-1">12</div>
                        <div className="text-sm text-gray-600">Games Played</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600 mb-1">85%</div>
                        <div className="text-sm text-gray-600">Average Score</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600 mb-1">45</div>
                        <div className="text-sm text-gray-600">Minutes Practiced</div>
                    </div>
                </div>
            </div>

            {/* Recent Games */}
            <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Games</h2>
                <div className="space-y-3">
                    {[
                        { game: 'Vocabulary Matching', score: '8/10', date: '2 hours ago' },
                        { game: 'Grammar Quiz', score: '7/10', date: '1 day ago' },
                        { game: 'Fill in the Blanks', score: '9/10', date: '2 days ago' },
                    ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                                <div className="font-medium text-gray-900">{item.game}</div>
                                <div className="text-sm text-gray-500">{item.date}</div>
                            </div>
                            <div className="text-right">
                                <div className="font-medium text-gray-900">{item.score}</div>
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
