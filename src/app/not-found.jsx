'use client';

import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.content}>
                    {/* 404 Animation */}
                    <div className={styles.errorCode}>
                        <span className={styles.digit}>4</span>
                        <span className={styles.digit}>0</span>
                        <span className={styles.digit}>4</span>
                    </div>

                    {/* Message */}
                    <h1 className={styles.title}>Page non trouvée</h1>
                    <p className={styles.description}>
                        Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
                    </p>

                    {/* Actions */}
                    <div className={styles.actions}>
                        <Link href="/" className="btn btn-primary btn-lg">
                            Retour à l'accueil
                        </Link>
                        <Link href="/freelances/search" className="btn btn-outline btn-lg">
                            Trouver un freelance
                        </Link>
                    </div>

                    {/* Suggestions */}
                    <div className={styles.suggestions}>
                        <h3>Liens utiles :</h3>
                        <ul>
                            <li>
                                <Link href="/projects/browse">Parcourir les projets</Link>
                            </li>
                            <li>
                                <Link href="/categories">Explorer les catégories</Link>
                            </li>
                            <li>
                                <Link href="/dashboard">Mon tableau de bord</Link>
                            </li>
                            <li>
                                <Link href="/auth/login">Se connecter</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Illustration */}
                <div className={styles.illustration}>
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="100" cy="100" r="80" fill="var(--color-primary-light)" opacity="0.2" />
                        <path d="M60 80 Q100 60 140 80" stroke="var(--color-primary)" strokeWidth="4" fill="none" />
                        <circle cx="70" cy="70" r="8" fill="var(--color-primary)" />
                        <circle cx="130" cy="70" r="8" fill="var(--color-primary)" />
                        <path d="M70 120 Q100 140 130 120" stroke="var(--color-primary)" strokeWidth="4" fill="none" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
