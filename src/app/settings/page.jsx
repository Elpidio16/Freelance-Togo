'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import styles from './settings.module.css';

export default function SettingsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState('notifications');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Notification preferences
    const [preferences, setPreferences] = useState({
        emailNotifications: true,
        emailPreferences: {
            messages: true,
            applications: true,
            projects: true,
            reviews: true,
            marketing: false,
        },
        inAppNotifications: true,
        emailDigest: 'instant',
    });

    // Password change
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/login');
        } else if (status === 'authenticated') {
            loadPreferences();
        }
    }, [status, router]);

    const loadPreferences = async () => {
        try {
            const res = await fetch('/api/notifications/preferences');
            if (res.ok) {
                const data = await res.json();
                setPreferences(data.preferences);
            }
        } catch (error) {
            console.error('Error loading preferences:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePreferenceChange = (field, value) => {
        setPreferences(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleEmailPreferenceChange = (field, value) => {
        setPreferences(prev => ({
            ...prev,
            emailPreferences: {
                ...prev.emailPreferences,
                [field]: value,
            },
        }));
    };

    const savePreferences = async () => {
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await fetch('/api/notifications/preferences', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(preferences),
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Préférences enregistrées avec succès !' });
            } else {
                setMessage({ type: 'error', text: 'Erreur lors de l\'enregistrement' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Erreur de connexion' });
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
            setSaving(false);
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 6 caractères' });
            setSaving(false);
            return;
        }

        try {
            const res = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: 'Mot de passe modifié avec succès !' });
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                setMessage({ type: 'error', text: data.error || 'Erreur lors du changement' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Erreur de connexion' });
        } finally {
            setSaving(false);
        }
    };

    if (status === 'loading' || loading) {
        return <LoadingSpinner fullPage />;
    }

    return (
        <div className={styles.page}>
            <div className="container">
                <div className={styles.header}>
                    <h1>Paramètres</h1>
                    <p>Gérez vos préférences et votre compte</p>
                </div>

                {/* Tabs */}
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === 'notifications' ? styles.active : ''}`}
                        onClick={() => setActiveTab('notifications')}
                    >
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" fill="currentColor" />
                        </svg>
                        Notifications
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'security' ? styles.active : ''}`}
                        onClick={() => setActiveTab('security')}
                    >
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" fill="currentColor" />
                        </svg>
                        Sécurité
                    </button>
                </div>

                {/* Message */}
                {message.text && (
                    <div className={`${styles.message} ${styles[message.type]}`}>
                        {message.text}
                    </div>
                )}

                {/* Content */}
                <div className={styles.content}>
                    {activeTab === 'notifications' && (
                        <div className={styles.section}>
                            <h2>Préférences de notifications</h2>
                            <p className={styles.sectionDesc}>
                                Choisissez comment vous souhaitez être notifié des activités sur votre compte
                            </p>

                            {/* Email Notifications Toggle */}
                            <div className={styles.settingGroup}>
                                <div className={styles.settingItem}>
                                    <div className={styles.settingInfo}>
                                        <h3>Notifications par email</h3>
                                        <p>Recevoir des emails pour les activités importantes</p>
                                    </div>
                                    <label className={styles.switch}>
                                        <input
                                            type="checkbox"
                                            checked={preferences.emailNotifications}
                                            onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
                                        />
                                        <span className={styles.slider}></span>
                                    </label>
                                </div>
                            </div>

                            {/* Email Preferences */}
                            {preferences.emailNotifications && (
                                <div className={styles.settingGroup}>
                                    <h3 className={styles.groupTitle}>Types de notifications email</h3>

                                    <div className={styles.settingItem}>
                                        <div className={styles.settingInfo}>
                                            <h4>Messages</h4>
                                            <p>Nouveaux messages dans vos conversations</p>
                                        </div>
                                        <label className={styles.switch}>
                                            <input
                                                type="checkbox"
                                                checked={preferences.emailPreferences.messages}
                                                onChange={(e) => handleEmailPreferenceChange('messages', e.target.checked)}
                                            />
                                            <span className={styles.slider}></span>
                                        </label>
                                    </div>

                                    <div className={styles.settingItem}>
                                        <div className={styles.settingInfo}>
                                            <h4>Candidatures</h4>
                                            <p>Nouvelles candidatures et mises à jour</p>
                                        </div>
                                        <label className={styles.switch}>
                                            <input
                                                type="checkbox"
                                                checked={preferences.emailPreferences.applications}
                                                onChange={(e) => handleEmailPreferenceChange('applications', e.target.checked)}
                                            />
                                            <span className={styles.slider}></span>
                                        </label>
                                    </div>

                                    <div className={styles.settingItem}>
                                        <div className={styles.settingInfo}>
                                            <h4>Projets</h4>
                                            <p>Nouveaux projets correspondant à vos compétences</p>
                                        </div>
                                        <label className={styles.switch}>
                                            <input
                                                type="checkbox"
                                                checked={preferences.emailPreferences.projects}
                                                onChange={(e) => handleEmailPreferenceChange('projects', e.target.checked)}
                                            />
                                            <span className={styles.slider}></span>
                                        </label>
                                    </div>

                                    <div className={styles.settingItem}>
                                        <div className={styles.settingInfo}>
                                            <h4>Avis</h4>
                                            <p>Demandes d'avis et nouveaux avis reçus</p>
                                        </div>
                                        <label className={styles.switch}>
                                            <input
                                                type="checkbox"
                                                checked={preferences.emailPreferences.reviews}
                                                onChange={(e) => handleEmailPreferenceChange('reviews', e.target.checked)}
                                            />
                                            <span className={styles.slider}></span>
                                        </label>
                                    </div>

                                    <div className={styles.settingItem}>
                                        <div className={styles.settingInfo}>
                                            <h4>Marketing</h4>
                                            <p>Conseils, actualités et offres spéciales</p>
                                        </div>
                                        <label className={styles.switch}>
                                            <input
                                                type="checkbox"
                                                checked={preferences.emailPreferences.marketing}
                                                onChange={(e) => handleEmailPreferenceChange('marketing', e.target.checked)}
                                            />
                                            <span className={styles.slider}></span>
                                        </label>
                                    </div>
                                </div>
                            )}

                            {/* In-App Notifications */}
                            <div className={styles.settingGroup}>
                                <div className={styles.settingItem}>
                                    <div className={styles.settingInfo}>
                                        <h3>Notifications dans l'application</h3>
                                        <p>Afficher les notifications dans l'interface</p>
                                    </div>
                                    <label className={styles.switch}>
                                        <input
                                            type="checkbox"
                                            checked={preferences.inAppNotifications}
                                            onChange={(e) => handlePreferenceChange('inAppNotifications', e.target.checked)}
                                        />
                                        <span className={styles.slider}></span>
                                    </label>
                                </div>
                            </div>

                            {/* Save Button */}
                            <div className={styles.actions}>
                                <button
                                    onClick={savePreferences}
                                    disabled={saving}
                                    className="btn btn-primary btn-lg"
                                >
                                    {saving ? 'Enregistrement...' : 'Enregistrer les préférences'}
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className={styles.section}>
                            <h2>Changer le mot de passe</h2>
                            <p className={styles.sectionDesc}>
                                Assurez-vous d'utiliser un mot de passe fort et unique
                            </p>

                            <form onSubmit={handlePasswordChange} className={styles.form}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="currentPassword">Mot de passe actuel</label>
                                    <input
                                        type="password"
                                        id="currentPassword"
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        required
                                        className={styles.input}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="newPassword">Nouveau mot de passe</label>
                                    <input
                                        type="password"
                                        id="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        required
                                        minLength={6}
                                        className={styles.input}
                                    />
                                    <small className={styles.hint}>Minimum 6 caractères</small>
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        required
                                        className={styles.input}
                                    />
                                </div>

                                <div className={styles.actions}>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="btn btn-primary btn-lg"
                                    >
                                        {saving ? 'Modification...' : 'Changer le mot de passe'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
