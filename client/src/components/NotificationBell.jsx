import React, { useState, useEffect } from 'react';
import * as API_SERVICE from '../api';
import { useAuth } from '../context/AuthContext';

const NotificationBell = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const unreadCount = notifications.filter(n => !n.isRead).length;

    useEffect(() => {
        if (user) {
            fetchNotifications();
            // Optional: Poll or use Socket.io for real-time updates
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const fetchNotifications = async () => {
        try {
            const { data } = await API_SERVICE.getNotifications();
            setNotifications(data.data);
        } catch (err) {
            console.error('Error fetching notifications:', err);
        }
    };

    const markAsRead = async (id) => {
        try {
            await API_SERVICE.markNotificationAsRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (err) {
            console.error(err);
        }
    };

    if (!user) return null;

    return (
        <div className="relative">
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="size-12 flex items-center justify-center rounded-2xl glass-card text-text-primary hover:text-primary transition-all relative"
            >
                <span className="material-symbols-outlined text-2xl">notifications</span>
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 size-4 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-background">
                        {unreadCount}
                    </span>
                )}
            </button>

            {showDropdown && (
                <>
                    <div
                        className="fixed inset-0 z-40 bg-transparent"
                        onClick={() => setShowDropdown(false)}
                    />
                    <div className="absolute right-0 mt-4 w-80 glass-card bg-surface/95 backdrop-blur-3xl border border-primary/20 rounded-3xl shadow-2xl z-50 overflow-hidden transform origin-top-right animate-in fade-in zoom-in duration-200">
                        <div className="p-5 border-b border-border flex justify-between items-center">
                            <h3 className="text-sm font-black uppercase tracking-widest text-text-primary">Alerts</h3>
                            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase">{unreadCount} New</span>
                        </div>

                        <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                            {notifications.length > 0 ? (
                                notifications.map((n) => (
                                    <div
                                        key={n.id}
                                        className={`p-4 border-b border-border/50 hover:bg-primary/5 transition-colors cursor-pointer ${!n.isRead ? 'bg-primary/[0.03]' : 'opacity-70'}`}
                                        onClick={() => {
                                            if (!n.isRead) markAsRead(n.id);
                                            // Handle navigation if needed
                                        }}
                                    >
                                        <div className="flex gap-3">
                                            <div className={`size-8 rounded-xl flex items-center justify-center shrink-0 ${!n.isRead ? 'bg-primary/20 text-primary' : 'bg-surface text-text-muted'}`}>
                                                <span className="material-symbols-outlined text-sm">{n.type === 'info' ? 'info' : 'warning'}</span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <p className="text-xs font-medium text-text-primary leading-snug">{n.message}</p>
                                                <span className="text-[9px] text-text-muted uppercase tracking-[0.05em]">{new Date(n.createdAt).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-10 text-center flex flex-col items-center gap-3">
                                    <span className="material-symbols-outlined text-4xl text-text-muted/30">notifications_off</span>
                                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">No notifications found.</p>
                                </div>
                            )}
                        </div>

                        <div className="p-3 bg-primary/5">
                            <button className="w-full py-2 text-[10px] font-black uppercase tracking-widest text-primary hover:text-text-primary transition-colors">
                                View History
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default NotificationBell;
