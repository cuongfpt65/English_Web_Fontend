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
    topic?: string;
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
    }, []); const fetchProgressData = async () => {
        try {
            setIsLoading(true);

            // Import API client
            const api = (await import('../services/api')).default;

            // Fetch real progress data from backend
            const response = await api.get('/progress');

            setProgressData({
                totalWords: response.data.totalWords || 0,
                learnedWords: response.data.learnedWords || 0,
                chatSessions: response.data.chatSessions || 0,
                totalMessages: response.data.totalMessages || 0,
                streakDays: response.data.streakDays || 0,
                recentActivity: response.data.recentActivity || []
            });
        } catch (error) {
            console.error('Error fetching progress data:', error);
            // Set empty state on error
            setProgressData({
                totalWords: 0,
                learnedWords: 0,
                chatSessions: 0,
                totalMessages: 0,
                streakDays: 0,
                recentActivity: []
            });
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
    } return (
        <div className="max-w-6xl mx-auto px-4 py-4 lg:py-8">
            <div className="mb-6 lg:mb-8">
                <div className="flex items-center gap-2 lg:gap-3 mb-4">
                    <div className="w-10 lg:w-14 h-10 lg:h-14 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-2xl lg:text-3xl">📊</span>
                    </div>
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-extrabold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
                            Your Learning Progress
                        </h1>
                        <p className="text-sm lg:text-base text-gray-600 font-medium">
                            Welcome back, {user?.name}! Here's your learning journey so far. ✨
                        </p>
                    </div>
                </div>
            </div>

            {/* Progress Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
                <div className="bg-white p-4 lg:p-6 rounded-xl lg:rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between mb-2 lg:mb-3">
                        <h3 className="text-xs lg:text-sm font-bold text-gray-600">Vocabulary Progress</h3>
                        <span className="text-xl lg:text-2xl">📚</span>
                    </div>
                    <div className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent mb-1 lg:mb-2">
                        {progressData.learnedWords}/{progressData.totalWords}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div
                            className="bg-gradient-to-r from-orange-400 to-pink-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                    <p className="text-xs lg:text-sm text-gray-500 font-medium">{progressPercentage}% complete</p>
                </div>

                <div className="bg-white p-4 lg:p-6 rounded-xl lg:rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between mb-2 lg:mb-3">
                        <h3 className="text-xs lg:text-sm font-bold text-gray-600">Chat Sessions</h3>
                        <span className="text-xl lg:text-2xl">💬</span>
                    </div>
                    <div className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent mb-1 lg:mb-2">
                        {progressData.chatSessions}
                    </div>
                    <p className="text-xs lg:text-sm text-gray-500 font-medium">Total conversations</p>
                </div>

                <div className="bg-white p-4 lg:p-6 rounded-xl lg:rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between mb-2 lg:mb-3">
                        <h3 className="text-xs lg:text-sm font-bold text-gray-600">Messages Sent</h3>
                        <span className="text-xl lg:text-2xl">📝</span>
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
                <div className="space-y-4">                    {progressData.recentActivity.length > 0 ? (
                    progressData.recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                            <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-xs text-gray-500">
                                        {new Date(activity.date).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                    {activity.topic && (
                                        <>
                                            <span className="text-xs text-gray-400">•</span>
                                            <span className="text-xs text-orange-600 font-medium">{activity.topic}</span>
                                        </>
                                    )}
                                </div>
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
