"use client";

import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useAuth } from './AuthContext';
import { initiateSocket, disconnectSocket, subscribeToMessages } from '@/utils/socket';
import axios from 'axios';

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

            // Subscribe to new messages
            subscribeToMessages(newSocket, (err, msg) => {
                if (err) return;

                // If message is NOT from me
                if (msg.senderId !== user._id) {
                    setUnreadCount(prev => {
                        // Check if we are currently viewing this chat using ref
                        if (activeChatIdRef.current === msg.conversationId) {
                            return prev; // Already looking at it, don't increment
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
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/unread`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            setUnreadCount(res.data.count);
        } catch (error) {
            console.error("Failed to fetch unread count", error);
        }
    };

    const markAsRead = async (conversationId) => {
        if (!conversationId) return;
        try {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/conversations/${conversationId}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
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
