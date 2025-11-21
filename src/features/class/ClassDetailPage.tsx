import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useClassStore } from '../../store/classStore';
import ClassChat from './components/ClassChat';
import ClassMembers from './components/ClassMembers';
import ClassQuizzes from './components/ClassQuizzes';

const ClassDetailPage: React.FC = () => {
    const { classId } = useParams<{ classId: string }>();
    const navigate = useNavigate();

    const {
        currentClass,
        selectedTab,
        isLoading,
        error,
        fetchClassById,
        setSelectedTab,
        setCurrentClass,
        clearMessages,
    } = useClassStore();

    useEffect(() => {
        if (!classId) {
            navigate('/class');
            return;
        }

        fetchClassById(classId);

        // Cleanup on unmount
        return () => {
            setCurrentClass(null);
            clearMessages();
        };
    }, [classId, fetchClassById, navigate, setCurrentClass, clearMessages]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !currentClass) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-lg mb-4">{error || 'Class not found'}</div>
                    <button
                        onClick={() => navigate('/class')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Back to Classes
                    </button>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: 'chat' as const, name: 'Chat', icon: '💬' },
        { id: 'quizzes' as const, name: 'Quizzes', icon: '📝' },

        { id: 'members' as const, name: 'Members', icon: '👥' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <button
                                onClick={() => navigate('/class')}
                                className="mr-4 text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{currentClass.name}</h1>
                                <p className="text-gray-600">Teacher: {currentClass.teacherName}</p>
                            </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span>{currentClass.memberCount} members</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex space-x-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setSelectedTab(tab.id)}
                                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${selectedTab === tab.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <span className="mr-2">{tab.icon}</span>
                                {tab.name}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Tab Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {selectedTab === 'chat' && (
                    <ClassChat classId={classId!} />
                )}
                {selectedTab === 'quizzes' && (
                    <ClassQuizzes classId={classId!} />
                )}

                {selectedTab === 'members' && (
                    <ClassMembers classId={classId!} />
                )}
            </div>
        </div>
    );
};

export default ClassDetailPage;
