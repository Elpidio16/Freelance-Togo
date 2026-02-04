'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './messages.module.css';

export default function MessagesPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [conversations, setConversations] = useState([]);
    const [selectedConv, setSelectedConv] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/login');
        } else if (status === 'authenticated') {
            fetchConversations();
        }
    }, [status]);

    const fetchConversations = async () => {
        try {
            const res = await fetch('/api/conversations');
            if (res.ok) {
                const data = await res.json();
                setConversations(data.conversations || []);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (conversationId) => {
        try {
            const res = await fetch(`/api/conversations/${conversationId}/messages`);
            if (res.ok) {
                const data = await res.json();
                setMessages(data.messages || []);

                // Update conversation as read
                setConversations(conversations.map(conv =>
                    conv._id === conversationId ? { ...conv, unreadCount: 0 } : conv
                ));
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSelectConversation = (conv) => {
        setSelectedConv(conv);
        fetchMessages(conv._id);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConv) return;

        setSending(true);
        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    conversationId: selectedConv._id,
                    receiverId: selectedConv.otherUser.id,
                    content: newMessage,
                }),
            });

            if (res.ok) {
                const data = await res.json();
                setMessages([...messages, data.message]);
                setNewMessage('');

                // Update last message in conversation list
                setConversations(conversations.map(conv =>
                    conv._id === selectedConv._id
                        ? { ...conv, lastMessage: newMessage, lastMessageAt: new Date() }
                        : conv
                ));
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setSending(false);
        }
    };

    if (status === 'loading' || loading) {
        return <div className={styles.loading}>Chargement...</div>;
    }

    if (!session) return null;

    const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

    return (
        <div className={styles.page}>
            <nav className={styles.nav}>
                <div className="container">
                    <Link href="/" className={styles.logo}>
                        <span className={styles.logoText}>Freelance</span>
                        <span className={styles.logoAccent}>Togo</span>
                    </Link>
                </div>
            </nav>

            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Messages {totalUnread > 0 && <span className={styles.badge}>{totalUnread}</span>}</h1>
                    <Link href="/dashboard" className="btn btn-outline">
                        Retour au dashboard
                    </Link>
                </div>

                <div className={styles.messagesLayout}>
                    {/* Conversations List */}
                    <div className={styles.sidebar}>
                        {conversations.length === 0 ? (
                            <div className={styles.empty}>
                                <p>Aucune conversation</p>
                            </div>
                        ) : (
                            conversations.map((conv) => (
                                <div
                                    key={conv._id}
                                    className={`${styles.conversationItem} ${selectedConv?._id === conv._id ? styles.active : ''}`}
                                    onClick={() => handleSelectConversation(conv)}
                                >
                                    <div className={styles.avatar}>
                                        {conv.otherUser.name.charAt(0)}
                                    </div>
                                    <div className={styles.convInfo}>
                                        <div className={styles.convHeader}>
                                            <h4>{conv.otherUser.name}</h4>
                                            <span className={styles.timestamp}>
                                                {new Date(conv.lastMessageAt).toLocaleDateString('fr-FR', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                })}
                                            </span>
                                        </div>
                                        <p className={styles.lastMessage}>{conv.lastMessage || 'Aucun message'}</p>
                                        {conv.project && (
                                            <span className={styles.projectTag}>📁 {conv.project.title}</span>
                                        )}
                                    </div>
                                    {conv.unreadCount > 0 && (
                                        <span className={styles.unreadBadge}>{conv.unreadCount}</span>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    {/* Messages Area */}
                    <div className={styles.chatArea}>
                        {!selectedConv ? (
                            <div className={styles.noSelection}>
                                <div className={styles.noSelectionIcon}>💬</div>
                                <p>Sélectionnez une conversation pour commencer</p>
                            </div>
                        ) : (
                            <>
                                <div className={styles.chatHeader}>
                                    <div className={styles.avatar}>
                                        {selectedConv.otherUser.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3>{selectedConv.otherUser.name}</h3>
                                        <p className={styles.role}>
                                            {selectedConv.otherUser.role === 'freelance' ? 'Freelance' : 'Entreprise'}
                                        </p>
                                    </div>
                                </div>

                                <div className={styles.messagesContainer}>
                                    {messages.length === 0 ? (
                                        <div className={styles.noMessages}>
                                            <p>Aucun message. Commencez la conversation !</p>
                                        </div>
                                    ) : (
                                        messages.map((msg) => (
                                            <div
                                                key={msg._id}
                                                className={`${styles.message} ${msg.isMine ? styles.mine : styles.theirs}`}
                                            >
                                                <div className={styles.messageContent}>
                                                    <p>{msg.content}</p>
                                                    <span className={styles.messageTime}>
                                                        {new Date(msg.createdAt).toLocaleTimeString('fr-FR', {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <form onSubmit={handleSendMessage} className={styles.messageForm}>
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Tapez votre message..."
                                        disabled={sending}
                                    />
                                    <button type="submit" className="btn btn-primary" disabled={sending || !newMessage.trim()}>
                                        {sending ? 'Envoi...' : 'Envoyer'}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
