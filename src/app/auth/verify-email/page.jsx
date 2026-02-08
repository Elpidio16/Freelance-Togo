'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './verify.module.css';

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    const [status, setStatus] = useState('verifying'); // verifying | success | error
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Token de vérification manquant.');
            return;
        }

        verifyEmail();
    }, [token]);

    const verifyEmail = async () => {
        try {
            const response = await fetch(`/api/auth/verify-email?token=${token}`);
            const data = await response.json();

            if (response.ok) {
                setStatus('success');
                setMessage(data.message);

                // Rediriger vers login après 3 secondes
                setTimeout(() => {
                    router.push('/auth/login');
                }, 3000);
            } else {
                setStatus('error');
                setMessage(data.error || 'Une erreur est survenue');
            }
        } catch (error) {
            console.error('Erreur:', error);
            setStatus('error');
            setMessage('Une erreur est survenue lors de la vérification');
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.card}>
                    {status === 'verifying' && (
                        <>
                            <div className={styles.spinner}></div>
                            <h1>Vérification en cours...</h1>
                            <p>Veuillez patienter pendant que nous vérifions votre email.</p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <div className={styles.successIcon}>✓</div>
                            <h1 className={styles.successTitle}>Email vérifié !</h1>
                            <p className={styles.message}>{message}</p>
                            <p className={styles.redirect}>Redirection vers la page de connexion...</p>
                            <Link href="/auth/login" className="btn btn-primary">
                                Se connecter maintenant
                            </Link>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <div className={styles.errorIcon}>✕</div>
                            <h1 className={styles.errorTitle}>Erreur de vérification</h1>
                            <p className={styles.message}>{message}</p>
                            <div className={styles.actions}>
                                <Link href="/auth/register" className="btn btn-outline">
                                    Créer un nouveau compte
                                </Link>
                                <Link href="/auth/login" className="btn btn-ghost">
                                    Retour à la connexion
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<div>Chargement...</div>}>
            <VerifyEmailContent />
        </Suspense>
    );
}
