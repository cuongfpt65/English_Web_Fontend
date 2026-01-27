import { Plus, Send } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Button } from '../../components/Button/Button';
import type { ChatMessage, ChatSession } from '../../services/chatService';
import chatService from '../../services/chatService';
import ChatHistorySidebar from './ChatHistorySidebar';

type ChatBotType = 'smalltalk' | 'error' | 'grammar_fix' | 'answer_suggest' | 'structure_review' | 'essay';

const ChatPage: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedType, setSelectedType] = useState<ChatBotType>('smalltalk');
    // Chat history states
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

    const chatBotTypes: Array<{ value: ChatBotType; label: string; emoji: string; description: string }> = [
        { value: 'smalltalk', label: 'Small Talk', emoji: '💬', description: 'Casual conversation' },
        { value: 'error', label: 'Error Check', emoji: '🔍', description: 'Find errors in text' },
        { value: 'grammar_fix', label: 'Grammar Fix', emoji: '✏️', description: 'Fix grammar mistakes' },
        { value: 'answer_suggest', label: 'Answer Suggest', emoji: '💡', description: 'Get answer suggestions' },
        { value: 'structure_review', label: 'Structure Review', emoji: '📝', description: 'Review text structure' },
        { value: 'essay', label: 'Essay Help', emoji: '📄', description: 'Essay writing assistance' },
    ];

    // Load sessions on mount
    useEffect(() => {
        loadSessions();
    }, []); const loadSessions = async () => {
        try {
            const data = await chatService.getSessions();
            setSessions(data);
        } catch (error) {
            console.error('Failed to load sessions:', error);
        }
    };

    const loadSessionMessages = async (sessionId: string) => {
        try {
            const data = await chatService.getSessionMessages(sessionId);
            setMessages(data);
            setCurrentSessionId(sessionId);
        } catch (error) {
            console.error('Failed to load messages:', error);
        }
    };

    const createNewConversation = async () => {
        try {
            const session = await chatService.createSession(`Chat ${new Date().toLocaleString()}`);
            setSessions([session, ...sessions]);
            setCurrentSessionId(session.id);
            setMessages([]);
            setInputMessage('');
        } catch (error) {
            console.error('Failed to create session:', error);
            setCurrentSessionId(null);
            setMessages([]);
            setInputMessage('');
        }
    };

    const handleSelectSession = (sessionId: string) => {
        loadSessionMessages(sessionId);
    };

    const handleRenameSession = async (sessionId: string, newTitle: string) => {
        try {
            await chatService.updateSessionTitle(sessionId, newTitle);
            setSessions(sessions.map(s =>
                s.id === sessionId ? { ...s, title: newTitle } : s
            ));
        } catch (error) {
            console.error('Failed to rename session:', error);
        }
    };

    const sendMessage = async () => {
        if (!inputMessage.trim() || loading) return;

        setLoading(true);
        const messageText = inputMessage;
        setInputMessage('');

        const tempUserMessage: ChatMessage = {
            id: `temp-${Date.now()}`,
            sender: 'User',
            message: messageText,
            createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, tempUserMessage]); try {
            const response = await chatService.sendMessage({
                type: selectedType,
                message: messageText,
                sessionId: currentSessionId || undefined,
            });

            if (response.sessionId && !currentSessionId) {
                setCurrentSessionId(response.sessionId);
                await loadSessions();
            }

            if (response.sessionId) {
                await loadSessionMessages(response.sessionId);
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            setMessages((prev) => prev.filter(m => m.id !== tempUserMessage.id));

            const errorMessage: ChatMessage = {
                id: `error-${Date.now()}`,
                sender: 'Bot',
                message: 'Sorry, there was an error processing your request.',
                createdAt: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const formatBotMessage = (text: string) => {
        return text
            .replace(/\*/g, '')
            .split('\n')
            .filter((line) => line.trim())
            .map((line, index) => (
                <p key={index} className="mb-2 last:mb-0">
                    {line.trim()}
                </p>
            ));
    };

    return (
        <div className="flex h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-peach-50">
            {/* Sidebar */}
            <ChatHistorySidebar
                sessions={sessions}
                currentSessionId={currentSessionId}
                onSelectSession={handleSelectSession}
                onNewChat={createNewConversation}
                onRenameSession={handleRenameSession}
            />

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full">
                {/* Header */}
                <div className="p-4 lg:p-6 border-b-2 border-orange-200 bg-white/80 backdrop-blur-sm shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 lg:gap-3 flex-1 min-w-0">
                            <div className="w-10 lg:w-12 h-10 lg:h-12 rounded-xl lg:rounded-2xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center flex-shrink-0">
                                <span className="text-xl lg:text-2xl">🤖</span>
                            </div>
                            <div className="min-w-0 flex-1">
                                <h2 className="text-lg lg:text-xl font-extrabold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent truncate">
                                    AI English Tutor
                                </h2>
                                <p className="text-xs lg:text-sm text-gray-500 font-medium truncate">
                                    {currentSessionId ? 'Chat with history' : 'Start a new conversation'}
                                </p>
                            </div>
                        </div>
                        <Button onClick={createNewConversation} variant="primary" className="!rounded-lg lg:!rounded-xl flex-shrink-0 !px-3 lg:!px-4 !py-2 !text-sm lg:!text-base">
                            <Plus className="w-3 lg:w-4 h-3 lg:h-4 mr-1 lg:mr-2" />
                            <span className="hidden sm:inline">New Chat</span>
                            <span className="sm:hidden">New</span>
                        </Button>
                    </div>
                </div>{/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-3 lg:space-y-4">
                    {messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center px-4">
                                <div className="w-16 lg:w-24 h-16 lg:h-24 mx-auto mb-4 lg:mb-6 bg-gradient-to-br from-orange-100 to-pink-100 rounded-2xl lg:rounded-3xl flex items-center justify-center">
                                    <span className="text-3xl lg:text-5xl">💬</span>
                                </div>
                                <h3 className="text-xl lg:text-2xl font-extrabold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent mb-2 lg:mb-3">
                                    Welcome to AI Chat! 🤖
                                </h3>
                                <p className="text-sm lg:text-base text-gray-600 font-medium">
                                    Choose an AI type below and start chatting ✨
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>                            {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender === 'User' ? 'justify-end' : 'justify-start'
                                    }`}
                            >
                                <div
                                    className={`max-w-[85%] sm:max-w-xs lg:max-w-md px-3 lg:px-5 py-2.5 lg:py-3 rounded-xl lg:rounded-2xl shadow-md ${message.sender === 'User'
                                        ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white'
                                        : 'bg-white border-2 border-orange-200'
                                        }`}
                                >
                                    <div className="text-xs lg:text-sm leading-relaxed">
                                        {message.sender === 'Bot'
                                            ? formatBotMessage(message.message)
                                            : message.message}
                                    </div>
                                    <p
                                        className={`text-xs mt-1.5 lg:mt-2 ${message.sender === 'User' ? 'text-orange-100' : 'text-gray-500'
                                            }`}
                                    >
                                        {new Date(message.createdAt).toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                        </>
                    )}                    {loading && (
                        <div className="flex justify-start">
                            <div className="bg-gradient-to-r from-orange-100 to-pink-100 border-2 border-orange-200 rounded-xl lg:rounded-2xl px-3 lg:px-5 py-2.5 lg:py-3 shadow-md">
                                <div className="flex space-x-1.5">
                                    <div className="w-2 lg:w-2.5 h-2 lg:h-2.5 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full animate-bounce" />
                                    <div
                                        className="w-2 lg:w-2.5 h-2 lg:h-2.5 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full animate-bounce"
                                        style={{ animationDelay: '0.1s' }}
                                    />
                                    <div
                                        className="w-2 lg:w-2.5 h-2 lg:h-2.5 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full animate-bounce"
                                        style={{ animationDelay: '0.2s' }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input */}
                <div className="p-4 lg:p-6 border-t-2 border-orange-200 bg-white/80 backdrop-blur-sm">                    {/* Type Selector */}
                    <div className="mb-3 lg:mb-4">
                        <label className="block text-xs lg:text-sm font-bold text-gray-700 mb-2">
                            🤖 Choose AI Assistant Type
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {chatBotTypes.map((type) => (<button
                                key={type.value}
                                onClick={() => setSelectedType(type.value)}
                                className={`p-2 lg:p-3 rounded-lg lg:rounded-xl border-2 transition-all text-left ${selectedType === type.value
                                    ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white border-pink-600 shadow-lg'
                                    : 'bg-white border-gray-200 hover:border-orange-300 hover:shadow-md'
                                    }`}
                            >
                                <div className="flex items-center gap-1.5 lg:gap-2">
                                    <span className="text-base lg:text-xl flex-shrink-0">{type.emoji}</span>
                                    <div className="flex-1 min-w-0">
                                        <p
                                            className={`text-xs font-bold truncate ${selectedType === type.value ? 'text-white' : 'text-gray-900'
                                                }`}
                                        >
                                            {type.label}
                                        </p>
                                        <p
                                            className={`text-xs truncate ${selectedType === type.value ? 'text-orange-100' : 'text-gray-500'
                                                }`}
                                        >
                                            {type.description}
                                        </p>
                                    </div>
                                </div>
                            </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                            placeholder="💬 Type your message..."
                            className="flex-1 border-2 border-gray-200 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all font-medium"
                            disabled={loading}
                        />
                        <Button
                            onClick={sendMessage}
                            disabled={loading || !inputMessage.trim()}
                            className="!rounded-xl !px-6"
                        >
                            <Send className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;