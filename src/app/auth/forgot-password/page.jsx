'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './forgot-password.module.css';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.status === 429) {
                setError(data.error || 'Trop de tentatives. Veuillez réessayer plus tard.');
                return;
            }

            if (!res.ok) {
                setError(data.error || 'Une erreur est survenue');
                return;
            }

            setSuccess(true);
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

                        <h1 className={styles.title}>Email envoyé !</h1>
                        <p className={styles.description}>
                            Si un compte existe avec l'adresse <strong>{email}</strong>,
                            vous recevrez un email avec les instructions pour réinitialiser votre mot de passe.
                        </p>

                        <div className={styles.info}>
                            <p>📧 Vérifiez votre boîte de réception</p>
                            <p>⏱️ Le lien expire dans 1 heure</p>
                            <p>📂 Pensez à vérifier vos spams</p>
                        </div>

                        <Link href="/auth/login" className="btn btn-primary btn-lg">
                            Retour à la connexion
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

                    <h1 className={styles.title}>Mot de passe oublié ?</h1>
                    <p className={styles.description}>
                        Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
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
                            <label htmlFor="email">Adresse email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="votre@email.com"
                                required
                                disabled={loading}
                                className={styles.input}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !email}
                            className="btn btn-primary btn-lg"
                            style={{ width: '100%' }}
                        >
                            {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
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
