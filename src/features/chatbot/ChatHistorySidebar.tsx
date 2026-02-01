import { ChevronLeft, Clock, MessageSquare, Pencil } from 'lucide-react';
import React, { useState } from 'react';
import type { ChatSession } from '../../services/chatService';

interface ChatHistorySidebarProps {
    sessions: ChatSession[];
    currentSessionId: string | null;
    onSelectSession: (sessionId: string) => void;
    onNewChat: () => void;
    onRenameSession?: (sessionId: string, newTitle: string) => void;
    onDeleteSession?: (sessionId: string) => void;
    isCollapsed?: boolean;
    onToggleCollapse?: () => void;
}

const ChatHistorySidebar: React.FC<ChatHistorySidebarProps> = ({
    sessions,
    currentSessionId,
    onSelectSession,
    onNewChat,
    onRenameSession,
    isCollapsed = false,
    onToggleCollapse,
}) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState('');

    const handleStartEdit = (session: ChatSession) => {
        setEditingId(session.id);
        setEditTitle(session.title);
    };

    const handleSaveEdit = (sessionId: string) => {
        if (editTitle.trim() && onRenameSession) {
            onRenameSession(sessionId, editTitle.trim());
        }
        setEditingId(null);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        return date.toLocaleDateString();
    }; return (<div className={`relative transition-all duration-300 ease-in-out ${isCollapsed ? 'w-0' : 'w-64'}`}>
        {/* Toggle Button - Always Visible */}
        <button
            onClick={onToggleCollapse}
            className={`absolute top-20 z-50 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-full p-1.5 shadow-lg hover:shadow-xl transition-all duration-300 ${isCollapsed ? 'left-2 rotate-180' : '-right-3'}`}
            title={isCollapsed ? 'Show sidebar' : 'Hide sidebar'}
        >
            <ChevronLeft className="w-4 h-4" />
        </button>
        {/* Sidebar Content */}
        <div className={`bg-white border-r-2 border-orange-200 flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
            {/* Header */}
            <div className="p-3 border-b-2 border-orange-200">
                <h2 className="text-base font-bold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent mb-2">
                    💬 Chat History
                </h2>
                <button
                    onClick={onNewChat}
                    className="w-full bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-lg px-3 py-2 text-sm font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                    <MessageSquare className="w-4 h-4" />
                    New Chat
                </button>
            </div>{/* Sessions List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
                {sessions.length === 0 ? (
                    <div className="text-center py-6 px-3">
                        <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-orange-100 to-pink-100 rounded-xl flex items-center justify-center">
                            <MessageSquare className="w-6 h-6 text-orange-400" />
                        </div>
                        <p className="text-xs text-gray-500 font-medium">No chat history yet</p>
                        <p className="text-xs text-gray-400 mt-1">Start a new conversation!</p>
                    </div>
                ) : (sessions.map((session) => (
                    <div
                        key={session.id}
                        className={`group rounded-lg border transition-all cursor-pointer ${currentSessionId === session.id
                            ? 'bg-gradient-to-r from-orange-50 to-pink-50 border-orange-300 shadow-sm'
                            : 'bg-white border-gray-200 hover:border-orange-200 hover:shadow-sm'
                            }`}
                    >
                        {editingId === session.id ? (
                            <div className="p-2">
                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleSaveEdit(session.id);
                                        if (e.key === 'Escape') setEditingId(null);
                                    }}
                                    onBlur={() => handleSaveEdit(session.id)}
                                    className="w-full px-2 py-1 border border-orange-300 rounded text-xs font-medium focus:outline-none focus:ring-1 focus:ring-pink-400"
                                    autoFocus
                                />
                            </div>
                        ) : (
                            <div
                                onClick={() => onSelectSession(session.id)}
                                className="p-2"
                            >
                                <div className="flex items-start justify-between gap-1.5">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-xs font-bold text-gray-900 truncate mb-0.5">
                                            {session.title}
                                        </h3>
                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                            <Clock className="w-3 h-3" />
                                            <span className="text-xs">{formatDate(session.createdAt)}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleStartEdit(session);
                                        }}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-orange-100 rounded"
                                    >
                                        <Pencil className="w-3 h-3 text-orange-600" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )))}
            </div>
        </div>
    </div>
    );
};

export default ChatHistorySidebar;
