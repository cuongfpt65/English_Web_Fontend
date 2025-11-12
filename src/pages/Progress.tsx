import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store';

interface ProgressData {
    totalWords: number;
    learnedWords: number;
    chatSessions: number;
    totalMessages: number;
    streakDays: number;
    recentActivity: ActivityItem[];
}

interface ActivityItem {
    date: string;
    type: 'vocabulary' | 'chat' | 'lesson';
    description: string;
}

const ProgressPage: React.FC = () => {
    const [progressData, setProgressData] = useState<ProgressData>({
        totalWords: 0,
        learnedWords: 0,
        chatSessions: 0,
        totalMessages: 0,
        streakDays: 0,
        recentActivity: []
    });
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuthStore();

    useEffect(() => {
        fetchProgressData();
    }, []);

    const fetchProgressData = async () => {
        try {
            setIsLoading(true);
            // For now, let's create mock data since we don't have a progress endpoint yet
            // In a real app, this would be: const response = await api.get('/progress');

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            setProgressData({
                totalWords: 150,
                learnedWords: 45,
                chatSessions: 8,
                totalMessages: 124,
                streakDays: 5,
                recentActivity: [
                    {
                        date: new Date().toISOString(),
                        type: 'vocabulary',
                        description: 'Learned 3 new words about Technology'
                    },
                    {
                        date: new Date(Date.now() - 86400000).toISOString(),
                        type: 'chat',
                        description: 'Had a 15-minute conversation with AI tutor'
                    },
                    {
                        date: new Date(Date.now() - 172800000).toISOString(),
                        type: 'vocabulary',
                        description: 'Reviewed 10 Business vocabulary words'
                    },
                    {
                        date: new Date(Date.now() - 259200000).toISOString(),
                        type: 'lesson',
                        description: 'Completed Food & Restaurant lesson'
                    }
                ]
            });
        } catch (error) {
            console.error('Error fetching progress data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const progressPercentage = progressData.totalWords > 0
        ? Math.round((progressData.learnedWords / progressData.totalWords) * 100)
        : 0;

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'vocabulary':
                return '📚';
            case 'chat':
                return '💬';
            case 'lesson':
                return '🎓';
            default:
                return '📖';
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="text-center">
                    <div className="text-lg text-gray-600">Loading your progress...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Your Learning Progress
                </h1>
                <p className="text-gray-600">
                    Welcome back, {user?.name}! Here's your learning journey so far.
                </p>
            </div>

            {/* Progress Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-600">Vocabulary Progress</h3>
                        <span className="text-2xl">📚</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                        {progressData.learnedWords}/{progressData.totalWords}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                    <p className="text-sm text-gray-500">{progressPercentage}% complete</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-600">Chat Sessions</h3>
                        <span className="text-2xl">💬</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                        {progressData.chatSessions}
                    </div>
                    <p className="text-sm text-gray-500">Total conversations</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-600">Messages Sent</h3>
                        <span className="text-2xl">📝</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                        {progressData.totalMessages}
                    </div>
                    <p className="text-sm text-gray-500">Practice conversations</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-600">Learning Streak</h3>
                        <span className="text-2xl">🔥</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                        {progressData.streakDays}
                    </div>
                    <p className="text-sm text-gray-500">Days in a row</p>
                </div>
            </div>

            {/* Achievement Badges */}
            <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Achievements</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="text-3xl mb-2">🌟</div>
                        <div className="text-sm font-medium text-gray-700">First Steps</div>
                        <div className="text-xs text-gray-500">Complete registration</div>
                    </div>

                    <div className={`text-center p-4 rounded-lg border ${progressData.learnedWords >= 10
                            ? 'bg-green-50 border-green-200'
                            : 'bg-gray-50 border-gray-200'
                        }`}>
                        <div className="text-3xl mb-2">{progressData.learnedWords >= 10 ? '🎯' : '⚪'}</div>
                        <div className="text-sm font-medium text-gray-700">Word Collector</div>
                        <div className="text-xs text-gray-500">Learn 10 words</div>
                    </div>

                    <div className={`text-center p-4 rounded-lg border ${progressData.chatSessions >= 5
                            ? 'bg-green-50 border-green-200'
                            : 'bg-gray-50 border-gray-200'
                        }`}>
                        <div className="text-3xl mb-2">{progressData.chatSessions >= 5 ? '💬' : '⚪'}</div>
                        <div className="text-sm font-medium text-gray-700">Conversationalist</div>
                        <div className="text-xs text-gray-500">5 chat sessions</div>
                    </div>

                    <div className={`text-center p-4 rounded-lg border ${progressData.streakDays >= 7
                            ? 'bg-green-50 border-green-200'
                            : 'bg-gray-50 border-gray-200'
                        }`}>
                        <div className="text-3xl mb-2">{progressData.streakDays >= 7 ? '🔥' : '⚪'}</div>
                        <div className="text-sm font-medium text-gray-700">Consistent Learner</div>
                        <div className="text-xs text-gray-500">7-day streak</div>
                    </div>

                    <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="text-3xl mb-2">⚪</div>
                        <div className="text-sm font-medium text-gray-700">Master</div>
                        <div className="text-xs text-gray-500">Learn 100 words</div>
                    </div>

                    <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="text-3xl mb-2">⚪</div>
                        <div className="text-sm font-medium text-gray-700">Expert</div>
                        <div className="text-xs text-gray-500">30-day streak</div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                    {progressData.recentActivity.length > 0 ? (
                        progressData.recentActivity.map((activity, index) => (
                            <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                                <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(activity.date).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-500 py-8">
                            <p>No recent activity. Start learning to see your progress!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProgressPage;
