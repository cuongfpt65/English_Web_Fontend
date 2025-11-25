import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store';
import { useClassStore } from '../../store/classStore';
import ClassCard from './components/ClassCard';
import CreateClassModal from './components/CreateClassModal';
import JoinClassModal from './components/JoinClassModal';

const ClassPage: React.FC = () => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const { user } = useAuthStore();

    const {
        classes,
        isLoading,
        error,
        fetchMyClasses,
        setError,
    } = useClassStore();

    useEffect(() => {
        fetchMyClasses();
    }, [fetchMyClasses]);    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-peach-50 py-4 lg:py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-6 lg:mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-2 lg:gap-3">
                            <div className="w-10 lg:w-14 h-10 lg:h-14 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg">
                                <span className="text-2xl lg:text-3xl">🏫</span>
                            </div>
                            <div>
                                <h1 className="text-2xl lg:text-4xl font-extrabold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
                                    My Classes
                                </h1>
                                <p className="mt-1 text-sm lg:text-base text-gray-600 font-medium">
                                    Practice English with friends! 🎯
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 lg:gap-3 w-full sm:w-auto">                            <button
                                onClick={() => setShowJoinModal(true)}
                                className="inline-flex items-center justify-center px-3 lg:px-4 py-2 lg:py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 border-2 border-transparent rounded-lg lg:rounded-xl font-bold text-white hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform text-sm lg:text-base w-full sm:w-auto"
                            >
                                <svg className="w-4 lg:w-5 h-4 lg:h-5 mr-1 lg:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                                Join Class
                            </button>                            {user?.role === 'Teacher' && (
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="inline-flex items-center justify-center px-3 lg:px-4 py-2 lg:py-2.5 bg-gradient-to-r from-orange-500 to-pink-600 border-2 border-transparent rounded-lg lg:rounded-xl font-bold text-white hover:from-orange-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform text-sm lg:text-base w-full sm:w-auto"
                                >
                                    <svg className="w-4 lg:w-5 h-4 lg:h-5 mr-1 lg:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Create Class
                                </button>
                            )}
                        </div>
                    </div>
                </div>                {/* Error Message */}
                {error && (
                    <div className="mb-4 lg:mb-6 mx-4 lg:mx-0 p-3 lg:p-4 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 text-red-700 rounded-xl lg:rounded-2xl shadow-md">
                        <div className="flex items-start gap-2 lg:gap-3">
                            <span className="text-lg lg:text-2xl">⚠️</span>
                            <span className="flex-1 font-medium text-sm lg:text-base">{error}</span>
                            <button
                                onClick={() => setError(null)}
                                className="text-red-500 hover:text-red-700 transition-colors p-1"
                            >
                                <svg className="w-4 lg:w-5 h-4 lg:h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}                {/* Loading Spinner */}
                {isLoading && (
                    <div className="flex justify-center items-center py-8 lg:py-12">
                        <div className="inline-block text-center">
                            <div className="w-12 lg:w-16 h-12 lg:h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto"></div>
                            <p className="mt-3 lg:mt-4 text-base lg:text-lg font-bold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
                                Loading classes...
                            </p>
                        </div>
                    </div>
                )}

                {/* Classes Grid */}
                {!isLoading && (
                    <>
                        {classes.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                                {classes.map((classRoom) => (
                                    <ClassCard
                                        key={classRoom.id}
                                        classRoom={classRoom}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                <h3 className="text-lg font-medium text-gray-500 mb-2">No classes yet</h3>
                                <p className="text-gray-400 mb-6">
                                    Create a new class or join an existing one to start learning with others.
                                </p>                                <div className="flex justify-center space-x-4">
                                    {user?.role === 'Teacher' && (
                                        <>
                                            <button
                                                onClick={() => setShowCreateModal(true)}
                                                className="text-blue-600 hover:text-blue-800 font-medium"
                                            >
                                                Create your first class
                                            </button>
                                            <span className="text-gray-400">or</span>
                                        </>
                                    )}
                                    <button
                                        onClick={() => setShowJoinModal(true)}
                                        className="text-green-600 hover:text-green-800 font-medium"
                                    >
                                        Join a class
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modals */}
            <CreateClassModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSuccess={() => {
                    setShowCreateModal(false);
                    fetchMyClasses();
                }}
            />

            <JoinClassModal
                isOpen={showJoinModal}
                onClose={() => setShowJoinModal(false)}
                onSuccess={() => {
                    setShowJoinModal(false);
                    fetchMyClasses();
                }}
            />
        </div>
    );
};

export default ClassPage;
