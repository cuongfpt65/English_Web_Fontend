import React from 'react';
import { Link } from 'react-router-dom';
import type { ClassRoom } from '../../../services/classService';

interface ClassCardProps {
    classRoom: ClassRoom;
}

const ClassCard: React.FC<ClassCardProps> = ({ classRoom }) => {    return (
        <Link to={`/class/${classRoom.id}`} className="block">
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200 p-4 lg:p-6 hover:scale-105 transform">
                <div className="flex items-start justify-between mb-3 lg:mb-4">
                    <div className="flex-1">
                        <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                            {classRoom.name}
                        </h3>
                        {classRoom.description && (
                            <p className="text-gray-600 text-xs lg:text-sm mb-2 lg:mb-3 line-clamp-2">
                                {classRoom.description}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center text-xs lg:text-sm text-gray-500">
                        <svg className="w-3 lg:w-4 h-3 lg:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="truncate">{classRoom.teacherName}</span>
                    </div>
                    <div className="flex items-center text-xs lg:text-sm text-gray-500">
                        <svg className="w-3 lg:w-4 h-3 lg:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>{classRoom.memberCount} members</span>
                    </div>
                </div>

                <div className="mt-3 lg:mt-4 pt-3 lg:pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-400">
                        <span className="truncate">Created {new Date(classRoom.createdAt).toLocaleDateString()}</span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ml-2 flex-shrink-0">
                            Active
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ClassCard;
