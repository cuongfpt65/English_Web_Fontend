import React, { useState } from 'react';
import type { MyVocab } from '../types';

interface EditVocabularyModalProps {
    vocabulary: MyVocab;
    onClose: () => void;
    onUpdate: (id: string, vocab: Partial<MyVocab>) => Promise<void>;
}

const EditVocabularyModal: React.FC<EditVocabularyModalProps> = ({
    vocabulary,
    onClose,
    onUpdate
}) => {
    const [formData, setFormData] = useState({
        word: vocabulary.word,
        meaning: vocabulary.meaning,
        example: vocabulary.example || '',
        imageUrl: vocabulary.imageUrl || '',
        topic: vocabulary.topic || '',
        level: vocabulary.level || '',
        note: vocabulary.note || '',
        isLearned: vocabulary.isLearned
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.word.trim() || !formData.meaning.trim()) {
            alert('Vui lòng nhập từ vựng và nghĩa');
            return;
        }

        setLoading(true);
        try {
            await onUpdate(vocabulary.id, formData);
        } catch (error) {
            // Error already handled in parent
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 lg:p-8 my-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        ✏️ Chỉnh sửa từ vựng
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Word */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Từ vựng <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="word"
                            value={formData.word}
                            onChange={handleChange}
                            required
                            placeholder="Nhập từ vựng..."
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Meaning */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Nghĩa <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="meaning"
                            value={formData.meaning}
                            onChange={handleChange}
                            required
                            placeholder="Nhập nghĩa..."
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Example */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Ví dụ
                        </label>
                        <textarea
                            name="example"
                            value={formData.example}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Nhập câu ví dụ..."
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                    </div>

                    {/* Image URL */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            URL hình ảnh
                        </label>
                        <input
                            type="url"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleChange}
                            placeholder="https://example.com/image.jpg"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Topic & Level */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Chủ đề
                            </label>
                            <input
                                type="text"
                                name="topic"
                                value={formData.topic}
                                onChange={handleChange}
                                placeholder="VD: Animals, Food..."
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Cấp độ
                            </label>
                            <select
                                name="level"
                                value={formData.level}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Chọn cấp độ</option>
                                <option value="A1">A1</option>
                                <option value="A2">A2</option>
                                <option value="B1">B1</option>
                                <option value="B2">B2</option>
                                <option value="C1">C1</option>
                                <option value="C2">C2</option>
                            </select>
                        </div>
                    </div>

                    {/* Note */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Ghi chú cá nhân
                        </label>
                        <textarea
                            name="note"
                            value={formData.note}
                            onChange={handleChange}
                            rows={2}
                            placeholder="Ghi chú riêng của bạn..."
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                    </div>

                    {/* Is Learned */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="isLearned"
                            name="isLearned"
                            checked={formData.isLearned}
                            onChange={handleChange}
                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="isLearned" className="text-sm font-semibold text-gray-700">
                            Đánh dấu là đã học
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Đang cập nhật...' : '✅ Lưu thay đổi'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-all"
                        >
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditVocabularyModal;
