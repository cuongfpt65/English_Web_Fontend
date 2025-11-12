import React, { useEffect } from 'react';
import { useClassStore } from '../../../store/classStore';

interface ClassRankingProps {
    classId: string;
}

const ClassRanking: React.FC<ClassRankingProps> = ({ classId }) => {
    const {
        ranking,
        error,
        fetchRanking,
    } = useClassStore();

    useEffect(() => {
        fetchRanking(classId);
    }, [classId, fetchRanking]);

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1:
                return '🥇';
            case 2:
                return '🥈';
            case 3:
                return '🥉';
            default:
                return `#${rank}`;
        }
    };

    const getRankColor = (rank: number) => {
        switch (rank) {
            case 1:
                return 'text-yellow-600 bg-yellow-50';
            case 2:
                return 'text-gray-600 bg-gray-50';
            case 3:
                return 'text-orange-600 bg-orange-50';
            default:
                return 'text-gray-500 bg-gray-50';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Class Ranking</h3>
                <p className="text-sm text-gray-500">
                    Rankings based on vocabulary learned and quiz performance
                </p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                    {error}
                </div>
            )}

            {/* Ranking List */}
            <div className="p-6">
                {ranking.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                        <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <p>No ranking data available yet.</p>
                        <p className="text-xs text-gray-400 mt-1">Complete some vocabulary lessons and quizzes to appear in rankings!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {ranking.map((member) => (
                            <div
                                key={member.userId}
                                className={`flex items-center p-4 rounded-lg border ${member.rank <= 3 ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200'
                                    }`}
                            >
                                {/* Rank */}
                                <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold ${getRankColor(member.rank)}`}>
                                    {getRankIcon(member.rank)}
                                </div>

                                {/* User Info */}
                                <div className="ml-4 flex-1">
                                    <h4 className="font-semibold text-gray-900">{member.fullName}</h4>
                                    <p className="text-sm text-gray-500">@{member.userName}</p>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-6 text-center">
                                    <div>
                                        <div className="text-lg font-semibold text-gray-900">
                                            {member.vocabularyCount}
                                        </div>
                                        <div className="text-xs text-gray-500">Words Learned</div>
                                    </div>
                                    <div>
                                        <div className="text-lg font-semibold text-gray-900">
                                            {member.bestQuizScore}%
                                        </div>
                                        <div className="text-xs text-gray-500">Best Quiz Score</div>
                                    </div>
                                    <div>
                                        <div className="text-lg font-semibold text-gray-900">
                                            {member.averageQuizScore}%
                                        </div>
                                        <div className="text-xs text-gray-500">Avg Quiz Score</div>
                                    </div>
                                </div>

                                {/* Trophy for top 3 */}
                                {member.rank <= 3 && (
                                    <div className="ml-4">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${member.rank === 1 ? 'bg-yellow-100 text-yellow-600' :
                                                member.rank === 2 ? 'bg-gray-100 text-gray-600' :
                                                    'bg-orange-100 text-orange-600'
                                            }`}>
                                            🏆
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Legend */}
            {ranking.length > 0 && (
                <div className="px-6 pb-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Ranking Criteria:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Primary: Number of vocabulary words learned</li>
                            <li>• Secondary: Best quiz score achieved</li>
                            <li>• Tertiary: Average quiz performance</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClassRanking;
