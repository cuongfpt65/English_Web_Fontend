import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';

const AdminStatistics: React.FC = () => {
    const [userStats, setUserStats] = useState<any>(null);
    const [classStats, setClassStats] = useState<any>(null);
    const [vocabStats, setVocabStats] = useState<any>(null);
    const [quizStats, setQuizStats] = useState<any>(null);
    const [chatStats, setChatStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadAllStatistics();
    }, []);

    const loadAllStatistics = async () => {
        setIsLoading(true);
        try {
            const [users, classes, vocab, quiz, chat] = await Promise.all([
                adminService.getUserStatistics(),
                adminService.getClassStatistics(),
                adminService.getVocabularyStatistics(),
                adminService.getQuizStatistics(),
                adminService.getChatStatistics(),
            ]);
            setUserStats(users);
            setClassStats(classes);
            setVocabStats(vocab);
            setQuizStats(quiz);
            setChatStats(chat);
        } catch (error) {
            console.error('Failed to load statistics:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-lg font-bold text-purple-600">Loading statistics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-3xl">📊</span>
                        </div>
                        <div>
                            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                                Detailed Statistics
                            </h1>
                            <p className="mt-1 text-gray-600 font-medium">
                                Analytics and insights for your platform 📈
                            </p>
                        </div>
                    </div>
                </div>

                {/* User Statistics */}
                {userStats && (
                    <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-100">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <span>👥</span> User Statistics
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-bold text-gray-700 mb-4">Users by Role</h3>
                                <div className="space-y-3">
                                    {userStats.usersByRole?.map((item: any) => (
                                        <div key={item.role} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                            <span className="font-semibold text-gray-700">{item.role}</span>
                                            <span className="text-xl font-bold text-blue-600">{item.count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-700 mb-4">New Users (Last 7 Days)</h3>
                                <div className="space-y-2">
                                    {userStats.newUsersByDay?.map((item: any) => (
                                        <div key={item.date} className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                                            <span className="text-sm text-gray-600">{item.date}</span>
                                            <span className="font-bold text-green-600">{item.count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Class Statistics */}
                {classStats && (
                    <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border-2 border-green-100">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <span>🏫</span> Class Statistics
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="p-4 bg-green-50 rounded-xl">
                                <p className="text-sm text-gray-600 mb-1">Total Classes</p>
                                <p className="text-3xl font-bold text-green-600">{classStats.totalClasses}</p>
                            </div>
                            <div className="p-4 bg-blue-50 rounded-xl">
                                <p className="text-sm text-gray-600 mb-1">Active Classes</p>
                                <p className="text-3xl font-bold text-blue-600">{classStats.activeClasses}</p>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-xl">
                                <p className="text-sm text-gray-600 mb-1">Avg Members/Class</p>
                                <p className="text-3xl font-bold text-purple-600">{classStats.averageMembersPerClass}</p>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-700 mb-4">Top 5 Classes</h3>
                            <div className="space-y-2">
                                {classStats.topClasses?.map((cls: any, index: number) => (
                                    <div key={cls.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl font-bold text-green-600">#{index + 1}</span>
                                            <div>
                                                <p className="font-bold text-gray-800">{cls.name}</p>
                                                <p className="text-sm text-gray-600">Code: {cls.code}</p>
                                            </div>
                                        </div>
                                        <span className="text-xl font-bold text-green-600">{cls.memberCount} members</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Vocabulary Statistics */}
                {vocabStats && (
                    <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border-2 border-orange-100">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <span>📚</span> Vocabulary Statistics
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="p-4 bg-orange-50 rounded-xl">
                                <p className="text-sm text-gray-600 mb-1">Total Vocabularies</p>
                                <p className="text-3xl font-bold text-orange-600">{vocabStats.totalVocabularies}</p>
                            </div>
                            <div className="p-4 bg-pink-50 rounded-xl">
                                <p className="text-sm text-gray-600 mb-1">User Vocabularies</p>
                                <p className="text-3xl font-bold text-pink-600">{vocabStats.totalUserVocabularies}</p>
                            </div>
                            <div className="p-4 bg-red-50 rounded-xl">
                                <p className="text-sm text-gray-600 mb-1">Avg per User</p>
                                <p className="text-3xl font-bold text-red-600">{vocabStats.averageVocabulariesPerUser}</p>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-700 mb-4">Top Categories</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {vocabStats.vocabulariesByCategory?.map((item: any) => (
                                    <div key={item.category} className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                                        <p className="text-sm text-gray-600 mb-1">{item.category}</p>
                                        <p className="text-xl font-bold text-orange-600">{item.count}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Quiz Statistics */}
                {quizStats && (
                    <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border-2 border-pink-100">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <span>📝</span> Quiz Statistics
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="p-4 bg-pink-50 rounded-xl">
                                <p className="text-sm text-gray-600 mb-1">Total Quizzes</p>
                                <p className="text-3xl font-bold text-pink-600">{quizStats.totalQuizzes}</p>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-xl">
                                <p className="text-sm text-gray-600 mb-1">Total Attempts</p>
                                <p className="text-3xl font-bold text-purple-600">{quizStats.totalAttempts}</p>
                            </div>
                            <div className="p-4 bg-indigo-50 rounded-xl">
                                <p className="text-sm text-gray-600 mb-1">Completed</p>
                                <p className="text-3xl font-bold text-indigo-600">{quizStats.completedAttempts}</p>
                            </div>
                            <div className="p-4 bg-blue-50 rounded-xl">
                                <p className="text-sm text-gray-600 mb-1">Average Score</p>
                                <p className="text-3xl font-bold text-blue-600">{quizStats.averageScore}%</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Chat Statistics */}
                {chatStats && (
                    <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-100">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <span>💬</span> Chat Statistics
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="p-4 bg-purple-50 rounded-xl">
                                <p className="text-sm text-gray-600 mb-1">Total Sessions</p>
                                <p className="text-3xl font-bold text-purple-600">{chatStats.totalSessions}</p>
                            </div>
                            <div className="p-4 bg-indigo-50 rounded-xl">
                                <p className="text-sm text-gray-600 mb-1">Total Messages</p>
                                <p className="text-3xl font-bold text-indigo-600">{chatStats.totalMessages}</p>
                            </div>
                            <div className="p-4 bg-blue-50 rounded-xl">
                                <p className="text-sm text-gray-600 mb-1">Avg Messages/Session</p>
                                <p className="text-3xl font-bold text-blue-600">{chatStats.averageMessagesPerSession}</p>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-700 mb-4">Sessions (Last 7 Days)</h3>
                            <div className="space-y-2">
                                {chatStats.sessionsByDay?.map((item: any) => (
                                    <div key={item.date} className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                                        <span className="text-sm text-gray-600">{item.date}</span>
                                        <span className="font-bold text-purple-600">{item.count} sessions</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminStatistics;
