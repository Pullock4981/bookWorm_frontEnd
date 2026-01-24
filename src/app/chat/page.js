"use client";

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import chatService from '@/services/chatService';
import { joinConversation, sendMessage, subscribeToMessages, subscribeToNotifications } from '@/utils/socket';
import { Send, Search, User, MessageSquare, MoreVertical, Paperclip, Smile, Image as ImageIcon } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

const ChatPage = () => {
    const { user } = useAuth();
    const { socket, markAsRead, setActiveChatId } = useNotification();
    const [conversations, setConversations] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    // Socket is now from context
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const messagesEndRef = useRef(null);

    // Fetch Conversations function to be reused
    const fetchConversations = async () => {
        try {
            const data = await chatService.getConversations();
            setConversations(data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch conversations", error);
            setLoading(false);
        }
    };

    // Subscribe to messages using shared socket
    useEffect(() => {
        if (socket && user) {
            const unsubscribe = subscribeToMessages(socket, (err, msg) => {
                if (err) return;

                if (msg.conversationId === activeChat?._id) {
                    setMessages(prev => {
                        // 1. Check if we already have this exact message by ID
                        if (prev.find(m => m._id === msg._id)) return prev;

                        // 2. Check if we have an optimistic/temp message for this
                        // (Same sender, same text, within last few seconds)
                        const optimisticIdx = prev.findIndex(m =>
                            m.isOptimistic &&
                            m.senderId === msg.senderId &&
                            m.text === msg.text
                        );

                        if (optimisticIdx !== -1) {
                            // Replace optimistic message with the real one
                            const newMessages = [...prev];
                            newMessages[optimisticIdx] = msg;
                            return newMessages;
                        }

                        // 3. Otherwise add as new message
                        return [...prev, msg];
                    });
                }
                // Update last message in conversation list
                // Update last message in conversation list
                setConversations(prev => {
                    const existing = prev.find(c => c._id === msg.conversationId);
                    if (existing) {
                        return prev.map(conv => {
                            if (conv._id === msg.conversationId) {
                                const isChatActive = activeChat?._id === msg.conversationId;
                                return {
                                    ...conv,
                                    lastMessage: msg.text,
                                    updatedAt: msg.createdAt,
                                    unreadCount: isChatActive ? 0 : (conv.unreadCount || 0) + 1
                                };
                            }
                            return conv;
                        }).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                    } else {
                        // Re-fetch to get new conversation object
                        fetchConversations();
                        return prev;
                    }
                });
            });

            // Listen for read receipts
            socket.on('messages_read', ({ conversationId }) => {
                // If we are viewing this conversation, update messages to read
                if (activeChat?._id === conversationId) {
                    setMessages(prev => prev.map(m => ({ ...m, isRead: true })));
                }
            });

            return () => {
                if (unsubscribe) unsubscribe();
                socket.off('messages_read');
            };
        }
    }, [user, socket, activeChat?._id]);

    // Handle Global Notifications for Sidebar Updates (for non-active chats)
    useEffect(() => {
        if (socket && user) {
            const unsubscribe = subscribeToNotifications(socket, (err, data) => {
                if (err) return;

                if (data.type === 'CHAT_MESSAGE') {
                    setConversations(prev => {
                        const existing = prev.find(c => c._id === data.conversationId);
                        if (existing) {
                            return prev.map(conv => {
                                if (conv._id === data.conversationId) {
                                    // If this is the active chat, we ignore this notification because 'receive_message' already handled it
                                    // AND we don't want to increment unread count for the active chat.
                                    if (activeChat?._id === data.conversationId) return conv;

                                    return {
                                        ...conv,
                                        lastMessage: data.text,
                                        updatedAt: new Date().toISOString(),
                                        unreadCount: (conv.unreadCount || 0) + 1
                                    };
                                }
                                return conv;
                            }).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                        } else {
                            // New conversation started by someone else, fetch to update list
                            fetchConversations();
                            return prev;
                        }
                    });
                }
            });
            return () => unsubscribe();
        }
    }, [user, socket, activeChat]);

    // Handle Active Chat & Unread Status
    useEffect(() => {
        if (activeChat) {
            setActiveChatId(activeChat._id);
            markAsRead(activeChat._id);
            if (socket) {
                // Notify server via socket that messages are read
                socket.emit('mark_messages_read', { conversationId: activeChat._id });
            }
            // Reset unread count locally for this chat
            setConversations(prev => prev.map(c =>
                c._id === activeChat._id ? { ...c, unreadCount: 0 } : c
            ));
        } else {
            setActiveChatId(null);
        }
        return () => setActiveChatId(null);
    }, [activeChat, socket]);

    // Fetch Conversations on mount
    useEffect(() => {
        if (user) fetchConversations();
    }, [user]);

    // Handle Search
    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (searchQuery.trim().length > 1) {
                setSearching(true);
                try {
                    const results = await chatService.searchUsers(searchQuery);
                    setSearchResults(results);
                } catch (error) {
                    console.error("Search failed", error);
                } finally {
                    setSearching(false);
                }
            } else {
                setSearchResults([]);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    // Fetch Messages when active chat changes
    useEffect(() => {
        const loadMessages = async () => {
            if (activeChat) {
                try {
                    const data = await chatService.getMessages(activeChat._id);
                    setMessages(data);
                    if (socket) joinConversation(socket, activeChat._id);
                    // Single micro-delay to ensure DOM update
                    setTimeout(scrollToBottom, 100);
                } catch (error) {
                    console.error("Failed to fetch messages", error);
                }
            }
        };
        loadMessages();


    }, [activeChat, socket]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });
        }
    };

    const handleStartConversation = async (recipientId) => {
        try {
            const chat = await chatService.startConversation(recipientId);
            setConversations(prev => {
                const exists = prev.find(c => c._id === chat._id);
                if (exists) return prev;
                return [chat, ...prev];
            });
            setActiveChat(chat);
            setSearchQuery('');
            setSearchResults([]);
        } catch (error) {
            console.error("Failed to start conversation", error);
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeChat || !socket) return;

        const recipient = getRecipient(activeChat);

        sendMessage(socket, {
            conversationId: activeChat._id,
            text: newMessage,
            recipientId: recipient._id
        });

        // Optimistically update messages
        const tempMsg = {
            _id: `temp-${Date.now()}`,
            conversationId: activeChat._id,
            senderId: user._id,
            text: newMessage,
            createdAt: new Date().toISOString(),
            isOptimistic: true
        };
        setMessages(prev => [...prev, tempMsg]);
        setNewMessage('');
    };

    const getRecipient = (chat) => {
        if (!user) return { name: 'Unknown' };
        if (!chat || !chat.members) return { name: 'Unknown' };
        return chat.members.find(m => m._id !== user._id) || { name: 'Unknown' };
    };

    const handleBackToConversations = () => {
        setActiveChat(null);
    };

    return (
        <ProtectedRoute>
            <div className="h-[100dvh] overflow-hidden bg-base-200 flex flex-col relative font-sans">
                <Navbar />

                {/* Main Layout Container */}
                <main className="flex-grow flex flex-col overflow-hidden">

                    {/* Chat Card */}
                    <div className="w-full h-full bg-base-100 flex overflow-hidden relative">

                        {/* Sidebar: Conversations List */}
                        {/* Visible on Mobile if NO active chat, OR always visible on Desktop */}
                        <div className={`
                            w-full md:w-80 lg:w-96 flex flex-col bg-base-100/50 backdrop-blur-md border-r border-base-content/5 z-20
                            ${activeChat ? 'hidden md:flex' : 'flex'}
                        `}>
                            <div className="p-5 border-b border-base-content/5 bg-base-100/80 backdrop-blur-xl sticky top-0 z-10">
                                <div className="flex items-center justify-between mb-5">
                                    <h1 className="text-2xl font-black text-base-content tracking-tighter">Messages</h1>
                                    <div className="p-2 bg-primary/10 text-primary rounded-xl">
                                        <MessageSquare size={20} />
                                    </div>
                                </div>
                                <div className="relative group">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40 group-focus-within:text-primary transition-colors" size={18} />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search people..."
                                        className="input input-sm h-11 w-full pl-11 bg-base-200/50 border-transparent focus:border-primary/20 focus:bg-base-100 rounded-xl transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex-grow overflow-y-auto p-2 space-y-1 custom-scrollbar">
                                {searchQuery.trim().length > 1 ? (
                                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                        <p className="px-4 py-2 text-[10px] font-black uppercase tracking-widest opacity-40">Search Results</p>
                                        {searching ? (
                                            <div className="flex justify-center py-4">
                                                <span className="loading loading-spinner loading-sm text-primary"></span>
                                            </div>
                                        ) : searchResults.length > 0 ? (
                                            searchResults.map((u) => (
                                                <div
                                                    key={u._id}
                                                    onClick={() => handleStartConversation(u._id)}
                                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-base-200/50 cursor-pointer transition-all active:scale-95"
                                                >
                                                    <img
                                                        src={u.photo || `https://ui-avatars.com/api/?name=${u.name}&background=4B2E2B&color=fff`}
                                                        className="w-10 h-10 rounded-full border border-base-content/10 object-cover"
                                                    />
                                                    <div className="flex-grow min-w-0">
                                                        <h4 className="text-sm font-bold text-base-content truncate">{u.name}</h4>
                                                        <p className="text-[10px] text-base-content/50 truncate">{u.email}</p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="px-4 text-xs font-bold opacity-30 italic">No users found</p>
                                        )}
                                        <div className="divider opacity-5 my-1"></div>
                                    </div>
                                ) : null}

                                {loading ? (
                                    [1, 2, 3, 4].map(i => (
                                        <div key={i} className="animate-pulse flex items-center gap-3 p-3 rounded-xl">
                                            <div className="w-12 h-12 bg-base-200 rounded-full"></div>
                                            <div className="flex-grow space-y-2">
                                                <div className="h-4 bg-base-200 rounded w-1/3"></div>
                                                <div className="h-3 bg-base-200 rounded w-1/2"></div>
                                            </div>
                                        </div>
                                    ))
                                ) : conversations.length > 0 ? (
                                    conversations.map((chat) => {
                                        const recipient = getRecipient(chat);
                                        const isActive = activeChat?._id === chat._id;
                                        return (
                                            <motion.div
                                                key={chat._id}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setActiveChat(chat)}
                                                className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all border ${isActive
                                                    ? 'bg-primary/10 border-primary/20 shadow-sm'
                                                    : 'border-transparent hover:bg-base-200/50 border-b-base-content/5'
                                                    }`}
                                            >
                                                <div className="relative">
                                                    <img
                                                        src={recipient.photo || `https://ui-avatars.com/api/?name=${recipient.name}&background=4B2E2B&color=fff`}
                                                        alt={recipient.name}
                                                        className={`w-12 h-12 rounded-full border-2 object-cover shadow-sm ${isActive ? 'border-primary/50' : 'border-base-100'}`}
                                                    />
                                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-success border-2 border-base-100 rounded-full"></div>
                                                </div>
                                                <div className="flex-grow min-w-0">
                                                    <div className="flex justify-between items-center mb-0.5">
                                                        <h3 className={`font-bold text-sm truncate ${isActive ? 'text-primary' : 'text-base-content'}`}>
                                                            {recipient.name}
                                                        </h3>
                                                        <span className={`text-[10px] font-bold ${isActive ? 'text-primary/70' : 'opacity-50'}`}>
                                                            {format(new Date(chat.updatedAt), 'HH:mm')}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <p className={`text-xs truncate max-w-[140px] ${isActive ? 'text-base-content/80' : chat.unreadCount > 0 ? 'text-base-content font-bold' : 'text-base-content/60'}`}>
                                                            {chat.lastMessage || "Start a conversation"}
                                                        </p>
                                                        {chat.unreadCount > 0 && !isActive && (
                                                            <div className="badge badge-primary badge-sm border-none shadow-sm h-5 min-w-[20px] px-1.5 flex items-center justify-center">
                                                                {chat.unreadCount}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-20 opacity-40">
                                        <div className="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <MessageSquare size={24} />
                                        </div>
                                        <p className="font-bold text-sm">No conversations yet</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Main Chat Window */}
                        {/* Visible on Mobile ONLY if active chat, OR always visible on Desktop */}
                        <div className={`
                            flex-grow flex-col relative bg-base-100/30 backdrop-blur-sm h-full
                            ${activeChat ? 'flex z-20 bg-base-100 md:bg-transparent md:z-auto' : 'hidden md:flex'}
                        `}>
                            {activeChat ? (
                                <>
                                    {/* Chat Header */}
                                    <div className="p-3 md:p-4 border-b border-base-content/5 flex items-center justify-between bg-base-100/80 backdrop-blur-md sticky top-0 z-20 shadow-sm">
                                        <div className="flex items-center gap-3">
                                            {/* Mobile Back Button */}
                                            <button
                                                onClick={handleBackToConversations}
                                                className="md:hidden btn btn-ghost btn-circle btn-sm -ml-2"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                                            </button>

                                            <img
                                                src={getRecipient(activeChat).photo || `https://ui-avatars.com/api/?name=${getRecipient(activeChat).name}&background=4B2E2B&color=fff`}
                                                className="w-10 h-10 rounded-full object-cover border border-base-content/10"
                                            />
                                            <div>
                                                <h2 className="font-bold text-base text-base-content leading-tight">
                                                    {getRecipient(activeChat).name}
                                                </h2>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="w-2 h-2 rounded-full bg-success"></span>
                                                    <span className="text-[10px] font-medium opacity-60">Online</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            <button className="btn btn-ghost btn-circle btn-sm text-base-content/40 hover:text-primary">
                                                <Search size={18} />
                                            </button>
                                            <button className="btn btn-ghost btn-circle btn-sm text-base-content/40 hover:text-primary">
                                                <MoreVertical size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Messages Feed */}
                                    <div
                                        className="flex-grow overflow-y-auto min-h-0 p-4 space-y-4 scroll-smooth bg-[url('https://www.transparenttextures.com/patterns/subtle-white-feathers.png')] bg-fixed"
                                        style={{ backgroundColor: 'rgba(var(--b1) / 0.5)' }}
                                    >
                                        <AnimatePresence initial={false}>
                                            {messages.map((msg, idx) => {
                                                const isMine = msg.senderId === user._id;
                                                // Check if previous message was from same sender to group them visually (optional enhancement can be added here)
                                                return (
                                                    <motion.div
                                                        key={msg._id || idx}
                                                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                                                    >
                                                        <div className={`max-w-[75%] md:max-w-[65%] group relative ${isMine ? 'items-end' : 'items-start'} flex flex-col`}>
                                                            <div className={`px-4 py-2.5 rounded-2xl text-[15px] leading-snug shadow-sm transition-all relative z-10 ${isMine
                                                                ? 'bg-primary text-primary-content rounded-tr-sm'
                                                                : 'bg-base-100 border border-base-content/5 text-base-content rounded-tl-sm'
                                                                }`}>
                                                                {msg.text}
                                                            </div>
                                                            <span className={`text-[10px] font-bold opacity-40 mt-1 px-1 flex items-center gap-1 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                                                                {format(new Date(msg.createdAt), 'HH:mm')}
                                                                {isMine && (
                                                                    <span className={msg.isRead ? "text-primary font-black" : ""}>
                                                                        {msg.isRead ? "Seen" : "✓"}
                                                                    </span>
                                                                )}
                                                            </span>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </AnimatePresence>
                                        <div ref={messagesEndRef} />
                                    </div>

                                    {/* Message Input */}
                                    <div className="p-3 md:p-4 bg-base-100/80 backdrop-blur-md border-t border-base-content/5 sticky bottom-0 z-20">
                                        <form onSubmit={handleSendMessage} className="flex items-end gap-2 w-full">
                                            <div className="flex-grow bg-primary/5 rounded-[1.5rem] flex items-center border border-primary/20 focus-within:border-primary/60 focus-within:bg-primary/10 focus-within:shadow-md transition-all duration-300">
                                                <button type="button" className="btn btn-ghost btn-circle btn-sm text-primary/70 hover:text-primary m-1">
                                                    <Smile size={20} />
                                                </button>
                                                <input
                                                    type="text"
                                                    value={newMessage}
                                                    onChange={(e) => setNewMessage(e.target.value)}
                                                    placeholder="Type a message..."
                                                    className="input border-none bg-transparent focus:outline-none flex-grow h-12 px-2 text-sm md:text-base placeholder:text-base-content/40 text-base-content"
                                                />
                                                <button type="button" className="btn btn-ghost btn-circle btn-sm text-primary/70 hover:text-primary m-1">
                                                    <Paperclip size={18} />
                                                </button>
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={!newMessage.trim()}
                                                className="btn btn-circle h-12 w-12 border-none shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all text-white shrink-0 bg-gradient-to-tr from-primary to-accent hover:shadow-xl"
                                            >
                                                <Send size={20} className={newMessage.trim() ? "ml-0.5" : ""} />
                                            </button>
                                        </form>
                                    </div>
                                </>
                            ) : (
                                <div className="hidden md:flex flex-grow flex-col items-center justify-center text-center p-10 opacity-30 select-none">
                                    <div className="w-32 h-32 bg-base-200 rounded-full flex items-center justify-center mb-6 animate-pulse">
                                        <MessageSquare size={64} className="opacity-50" />
                                    </div>
                                    <h2 className="text-2xl font-black text-base-content tracking-tighter mb-2">BookWorm Chat</h2>
                                    <p className="max-w-xs text-sm font-medium">Select a conversation to start messaging instantly.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
};

export default ChatPage;
