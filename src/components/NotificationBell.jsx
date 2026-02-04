'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import styles from './NotificationBell.module.css';

export default function NotificationBell() {
    const { data: session, status } = useSession();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'authenticated') {
            fetchNotifications();
            // Poll for new notifications every 30 seconds
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [status]);

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/api/notifications?limit=10');
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.notifications || []);
                setUnreadCount(data.unreadCount || 0);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            const res = await fetch(`/api/notifications/${notificationId}/read`, {
                method: 'PUT',
            });

            if (res.ok) {
                setNotifications(notifications.map(n =>
                    n._id === notificationId ? { ...n, read: true } : n
                ));
                setUnreadCount(Math.max(0, unreadCount - 1));
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const res = await fetch('/api/notifications/read-all', {
                method: 'PUT',
            });

            if (res.ok) {
                setNotifications(notifications.map(n => ({ ...n, read: true })));
                setUnreadCount(0);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const getNotificationIcon = (type) => {
        const icons = {
            message: '💬',
            application: '📝',
            project: '💼',
            review: '⭐',
            invitation: '✉️',
            system: '🔔',
        };
        return icons[type] || '🔔';
    };

    const formatTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);

        if (seconds < 60) return 'À l\'instant';
        if (seconds < 3600) return `Il y a ${Math.floor(seconds / 60)}min`;
        if (seconds < 86400) return `Il y a ${Math.floor(seconds / 3600)}h`;
        if (seconds < 604800) return `Il y a ${Math.floor(seconds / 86400)}j`;
        return new Date(date).toLocaleDateString('fr-FR');
    };

    if (status !== 'authenticated' || !session) return null;

    return (
        <div className={styles.container}>
            <button
                className={styles.bellButton}
                onClick={() => setShowDropdown(!showDropdown)}
            >
                <span className={styles.bellIcon}>🔔</span>
                {unreadCount > 0 && (
                    <span className={styles.badge}>{unreadCount > 9 ? '9+' : unreadCount}</span>
                )}
            </button>

            {showDropdown && (
                <>
                    <div className={styles.overlay} onClick={() => setShowDropdown(false)} />
                    <div className={styles.dropdown}>
                        <div className={styles.header}>
                            <h3>Notifications</h3>
                            {unreadCount > 0 && (
                                <button onClick={markAllAsRead} className={styles.markAllBtn}>
                                    Tout marquer comme lu
                                </button>
                            )}
                        </div>

                        <div className={styles.list}>
                            {loading ? (
                                <div className={styles.loading}>Chargement...</div>
                            ) : notifications.length === 0 ? (
                                <div className={styles.empty}>
                                    Aucune notification
                                </div>
                            ) : (
                                notifications.map((notif) => (
                                    <Link
                                        key={notif._id}
                                        href={notif.link || '#'}
                                        className={`${styles.item} ${!notif.read ? styles.unread : ''}`}
                                        onClick={() => {
                                            if (!notif.read) markAsRead(notif._id);
                                            setShowDropdown(false);
                                        }}
                                    >
                                        <div className={styles.icon}>
                                            {getNotificationIcon(notif.type)}
                                        </div>
                                        <div className={styles.content}>
                                            <div className={styles.title}>{notif.title}</div>
                                            <div className={styles.message}>{notif.message}</div>
                                            <div className={styles.time}>
                                                {formatTimeAgo(notif.createdAt)}
                                            </div>
                                        </div>
                                        {!notif.read && <div className={styles.dot} />}
                                    </Link>
                                ))
                            )}
                        </div>

                        {notifications.length > 0 && (
                            <div className={styles.footer}>
                                <Link href="/notifications" onClick={() => setShowDropdown(false)}>
                                    Voir toutes les notifications
                                </Link>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
