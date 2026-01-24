import { io } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Initialize a socket connection with JWT authentication
 */
export const initiateSocket = (token) => {
    const socket = io(SOCKET_URL, {
        auth: {
            token: token
        },
        transports: ['websocket', 'polling'] // Ensure compatibility
    });

    console.log('Connecting to socket...');
    return socket;
};

/**
 * Disconnect the socket
 */
export const disconnectSocket = (socket) => {
    if (socket) socket.disconnect();
};

/**
 * Join a specific conversation room
 */
export const joinConversation = (socket, conversationId) => {
    if (socket && conversationId) {
        socket.emit('join_conversation', conversationId);
    }
};

/**
 * Send a message via socket
 */
export const sendMessage = (socket, { conversationId, text, recipientId }) => {
    if (socket) {
        socket.emit('send_message', { conversationId, text, recipientId });
    }
};

/**
 * Listen for incoming messages
 */
export const subscribeToMessages = (socket, cb) => {
    if (!socket) return;
    const listener = (msg) => {
        cb(null, msg);
    };
    socket.on('receive_message', listener);
    return () => socket.off('receive_message', listener);
};

/**
 * Listen for global notifications (for unread counts etc)
 */
export const subscribeToNotifications = (socket, cb) => {
    if (!socket) return;
    const listener = (data) => {
        cb(null, data);
    };
    socket.on('new_notification', listener);
    return () => socket.off('new_notification', listener);
};

/**
 * Listen for typing events
 */
export const subscribeToTyping = (socket, cb) => {
    if (!socket) return;
    socket.on('user_typing', (data) => {
        cb(null, data);
    });
};
