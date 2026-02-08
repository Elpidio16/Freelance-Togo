'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './reset-password.module.css';

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!token) {
            setError('Token manquant. Veuillez utiliser le lien reçu par email.');
        }
    }, [token]);

    const validatePassword = () => {
        if (password.length < 6) {
            return 'Le mot de passe doit contenir au moins 6 caractères';
        }
        if (password !== confirmPassword) {
            return 'Les mots de passe ne correspondent pas';
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const validationError = validatePassword();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Une erreur est survenue');
                return;
            }

            setSuccess(true);

            // Rediriger vers la page de connexion après 3 secondes
            setTimeout(() => {
                router.push('/auth/login');
            }, 3000);
        } catch (err) {
            setError('Erreur de connexion. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className={styles.page}>
                <div className={styles.container}>
                    <div className={styles.card}>
                        <div className={styles.successIcon}>
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                <path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>

                        <h1 className={styles.title}>Mot de passe réinitialisé !</h1>
                        <p className={styles.description}>
                            Votre mot de passe a été modifié avec succès.
                            Vous allez être redirigé vers la page de connexion...
                        </p>

                        <Link href="/auth/login" className="btn btn-primary btn-lg">
                            Se connecter maintenant
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.card}>
                    {/* Header */}
                    <div className={styles.header}>
                        <Link href="/" className={styles.logo}>
                            <span className={styles.logoText}>Ingeni</span>
                            <span className={styles.logoAccent}>Hub</span>
                        </Link>
                    </div>

                    <h1 className={styles.title}>Nouveau mot de passe</h1>
                    <p className={styles.description}>
                        Choisissez un nouveau mot de passe sécurisé pour votre compte.
                    </p>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className={styles.form}>
                        {error && (
                            <div className={styles.error}>
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                    <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                {error}
                            </div>
                        )}

                        <div className={styles.formGroup}>
                            <label htmlFor="password">Nouveau mot de passe</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Minimum 6 caractères"
                                required
                                disabled={loading || !token}
                                className={styles.input}
                            />
                            <small className={styles.hint}>
                                Utilisez au moins 6 caractères avec des lettres et des chiffres
                            </small>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Retapez votre mot de passe"
                                required
                                disabled={loading || !token}
                                className={styles.input}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !token || !password || !confirmPassword}
                            className="btn btn-primary btn-lg"
                            style={{ width: '100%' }}
                        >
                            {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className={styles.footer}>
                        <Link href="/auth/login" className={styles.link}>
                            ← Retour à la connexion
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>Chargement...</div>}>
            <ResetPasswordForm />
        </Suspense>
    );
}
