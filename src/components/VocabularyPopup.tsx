import { BookOpen, Check, X } from 'lucide-react';
import React, { useState } from 'react';

interface VocabularyWord {
    word: string;
    meaning: string;
    example?: string;
}

interface VocabularyPopupProps {
    words: VocabularyWord[];
    onSave: (selectedWords: VocabularyWord[]) => void;
    onClose: () => void;
}

const VocabularyPopup: React.FC<VocabularyPopupProps> = ({ words, onSave, onClose }) => {
    const [selectedWords, setSelectedWords] = useState<Set<string>>(new Set(words.map(w => w.word)));

    const toggleWord = (word: string) => {
        const newSelected = new Set(selectedWords);
        if (newSelected.has(word)) {
            newSelected.delete(word);
        } else {
            newSelected.add(word);
        }
        setSelectedWords(newSelected);
    };

    const handleSave = () => {
        const wordsToSave = words.filter(w => selectedWords.has(w.word));
        onSave(wordsToSave);
    };

    if (words.length === 0) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden animate-slideUp">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 to-pink-600 p-5 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">💡 Lưu từ vựng mới</h2>
                            <p className="text-sm opacity-90 mt-1">
                                Chọn các từ bạn muốn thêm vào danh sách học tập
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-5 overflow-y-auto max-h-[calc(85vh-180px)]">
                    <div className="space-y-3">
                        {words.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => toggleWord(item.word)}
                                className={`p-4 rounded-xl border-2 cursor-pointer transition-all transform hover:scale-[1.02] ${selectedWords.has(item.word)
                                        ? 'border-pink-500 bg-gradient-to-r from-orange-50 to-pink-50 shadow-md'
                                        : 'border-gray-200 hover:border-pink-300 hover:bg-pink-25'
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div
                                        className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${selectedWords.has(item.word)
                                                ? 'bg-gradient-to-br from-orange-500 to-pink-600 text-white shadow-md'
                                                : 'border-2 border-gray-300 bg-white'
                                            }`}
                                    >
                                        {selectedWords.has(item.word) && <Check className="w-4 h-4" />}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-800 text-lg mb-1">
                                            {item.word}
                                        </h3>
                                        <p className="text-gray-600 mb-2">{item.meaning}</p>
                                        {item.example && (
                                            <div className="bg-white/50 rounded-lg p-2 mt-2">
                                                <p className="text-sm text-gray-500 italic">
                                                    <span className="font-semibold">Ví dụ:</span> {item.example}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t-2 border-gray-100 p-5 bg-gray-50 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-5 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-bold hover:bg-gray-100 transition-all transform hover:scale-[1.02]"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={selectedWords.size === 0}
                        className="flex-1 px-5 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-xl font-bold hover:from-orange-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                    >
                        💾 Lưu ({selectedWords.size} từ)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VocabularyPopup;
