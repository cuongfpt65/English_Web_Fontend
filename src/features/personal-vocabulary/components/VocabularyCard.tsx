import React from 'react';
import type { MyVocab } from '../types';

interface VocabularyCardProps {
    vocabulary: MyVocab;
    onEdit: () => void;
    onDelete: () => void;
    onToggleLearned: () => void;
    onAddToGlobal?: () => void;
    isSelectionMode?: boolean;
    isSelected?: boolean;
    onToggleSelect?: () => void;
    existsInGlobal?: boolean;
}

const VocabularyCard: React.FC<VocabularyCardProps> = ({
    vocabulary,
    onEdit,
    onDelete,
    onToggleLearned,
    onAddToGlobal,
    isSelectionMode = false,
    isSelected = false,
    onToggleSelect,
    existsInGlobal = false
}) => {
    return (
        <div className={`relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all border-2 ${isSelected
            ? 'border-emerald-500 ring-4 ring-emerald-200'
            : vocabulary.isLearned
                ? 'border-green-300'
                : 'border-gray-200'
            } ${isSelectionMode ? 'cursor-pointer' : ''}`}
            onClick={isSelectionMode ? onToggleSelect : undefined}
        >
            {/* Selection Checkbox */}
            {isSelectionMode && (
                <div className="absolute top-3 left-3 z-10">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xl shadow-lg ${isSelected
                        ? 'bg-emerald-500 text-white'
                        : 'bg-white border-2 border-gray-300'
                        }`}>
                        {isSelected ? '✓' : ''}
                    </div>
                </div>
            )}

            {/* Image */}
            {vocabulary.imageUrl && (
                <div className="h-40 overflow-hidden rounded-t-xl">
                    <img
                        src={vocabulary.imageUrl}
                        alt={vocabulary.word}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-800 mb-1">
                            {vocabulary.word}
                        </h3>
                        <p className="text-gray-600">
                            {vocabulary.meaning}
                        </p>
                    </div>
                    <button
                        onClick={onToggleLearned}
                        className={`ml-2 text-2xl transition-transform hover:scale-110 ${vocabulary.isLearned ? 'opacity-100' : 'opacity-30'
                            }`}
                        title={vocabulary.isLearned ? 'Đã học' : 'Chưa học'}
                    >
                        {vocabulary.isLearned ? '✅' : '⭕'}
                    </button>
                </div>

                {/* Example */}
                {vocabulary.example && (
                    <div className="mb-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                        <p className="text-sm text-gray-700 italic">
                            💬 {vocabulary.example}
                        </p>
                    </div>
                )}

                {/* Note */}
                {vocabulary.note && (
                    <div className="mb-3 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                        <p className="text-sm text-gray-700">
                            📝 {vocabulary.note}
                        </p>
                    </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {vocabulary.topic && (
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                            📂 {vocabulary.topic}
                        </span>
                    )}
                    {vocabulary.level && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                            📊 {vocabulary.level}
                        </span>
                    )}
                </div>                {/* Actions */}
                <div className="flex flex-col gap-2">
                    {!isSelectionMode && (
                        <>
                            <div className="flex gap-2">
                                <button
                                    onClick={onEdit}
                                    className="flex-1 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    ✏️ Sửa
                                </button>
                                <button
                                    onClick={onDelete}
                                    className="flex-1 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    🗑️ Xóa
                                </button>
                            </div>
                            {/* Only show "Add to Global" button if word doesn't exist in global vocabulary */}
                            {!existsInGlobal && onAddToGlobal && (
                                <button
                                    onClick={onAddToGlobal}
                                    className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                                    title="Thêm vào từ điển chung"
                                >
                                    🌐 Thêm vào Vocabulary
                                </button>
                            )}
                            {/* Show badge if word already exists in global vocabulary */}
                            {existsInGlobal && (
                                <div className="w-full px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 font-semibold rounded-lg flex items-center justify-center gap-2 border-2 border-gray-300">
                                    ✓ Đã có trong Vocabulary
                                </div>
                            )}
                        </>
                    )}
                    {isSelectionMode && (
                        <div className="text-center py-2 text-emerald-600 font-semibold">
                            {isSelected ? '✓ Đã chọn' : 'Click để chọn'}
                        </div>
                    )}
                </div>

                {/* Timestamp */}
                <div className="mt-3 text-xs text-gray-400 text-center">
                    {new Date(vocabulary.createdAt).toLocaleDateString('vi-VN')}
                </div>
            </div>
        </div>
    );
};

export default VocabularyCard;
