"use client";

import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useAuth } from './AuthContext';
import { initiateSocket, disconnectSocket, subscribeToMessages, subscribeToNotifications } from '@/utils/socket';
import api from '@/services/api';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const { user, token } = useAuth();
    const [socket, setSocket] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const activeChatIdRef = useRef(null); // Use ref to track active chat without triggering effects

    const setActiveChatId = (id) => {
        activeChatIdRef.current = id;
    };

    // Initialize Socket and Notifications
    useEffect(() => {
        if (token && user) {
            const newSocket = initiateSocket(token);
            setSocket(newSocket);

            // Fetch initial unread count
            fetchUnreadCount(token);



            // Subscribe to global notifications (Works even if not in chat room)
            subscribeToNotifications(newSocket, (err, data) => {
                if (err) return;

                // If it's a chat message notification
                if (data.type === 'CHAT_MESSAGE') {
                    setUnreadCount(prev => {
                        // If we are currently in that chat, don't increment (ChatPage handles marking as read)
                        if (activeChatIdRef.current === data.conversationId) {
                            return prev;
                        }
                        return prev + 1;
                    });
                }
            });

            return () => {
                if (typeof newSocket?.off === 'function') {
                    // Cleaner way to unsubscribe if possible, but disconnect is fine for full cleanup
                }
                disconnectSocket(newSocket);
            };
        }
    }, [token, user]); // Removed activeChatId from dependency

    // Better approach for activeChatId: Use a Ref or just handle increment logic carefully.
    // Actually, simply: Always increment here. If ChatPage is open, it will receive the message via its own subscription AND call 'markAsRead'.
    // 'markAsRead' can then re-fetch the count or decrement.

    const fetchUnreadCount = async (authToken) => {
        try {
            const res = await api.get('/chat/unread');
            setUnreadCount(res.data.count);
        } catch (error) {
            console.error("Failed to fetch unread count", error);
        }
    };

    const markAsRead = async (conversationId) => {
        if (!conversationId) return;
        try {
            await api.put(`/chat/conversations/${conversationId}/read`);
            // Re-fetch to be accurate (or we could just subtract locally if we knew how many unread were in that chat)
            // Re-fetching is safer.
            fetchUnreadCount(token);
        } catch (error) {
            console.error("Failed to mark as read", error);
        }
    };

    return (
        <NotificationContext.Provider value={{
            unreadCount,
            socket,
            markAsRead,
            setActiveChatId // ChatPage will call this when entering/leaving a chat
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);
