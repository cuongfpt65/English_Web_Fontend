import React from 'react';

interface VocabularyStatsProps {
    totalWords: number;
    learnedWords: number;
    notLearnedWords: number;
}

const VocabularyStats: React.FC<VocabularyStatsProps> = ({
    totalWords,
    learnedWords,
    notLearnedWords
}) => {
    const percentage = totalWords > 0 ? Math.round((learnedWords / totalWords) * 100) : 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total */}
            <div className="bg-gradient-to-r from-purple-100 to-purple-50 rounded-xl p-4 border-2 border-purple-200">
                <div className="flex items-center gap-3">
                    <div className="text-3xl">📚</div>
                    <div>
                        <p className="text-sm text-purple-600 font-semibold">Tổng từ vựng</p>
                        <p className="text-2xl font-bold text-purple-700">{totalWords}</p>
                    </div>
                </div>
            </div>

            {/* Learned */}
            <div className="bg-gradient-to-r from-green-100 to-green-50 rounded-xl p-4 border-2 border-green-200">
                <div className="flex items-center gap-3">
                    <div className="text-3xl">✅</div>
                    <div>
                        <p className="text-sm text-green-600 font-semibold">Đã học</p>
                        <p className="text-2xl font-bold text-green-700">
                            {learnedWords} ({percentage}%)
                        </p>
                    </div>
                </div>
            </div>

            {/* Not Learned */}
            <div className="bg-gradient-to-r from-orange-100 to-orange-50 rounded-xl p-4 border-2 border-orange-200">
                <div className="flex items-center gap-3">
                    <div className="text-3xl">⭕</div>
                    <div>
                        <p className="text-sm text-orange-600 font-semibold">Chưa học</p>
                        <p className="text-2xl font-bold text-orange-700">{notLearnedWords}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VocabularyStats;
