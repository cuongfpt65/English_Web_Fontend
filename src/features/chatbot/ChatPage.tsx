import { Plus, Send } from 'lucide-react';
import React from 'react';
import { Button } from '../../components/Button/Button';
import { useAuthStore } from '../../store';

interface Message {
    id: string;
    sender: 'User' | 'Bot';
    message: string;
    createdAt: string;
}

type ChatBotType = 'smalltalk' | 'error' | 'grammar_fix' | 'answer_suggest' | 'structure_review' | 'essay';

const ChatPage: React.FC = () => {
    const { token } = useAuthStore();
    const [messages, setMessages] = React.useState<Message[]>([]);
    const [inputMessage, setInputMessage] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [selectedType, setSelectedType] = React.useState<ChatBotType>('smalltalk');

    const chatBotTypes: Array<{ value: ChatBotType; label: string; emoji: string; description: string }> = [
        { value: 'smalltalk', label: 'Small Talk', emoji: '💬', description: 'Casual conversation' },
        { value: 'error', label: 'Error Check', emoji: '🔍', description: 'Find errors in text' },
        { value: 'grammar_fix', label: 'Grammar Fix', emoji: '✏️', description: 'Fix grammar mistakes' },
        { value: 'answer_suggest', label: 'Answer Suggest', emoji: '💡', description: 'Get answer suggestions' },
        { value: 'structure_review', label: 'Structure Review', emoji: '📝', description: 'Review text structure' },
        { value: 'essay', label: 'Essay Help', emoji: '📄', description: 'Essay writing assistance' },
    ];

    const createNewConversation = () => {
        setMessages([]);
        setInputMessage('');
    };

    const sendMessage = async () => {
        if (!inputMessage.trim() || loading) return;

        setLoading(true);
        const messageText = inputMessage;
        setInputMessage('');

        const userMessage: Message = {
            id: Date.now().toString(),
            sender: 'User',
            message: messageText,
            createdAt: new Date().toISOString(),
        };

        // dùng callback để tránh lỗi state cũ
        setMessages((prev) => [...prev, userMessage]);

        try {
            const response = await fetch('https://apisoctrang.azurewebsites.net/api/ChatBot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    type: selectedType,
                    message: messageText,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const botMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    sender: 'Bot',
                    message: data.answer || 'No response from server',
                    createdAt: new Date().toISOString(),
                };
                setMessages((prev) => [...prev, botMessage]);
            } else {
                const errorMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    sender: 'Bot',
                    message: 'Sorry, there was an error processing your request.',
                    createdAt: new Date().toISOString(),
                };
                setMessages((prev) => [...prev, errorMessage]);
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
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
    };    return (
        <div className="flex h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-peach-50">
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
                                <p className="text-xs lg:text-sm text-gray-500 font-medium truncate">Your personal language assistant</p>
                            </div>
                        </div>
                        <Button onClick={createNewConversation} variant="primary" className="!rounded-lg lg:!rounded-xl flex-shrink-0 !px-3 lg:!px-4 !py-2 !text-sm lg:!text-base">
                            <Plus className="w-3 lg:w-4 h-3 lg:h-4 mr-1 lg:mr-2" />
                            <span className="hidden sm:inline">New Chat</span>
                            <span className="sm:hidden">New</span>
                        </Button>
                    </div>
                </div>                {/* Messages */}
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
                            {chatBotTypes.map((type) => (                                <button
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