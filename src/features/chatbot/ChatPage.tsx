import { MessageCircle, Plus, Send } from 'lucide-react';
import React from 'react';
import { Button } from '../../components/Button/Button';
import { useAuthStore } from '../../store';

interface Message {
    id: string;
    sender: 'User' | 'Bot';
    message: string;
    createdAt: string;
}

interface ChatSession {
    id: string;
    title: string;
    createdAt: string;
    messageCount: number;
}

const ChatPage: React.FC = () => {
    const { token } = useAuthStore();
    const [sessions, setSessions] = React.useState<ChatSession[]>([]);
    const [currentSession, setCurrentSession] = React.useState<ChatSession | null>(null);
    const [messages, setMessages] = React.useState<Message[]>([]);
    const [inputMessage, setInputMessage] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        loadChatSessions();
    }, []);

    const loadChatSessions = async () => {
        try {
            const response = await fetch('http://localhost:5019/api/chat/sessions', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setSessions(data);
            }
        } catch (error) {
            console.error('Failed to load sessions:', error);
        }
    };

    const createNewSession = async () => {
        try {
            const response = await fetch('http://localhost:5019/api/chat/sessions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ title: 'New Conversation' }),
            });

            if (response.ok) {
                const newSession = await response.json();
                setSessions([newSession, ...sessions]);
                setCurrentSession(newSession);
                setMessages([]);
            }
        } catch (error) {
            console.error('Failed to create session:', error);
        }
    };

    const loadMessages = async (sessionId: string) => {
        try {
            const response = await fetch(`http://localhost:5019/api/chat/sessions/${sessionId}/messages`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setMessages(data);
            }
        } catch (error) {
            console.error('Failed to load messages:', error);
        }
    };

    const sendMessage = async () => {
        if (!inputMessage.trim() || !currentSession || loading) return;

        setLoading(true);
        const messageText = inputMessage;
        setInputMessage('');

        try {
            const response = await fetch(`http://localhost:5019/api/chat/sessions/${currentSession.id}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ message: messageText }),
            });

            if (response.ok) {
                const data = await response.json();
                setMessages([...messages, data.userMessage, data.botMessage]);
            }
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setLoading(false);
        }
    };

    const selectSession = (session: ChatSession) => {
        setCurrentSession(session);
        loadMessages(session.id);
    }; return (
        <div className="flex h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-peach-50">
            {/* Sidebar */}
            <div className="w-80 bg-white/80 backdrop-blur-sm border-r-2 border-orange-200 shadow-xl">
                <div className="p-4 border-b-2 border-orange-200">
                    <Button onClick={createNewSession} className="w-full" variant="primary">
                        <Plus className="w-4 h-4 mr-2" />
                        ✨ New Conversation
                    </Button>
                </div>

                <div className="overflow-y-auto h-full pb-20">
                    {sessions.map((session) => (
                        <div
                            key={session.id}
                            className={`p-4 border-b border-gray-100 cursor-pointer transition-all ${currentSession?.id === session.id
                                    ? 'bg-gradient-to-r from-orange-100 to-pink-100 border-pink-300 shadow-md'
                                    : 'hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50'
                                }`}
                            onClick={() => selectSession(session)}
                        >
                            <div className="flex items-start space-x-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center flex-shrink-0">
                                    <MessageCircle className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-900 truncate">
                                        {session.title}
                                    </p>
                                    <p className="text-xs text-pink-600 font-medium">
                                        💬 {session.messageCount} messages
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(session.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                {currentSession ? (
                    <>
                        {/* Header */}
                        <div className="p-6 border-b-2 border-orange-200 bg-white/80 backdrop-blur-sm shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center">
                                    <span className="text-2xl">🤖</span>
                                </div>
                                <div>
                                    <h2 className="text-xl font-extrabold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
                                        {currentSession.title}
                                    </h2>
                                    <p className="text-sm text-gray-500 font-medium">AI English Tutor</p>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.sender === 'User' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-xs lg:max-w-md px-5 py-3 rounded-2xl shadow-md ${message.sender === 'User'
                                                ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white'
                                                : 'bg-white border-2 border-orange-200'
                                            }`}
                                    >
                                        <p className="text-sm leading-relaxed">{message.message}</p>
                                        <p className={`text-xs mt-2 ${message.sender === 'User' ? 'text-orange-100' : 'text-gray-500'
                                            }`}>
                                            {new Date(message.createdAt).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-gradient-to-r from-orange-100 to-pink-100 border-2 border-orange-200 rounded-2xl px-5 py-3 shadow-md">
                                        <div className="flex space-x-1.5">
                                            <div className="w-2.5 h-2.5 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full animate-bounce"></div>
                                            <div className="w-2.5 h-2.5 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                            <div className="w-2.5 h-2.5 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <div className="p-6 border-t-2 border-orange-200 bg-white/80 backdrop-blur-sm">
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
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
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-orange-100 to-pink-100 rounded-3xl flex items-center justify-center">
                                <span className="text-5xl">💬</span>
                            </div>
                            <h3 className="text-2xl font-extrabold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent mb-3">
                                Welcome to AI Chat! 🤖
                            </h3>
                            <p className="text-gray-600 font-medium">
                                Select a conversation or start a new one to begin chatting ✨
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatPage;
