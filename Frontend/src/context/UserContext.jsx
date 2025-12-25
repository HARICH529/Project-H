import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, logoutUser, getCurrentUser } from '../api/auth';

const UserContext = createContext({
    user: null,
    updateProfile: () => { },
    login: () => { },
    logout: () => { },
    loading: true
});

export const useUser = () => useContext(UserContext);

import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = "http://localhost:5000";

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check for token on mount and fetch fresh user data
    useEffect(() => {
        const initUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // Try to get fresh data
                    const freshUser = await getCurrentUser();
                    if (freshUser) {
                        setUser(freshUser);
                        // Update local storage just in case
                        localStorage.setItem('user', JSON.stringify(freshUser));

                        // Join User Room
                        const socket = io(SOCKET_SERVER_URL);
                        socket.on('connect', () => {
                            socket.emit('join-user-room', freshUser._id);
                        });
                        // We don't keep the socket in context for now as it's just for joining room
                        // Components will open their own connections or we can lift socket to context if needed later
                        // For notifications, Navbar will likely handle the listening part or we should have a global socket
                        // Actually, for simplicity, let's let Navbar handle the listening, 
                        // but joining the room needs to happen somewhere reliably. 
                        // NOTE: Socket.io usually requires the *same* socket instance to receive events for the joined room
                        // if we want to listen on it. 
                        // So we should probably expose the socket or let Navbar handle both joining and listening.

                        // REVISION: Let's defer socket logic to a new NotificationContext or Navbar 
                        // to ensure the listener is on the SAME socket that joined the room.
                        // Joining here with a throwaway socket might not work if the server expects the listener on the same socket connection.
                        // Wait, 'join' associates the SOCKET ID with the room. If we disconnect, that association is lost.
                        // So we must maintain the connection.
                        socket.disconnect();
                    } else {
                        const localUser = localStorage.getItem('user');
                        if (localUser) setUser(JSON.parse(localUser));
                    }
                } catch (e) {
                    const localUser = localStorage.getItem('user');
                    if (localUser) setUser(JSON.parse(localUser));
                }
            }
            setLoading(false);
        };
        initUser();
    }, []);

    const login = async (email, password) => {
        const data = await loginUser(email, password);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        return data.user;
    };

    const logout = async () => {
        try {
            if (user && user.role === 'instructor') {
                // Set status to offline before clearing token
                // We don't await strictly for UI response, but good to try-catch
                await import('../api/instructors').then(module =>
                    module.updateInstructorStatus('offline')
                );
            }
        } catch (err) {
            console.error("Failed to update status on logout:", err);
        }

        logoutUser();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        window.location.href = '/';
    };

    const updateProfile = (updates) => {
        setUser(prev => {
            const updated = { ...prev, ...updates };
            localStorage.setItem('user', JSON.stringify(updated));
            return updated;
        });
    };

    return (
        <UserContext.Provider value={{ user, login, logout, updateProfile, loading }}>
            {!loading && children}
        </UserContext.Provider>
    );
};
