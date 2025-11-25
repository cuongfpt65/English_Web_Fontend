import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-400 via-pink-400 to-rose-500 p-12 mb-8 shadow-2xl">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-white/10 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>                <div className="relative text-center text-white">
                    <div className="mb-6 flex justify-center gap-3">
                        <span className="text-6xl animate-bounce">🎓</span>
                        <span className="text-6xl animate-bounce delay-100">🤖</span>
                        <span className="text-6xl animate-bounce delay-200">✨</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-4">
                        FPT Learnify AI
                        <span className="block mt-2 text-yellow-200">Learn English with AI! 🚀</span>
                    </h1>
                    <p className="mt-6 max-w-2xl mx-auto text-xl text-white/90">
                        Master English through AI-powered interactive lessons, smart practice, and personalized learning.
                        Experience the future of language learning! 🌟
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/vocabulary">
                            <button className="px-8 py-4 bg-white text-pink-600 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transform transition-all">
                                🎯 Start Learning
                            </button>
                        </Link>
                        <Link to="/chat">
                            <button className="px-8 py-4 bg-yellow-300 text-orange-700 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transform transition-all">
                                💬 Try AI Chat
                            </button>
                        </Link>
                    </div>
                </div>
            </div>            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${stat.color}`}>
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
                                    {stat.value}
                                </p>
                                <p className="text-sm text-gray-600">{stat.label}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Features Section */}
            <div className="mb-12">
                <div className="text-center mb-10">
                    <h2 className="inline-block px-6 py-2 bg-gradient-to-r from-orange-400 to-pink-500 text-white font-bold rounded-full text-sm mb-4">
                        ✨ AMAZING FEATURES
                    </h2>
                    <p className="text-4xl font-bold text-gray-800">
                        Everything You Need to
                        <span className="block mt-2 bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
                            Master English! 🎓
                        </span>
                    </p>
                </div>                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature) => (
                        <div
                            key={feature.name}
                            className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2"
                        >
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl mb-4 ${feature.bgColor} group-hover:scale-110 transition-transform`}>
                                {feature.emoji}
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                                {feature.name}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-orange-100 via-pink-100 to-rose-100 rounded-3xl p-12 text-center shadow-xl mb-8">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">
                    Ready to Start Your Journey? 🚀
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                    Join thousands of students already learning English with us!
                </p>
                <Link to="/auth">
                    <button className="px-10 py-5 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl hover:scale-105 transform transition-all">
                        Get Started Free! 🎉
                    </button>
                </Link>
            </div>
        </div>
    );
};

const stats = [
    { icon: '📖', value: '1000+', label: 'Vocabulary Words', color: 'bg-gradient-to-br from-orange-200 to-orange-300' },
    { icon: '👥', value: '500+', label: 'Active Students', color: 'bg-gradient-to-br from-pink-200 to-pink-300' },
    { icon: '🏆', value: '50+', label: 'Lessons & Quizzes', color: 'bg-gradient-to-br from-yellow-200 to-yellow-300' },
];

const features = [
    {
        name: 'Fun Lessons',
        emoji: '📚',
        description: 'Interactive lessons with games, videos, and colorful illustrations to keep you engaged!',
        bgColor: 'bg-gradient-to-br from-blue-100 to-blue-200',
    },
    {
        name: 'AI Chat Buddy',
        emoji: '🤖',
        description: 'Practice speaking with our friendly AI assistant. Get instant feedback and corrections!',
        bgColor: 'bg-gradient-to-br from-purple-100 to-purple-200',
    },
    {
        name: 'Track Progress',
        emoji: '📊',
        description: 'See your improvement with fun charts, achievements, and rewards!',
        bgColor: 'bg-gradient-to-br from-green-100 to-green-200',
    },
    {
        name: 'Join Classes',
        emoji: '👥',
        description: 'Learn together with friends, compete in quizzes, and climb the leaderboard!',
        bgColor: 'bg-gradient-to-br from-pink-100 to-pink-200',
    },
];

export default Home;
