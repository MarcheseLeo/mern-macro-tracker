import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';
import { getNotifications, markNotificationAsRead } from '../services/Notifications';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const { isAuthorized } = useContext(AuthContext);

    const fetchNotifications = async () => {
        if (!isAuthorized) return;
        try {
            const res = await getNotifications()
            setNotifications(res)
        } catch (e) { console.error("Error fetching notifications", e) }
    };

    const markAsRead = async (id) => {
        try {
            await markNotificationAsRead(id)
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n))
        } catch (e) { console.error("Error marking as read", e); }
    }

    const triggerFetch = async () => {
        await fetchNotifications();
    }

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [isAuthorized]);

    return (
        <NotificationContext.Provider value={{ notifications, fetchNotifications, markAsRead, triggerFetch }}>
            {children}
        </NotificationContext.Provider>
    );
};