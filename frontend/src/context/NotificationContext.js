import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [toast, setToast] = useState(null); // { message, severity }

  const addNotification = useCallback((notif) => {
    setNotifications((prev) => [notif, ...prev]);
    setUnread((count) => count + 1);
    setToast({ message: notif.message, severity: notif.severity || 'info' });
  }, []);

  const markAllRead = useCallback(() => setUnread(0), []);
  const closeToast = useCallback(() => setToast(null), []);

  return (
    <NotificationContext.Provider value={{ notifications, unread, addNotification, markAllRead, toast, closeToast }}>
      {children}
    </NotificationContext.Provider>
  );
}; 