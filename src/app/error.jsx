'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import styles from './error.module.css';

export default function Error({ error, reset }) {
    useEffect(() => {
        // Log l'erreur (sera envoyé à Sentry quand configuré)
        console.error('Error boundary caught:', error);
    }, [error]);

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.content}>
                    {/* Error Icon */}
                    <div className={styles.errorIcon}>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                            <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </div>

                    {/* Message */}
                    <h1 className={styles.title}>Oups ! Une erreur est survenue</h1>
                    <p className={styles.description}>
                        Nous sommes désolés, quelque chose s'est mal passé.
                        Notre équipe a été notifiée et travaille sur le problème.
                    </p>

                    {/* Error Details (dev only) */}
                    {process.env.NODE_ENV === 'development' && (
                        <div className={styles.errorDetails}>
                            <h3>Détails de l'erreur (dev only):</h3>
                            <pre>{error?.message || 'Erreur inconnue'}</pre>
                            {error?.stack && (
                                <details>
                                    <summary>Stack trace</summary>
                                    <pre>{error.stack}</pre>
                                </details>
                            )}
                        </div>
                    )}

                    {/* Actions */}
                    <div className={styles.actions}>
                        <button
                            onClick={() => reset()}
                            className="btn btn-primary btn-lg"
                        >
                            Réessayer
                        </button>
                        <Link href="/" className="btn btn-outline btn-lg">
                            Retour à l'accueil
                        </Link>
                    </div>

                    {/* Help */}
                    <div className={styles.help}>
                        <p>
                            Si le problème persiste, contactez-nous à{' '}
                            <a href="mailto:support@freelance-togo.com">support@freelance-togo.com</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
