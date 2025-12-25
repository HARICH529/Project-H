import { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useUser } from './UserContext';
import { fetchNotifications, markAllAsRead as apiMarkAllAsRead, markAsRead as apiMarkAsRead } from '../api/notifications';

const NotificationContext = createContext({
    notifications: [],
    unreadCount: 0,
    markAsRead: () => { },
    markAllAsRead: () => { },
    loading: true
});

export const useNotifications = () => useContext(NotificationContext);

const SOCKET_SERVER_URL = "http://localhost:5000";

export const NotificationProvider = ({ children }) => {
    const { user } = useUser();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState(null);

    // Initial Fetch
    useEffect(() => {
        if (!user) {
            setNotifications([]);
            setLoading(false);
            return;
        }

        const loadNotifications = async () => {
            try {
                const data = await fetchNotifications();
                setNotifications(data);
            } catch (err) {
                console.error("Failed to fetch notifications:", err);
            } finally {
                setLoading(false);
            }
        };

        loadNotifications();
    }, [user]);

    // Socket Connection
    useEffect(() => {
        if (!user) return;

        const newSocket = io(SOCKET_SERVER_URL);

        newSocket.on('connect', () => {
            console.log("Connected to notification socket");
            newSocket.emit('join-user-room', user._id);
        });

        newSocket.on('new-notification', (notification) => {
            console.log("New notification received:", notification);
            // Add to top of list
            setNotifications(prev => [notification, ...prev]);

            // Optional: Play sound or show toast
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };

    }, [user]);

    const markAsRead = async (id) => {
        try {
            await apiMarkAsRead(id);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (err) {
            console.error("Failed to mark as read", err);
        }
    };

    const markAllAsRead = async () => {
        try {
            await apiMarkAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (err) {
            console.error("Failed to mark all as read", err);
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, loading }}>
            {children}
        </NotificationContext.Provider>
    );
};
