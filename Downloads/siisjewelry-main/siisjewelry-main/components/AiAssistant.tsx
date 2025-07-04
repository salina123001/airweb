
import React, { useState, useRef, useEffect, FormEvent } from 'react';
import type { ChatMessage } from '../types';
import { startChat, sendMessage } from '../services/geminiService';
import type { Chat } from '@google/genai';

const AiAssistant: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: 'initial', text: '你好！我是您的水晶AI顧問。有什麼可以幫助您的嗎？您可以問我關於水晶的任何問題，比如不同水晶的功效、如何選擇適合自己的水晶，或者水晶的保養方法等。', sender: 'ai' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!chatRef.current) {
            chatRef.current = startChat();
        }
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleSendMessage = async (e: FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { id: Date.now().toString(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const aiMessageId = (Date.now() + 1).toString();
        // Add a placeholder for AI response
        setMessages(prev => [...prev, { id: aiMessageId, text: '', sender: 'ai' }]);
        
        try {
            if (!chatRef.current) {
                 throw new Error("Chat not initialized");
            }
            const stream = await sendMessage(chatRef.current, input);
            let fullResponse = '';
            for await (const chunk of stream) {
                fullResponse += chunk.text;
                setMessages(prev => prev.map(msg => 
                    msg.id === aiMessageId ? { ...msg, text: fullResponse } : msg
                ));
            }
        } catch (error) {
            console.error("Error sending message to AI:", error);
            setMessages(prev => prev.map(msg => 
                msg.id === aiMessageId ? { ...msg, text: '抱歉，我現在遇到了一些問題，請稍後再試。' } : msg
            ));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section id="ai-chat" className="py-16 bg-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-12">
                    <h2 className="text-[clamp(1.8rem,4vw,2.5rem)] font-bold mb-4">AI 水晶顧問</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        有任何關於水晶的問題？我們的AI顧問可以幫助您了解不同水晶的特性、功效和保養方法，為您提供個性化的建議。
                    </p>
                </div>
                
                <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col">
                    <div className="bg-primary text-white p-4 flex items-center">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                            <i className="fa-solid fa-robot text-white"></i>
                        </div>
                        <div>
                            <h3 className="font-medium">水晶AI顧問</h3>
                            <p className="text-xs text-white/70">在線 - 隨時為您服務</p>
                        </div>
                    </div>
                    
                    <div id="chat-messages" className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50 flex-grow">
                        {messages.map((msg, index) => (
                            <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                                {msg.sender === 'ai' && (
                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-1 flex-shrink-0">
                                        <i className="fa-solid fa-robot text-primary"></i>
                                    </div>
                                )}
                                <div className={`rounded-lg p-3 shadow-sm max-w-[85%] whitespace-pre-wrap ${msg.sender === 'user' ? 'bg-primary text-white' : 'bg-white text-gray-800'}`}>
                                    <p>{msg.text}</p>
                                </div>
                            </div>
                        ))}
                         {isLoading && messages[messages.length - 1]?.sender === 'ai' && messages[messages.length - 1]?.text === '' && (
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-1 flex-shrink-0">
                                    <i className="fa-solid fa-robot text-primary"></i>
                                </div>
                                <div className="bg-white rounded-lg p-3 shadow-sm">
                                    <div className="flex items-center space-x-1">
                                      <span className="text-gray-500">正在輸入</span>
                                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    
                    <div className="p-4 border-t border-gray-200 bg-white">
                        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={isLoading ? 'AI正在思考中...' : '在這裡輸入您的問題...'}
                                disabled={isLoading}
                                className="w-full px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                            />
                            <button type="submit" disabled={isLoading} className="bg-primary text-white w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed transition-colors">
                                <i className="fa-solid fa-paper-plane"></i>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AiAssistant;
