import React, { useEffect, useState } from 'react';
import { useVocabularyStore } from '../../../store/vocabularyStore';

interface VocabularyStats {
    totalWords: number;
    learnedWords: number;
    byLevel: { [key: string]: { total: number; learned: number } };
    byTopic: { [key: string]: { total: number; learned: number } };
    recentlyAdded: number;
    todaysProgress: number;
}

const VocabularyStatsPanel: React.FC = () => {
    const [stats, setStats] = useState<VocabularyStats | null>(null);
    const { vocabularies, userVocabularies, fetchVocabularies, fetchUserVocabularies } = useVocabularyStore();

    useEffect(() => {
        calculateStats();
    }, [vocabularies, userVocabularies]);

    const calculateStats = () => {
        const learnedVocab = userVocabularies.filter(uv => uv.isLearned);
        const learnedIds = new Set(learnedVocab.map(uv => uv.vocabulary.id));

        // Calculate by level
        const byLevel: { [key: string]: { total: number; learned: number } } = {};
        vocabularies.forEach(vocab => {
            if (!byLevel[vocab.level]) {
                byLevel[vocab.level] = { total: 0, learned: 0 };
            }
            byLevel[vocab.level].total++;
            if (learnedIds.has(vocab.id)) {
                byLevel[vocab.level].learned++;
            }
        });

        // Calculate by topic
        const byTopic: { [key: string]: { total: number; learned: number } } = {};
        vocabularies.forEach(vocab => {
            if (!byTopic[vocab.topic]) {
                byTopic[vocab.topic] = { total: 0, learned: 0 };
            }
            byTopic[vocab.topic].total++;
            if (learnedIds.has(vocab.id)) {
                byTopic[vocab.topic].learned++;
            }
        });

        // Recently added (last 7 days)
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const recentlyAdded = userVocabularies.filter(uv =>
            new Date(uv.addedAt) > weekAgo
        ).length;

        // Today's progress
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todaysProgress = userVocabularies.filter(uv =>
            new Date(uv.addedAt) >= today && uv.isLearned
        ).length;

        setStats({
            totalWords: vocabularies.length,
            learnedWords: learnedVocab.length,
            byLevel,
            byTopic,
            recentlyAdded,
            todaysProgress,
        });
    };

    const getProgressPercentage = (learned: number, total: number) => {
        return total > 0 ? Math.round((learned / total) * 100) : 0;
    };

    const getLevelColor = (level: string) => {
        switch (level.toLowerCase()) {
            case 'beginner':
                return 'text-green-600 bg-green-100';
            case 'intermediate':
                return 'text-yellow-600 bg-yellow-100';
            case 'advanced':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    if (!stats) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-3 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    const overallProgress = getProgressPercentage(stats.learnedWords, stats.totalWords);

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Learning Statistics
            </h3>

            {/* Overall Progress */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                    <span className="text-sm text-gray-500">{stats.learnedWords}/{stats.totalWords}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                        className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${overallProgress}%` }}
                    ></div>
                </div>
                <div className="text-right mt-1">
                    <span className="text-lg font-bold text-blue-600">{overallProgress}%</span>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">{stats.todaysProgress}</div>
                    <div className="text-sm text-green-700">Learned Today</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">{stats.recentlyAdded}</div>
                    <div className="text-sm text-blue-700">Added This Week</div>
                </div>
            </div>

            {/* Progress by Level */}
            <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Progress by Level</h4>
                <div className="space-y-3">
                    {Object.entries(stats.byLevel).map(([level, data]) => {
                        const percentage = getProgressPercentage(data.learned, data.total);
                        return (
                            <div key={level}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getLevelColor(level)}`}>
                                        {level}
                                    </span>
                                    <span className="text-xs text-gray-500">{data.learned}/{data.total}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                                <div className="text-right mt-1">
                                    <span className="text-xs font-medium text-gray-600">{percentage}%</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Top Topics */}
            <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Top Topics</h4>
                <div className="space-y-2">
                    {Object.entries(stats.byTopic)
                        .sort(([, a], [, b]) => b.total - a.total)
                        .slice(0, 5)
                        .map(([topic, data]) => {
                            const percentage = getProgressPercentage(data.learned, data.total);
                            return (
                                <div key={topic} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-gray-700">{topic}</div>
                                        <div className="flex items-center mt-1">
                                            <div className="w-20 bg-gray-200 rounded-full h-1.5 mr-2">
                                                <div
                                                    className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs text-gray-500">{percentage}%</span>
                                        </div>
                                    </div>
                                    <div className="text-right ml-3">
                                        <div className="text-sm font-medium text-gray-900">{data.learned}</div>
                                        <div className="text-xs text-gray-500">of {data.total}</div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        </div>
    );
};

export default VocabularyStatsPanel;
