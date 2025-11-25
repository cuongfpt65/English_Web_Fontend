import React, { useState } from 'react';
import { useVocabularyStore } from '../../../store/vocabularyStore';

interface AddVocabularyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const AddVocabularyModal: React.FC<AddVocabularyModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
}) => {
    const [formData, setFormData] = useState({
        word: '',
        meaning: '',
        example: '',
        topic: '',
        level: 'Beginner',
        imageUrl: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const { addVocabulary, isLoading } = useVocabularyStore();

    const predefinedTopics = [
        'Greetings', 'Family', 'Food', 'Travel', 'Work', 'Education',
        'Health', 'Sports', 'Technology', 'Nature', 'Emotions', 'Time',
        'Colors', 'Numbers', 'Adjectives', 'Verbs', 'Nouns', 'Business'
    ];

    const predefinedLevels = ['Beginner', 'Intermediate', 'Advanced'];

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.word.trim()) {
            newErrors.word = 'Word is required';
        }

        if (!formData.meaning.trim()) {
            newErrors.meaning = 'Meaning is required';
        }

        if (!formData.example.trim()) {
            newErrors.example = 'Example is required';
        }

        if (!formData.topic.trim()) {
            newErrors.topic = 'Topic is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await addVocabulary({
                word: formData.word.trim(),
                meaning: formData.meaning.trim(),
                example: formData.example.trim(),
                topic: formData.topic.trim(),
                level: formData.level,
                imageUrl: formData.imageUrl.trim() || undefined,
            });

            // Reset form
            setFormData({
                word: '',
                meaning: '',
                example: '',
                topic: '',
                level: 'Beginner',
                imageUrl: '',
            });
            setErrors({});
            onSuccess();
        } catch (error) {
            console.error('Failed to add vocabulary:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleClose = () => {
        setFormData({
            word: '',
            meaning: '',
            example: '',
            topic: '',
            level: 'Beginner',
            imageUrl: '',
        });
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Add New Vocabulary</h2>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Word */}
                        <div>
                            <label htmlFor="word" className="block text-sm font-medium text-gray-700 mb-2">
                                Word *
                            </label>
                            <input
                                type="text"
                                id="word"
                                name="word"
                                value={formData.word}
                                onChange={handleChange}
                                placeholder="e.g., Beautiful"
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.word ? 'border-red-300' : 'border-gray-300'
                                    }`}
                            />
                            {errors.word && (
                                <p className="mt-1 text-sm text-red-600">{errors.word}</p>
                            )}
                        </div>

                        {/* Meaning */}
                        <div>
                            <label htmlFor="meaning" className="block text-sm font-medium text-gray-700 mb-2">
                                Meaning *
                            </label>
                            <input
                                type="text"
                                id="meaning"
                                name="meaning"
                                value={formData.meaning}
                                onChange={handleChange}
                                placeholder="e.g., Đẹp"
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.meaning ? 'border-red-300' : 'border-gray-300'
                                    }`}
                            />
                            {errors.meaning && (
                                <p className="mt-1 text-sm text-red-600">{errors.meaning}</p>
                            )}
                        </div>

                        {/* Example */}
                        <div>
                            <label htmlFor="example" className="block text-sm font-medium text-gray-700 mb-2">
                                Example Sentence *
                            </label>
                            <textarea
                                id="example"
                                name="example"
                                value={formData.example}
                                onChange={handleChange}
                                placeholder="e.g., She has a beautiful smile."
                                rows={3}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.example ? 'border-red-300' : 'border-gray-300'
                                    }`}
                            />
                            {errors.example && (
                                <p className="mt-1 text-sm text-red-600">{errors.example}</p>
                            )}
                        </div>

                        {/* Topic and Level Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Topic */}
                            <div>
                                <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                                    Topic *
                                </label>
                                <select
                                    id="topic"
                                    name="topic"
                                    value={formData.topic}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.topic ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                >
                                    <option value="">Select a topic</option>
                                    {predefinedTopics.map((topic) => (
                                        <option key={topic} value={topic}>
                                            {topic}
                                        </option>
                                    ))}
                                    <option value="custom">Custom Topic</option>
                                </select>
                                {errors.topic && (
                                    <p className="mt-1 text-sm text-red-600">{errors.topic}</p>
                                )}
                            </div>

                            {/* Level */}
                            <div>
                                <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
                                    Level
                                </label>
                                <select
                                    id="level"
                                    name="level"
                                    value={formData.level}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    {predefinedLevels.map((level) => (
                                        <option key={level} value={level}>
                                            {level}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Custom Topic Input */}
                        {formData.topic === 'custom' && (
                            <div>
                                <label htmlFor="customTopic" className="block text-sm font-medium text-gray-700 mb-2">
                                    Custom Topic
                                </label>
                                <input
                                    type="text"
                                    id="customTopic"
                                    name="topic"
                                    value=""
                                    onChange={(e) => handleChange({ target: { name: 'topic', value: e.target.value } } as any)}
                                    placeholder="Enter custom topic"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        )}

                        {/* Image URL */}
                        <div>
                            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                                Image URL (optional)
                            </label>
                            <input
                                type="url"
                                id="imageUrl"
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleChange}
                                placeholder="https://example.com/image.jpg"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Image Preview */}
                        {formData.imageUrl && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Image Preview
                                </label>
                                <img
                                    src={formData.imageUrl}
                                    alt="Preview"
                                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex space-x-4 pt-4">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="flex-1 px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                            >
                                {isLoading ? 'Adding...' : 'Add Vocabulary'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddVocabularyModal;
