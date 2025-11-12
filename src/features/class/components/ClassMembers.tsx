import React, { useEffect } from 'react';
import { useClassStore } from '../../../store/classStore';

interface ClassMembersProps {
    classId: string;
}

const ClassMembers: React.FC<ClassMembersProps> = ({ classId }) => {
    const {
        classMembers,
        currentClass,
        error,
        fetchClassMembers,
        removeMember,
    } = useClassStore();

    useEffect(() => {
        fetchClassMembers(classId);
    }, [classId, fetchClassMembers]);

    const handleRemoveMember = async (userId: string, userName: string) => {
        if (window.confirm(`Are you sure you want to remove ${userName} from the class?`)) {
            await removeMember(classId, userId);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Class Members</h3>
                <p className="text-sm text-gray-500">
                    {classMembers.length} members in this class
                </p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                    {error}
                </div>
            )}

            {/* Members List */}
            <div className="p-6">
                {classMembers.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                        <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <p>No members found.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {classMembers.map((member) => (
                            <div
                                key={member.id}
                                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                            >
                                {/* Avatar */}
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-white ${member.role === 'Teacher' ? 'bg-purple-500' : 'bg-blue-500'
                                    }`}>
                                    {member.fullName.charAt(0).toUpperCase()}
                                </div>

                                {/* User Info */}
                                <div className="ml-4 flex-1">
                                    <div className="flex items-center">
                                        <h4 className="font-semibold text-gray-900">{member.fullName}</h4>
                                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${member.role === 'Teacher'
                                                ? 'bg-purple-100 text-purple-800'
                                                : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            {member.role}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500">@{member.userName}</p>
                                    <p className="text-xs text-gray-400">
                                        Joined {new Date(member.joinedAt).toLocaleDateString()}
                                    </p>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-4 text-center mr-4">
                                    <div>
                                        <div className="text-lg font-semibold text-gray-900">
                                            {member.vocabularyCount}
                                        </div>
                                        <div className="text-xs text-gray-500">Words</div>
                                    </div>
                                    <div>
                                        <div className="text-lg font-semibold text-gray-900">
                                            {member.bestQuizScore}%
                                        </div>
                                        <div className="text-xs text-gray-500">Best Quiz</div>
                                    </div>
                                </div>

                                {/* Actions */}
                                {member.role === 'Student' && (
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handleRemoveMember(member.userId, member.fullName)}
                                            className="text-red-600 hover:text-red-800 text-sm"
                                            title="Remove from class"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Invite Code Section */}
            {currentClass && (
                <div className="px-6 pb-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Invite New Members</h4>
                        <p className="text-sm text-gray-600 mb-3">
                            Share this invite code with students to join the class:
                        </p>
                        <div className="flex items-center space-x-2">
                            <code className="px-3 py-2 bg-white border border-gray-300 rounded-md font-mono text-lg tracking-wider">
                                {currentClass.id.substring(0, 8).toUpperCase()}
                            </code>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(currentClass.id.substring(0, 8).toUpperCase());
                                    alert('Invite code copied to clipboard!');
                                }}
                                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                            >
                                Copy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClassMembers;
