'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import styles from './dashboard.module.css';

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/login?callbackUrl=/dashboard');
        }
    }, [status, router]);

    if (status === 'loading') {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Chargement...</p>
            </div>
        );
    }

    if (!session) {
        return null;
    }

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
                    <h1>Bienvenue, {session.user.firstName} ! 👋</h1>
                    <p>Voici votre tableau de bord</p>
                </div>

                <div className={styles.grid}>
                    <div className={styles.card}>
                        <div className={styles.cardIcon}>👤</div>
                        <h3>Profil</h3>
                        <p>Complétez votre profil professionnel</p>
                        <Link href="/profile" className="btn btn-primary">
                            Voir mon profil
                        </Link>
                    </div>

                    <div className={styles.card}>
                        <div className={styles.cardIcon}>💼</div>
                        <h3>Mes projets</h3>
                        <p>Gérez vos projets en cours</p>
                        <Link href="/projects" className="btn btn-outline">
                            Voir les projets
                        </Link>
                    </div>

                    <div className={styles.card}>
                        <div className={styles.cardIcon}>⭐</div>
                        <h3>Évaluations</h3>
                        <p>Consultez vos avis clients</p>
                        <Link href="/reviews" className="btn btn-outline">
                            Voir les avis
                        </Link>
                    </div>

                    <div className={styles.card}>
                        <div className={styles.cardIcon}>⚙️</div>
                        <h3>Paramètres</h3>
                        <p>Gérez vos préférences</p>
                        <Link href="/settings" className="btn btn-outline">
                            Paramètres
                        </Link>
                    </div>
                </div>

                <div className={styles.info}>
                    <h2>Informations du compte</h2>
                    <div className={styles.infoGrid}>
                        <div className={styles.infoItem}>
                            <strong>Email</strong>
                            <span>{session.user.email}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <strong>Rôle</strong>
                            <span>{session.user.role === 'freelance' ? 'Freelance' : 'Entreprise'}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <strong>Statut</strong>
                            <span className={styles.verified}>
                                ✓ Email vérifié
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
