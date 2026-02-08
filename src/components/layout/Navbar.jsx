'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import styles from './Navbar.module.css';

export default function Navbar() {
    const { data: session, status } = useSession();
    const isLoading = status === 'loading';

    return (
        <nav className={styles.nav}>
            <div className="container">
                <div className="flex items-center justify-between">
                    <div className={styles.logo}>
                        <Link href="/">
                            <span className={styles.logoText}>Ingeni</span>
                            <span className={styles.logoAccent}>Hub</span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-md">
                        <Link href="/categories" className={styles.navLink}>
                            Catégories
                        </Link>
                        <Link href="/freelances/search" className={styles.navLink}>
                            Trouver un freelance
                        </Link>

                        {!isLoading && (
                            <>
                                {session ? (
                                    <>
                                        <Link href="/dashboard" className={styles.navLink}>
                                            Tableau de bord
                                        </Link>
                                        <div className={styles.userMenu}>
                                            <span className={styles.userName}>
                                                👋 {session.user.firstName}
                                            </span>
                                            <button
                                                onClick={async () => {
                                                    await fetch('/api/auth/logout', { method: 'POST' });
                                                    signOut({ callbackUrl: '/' });
                                                }}
                                                className="btn btn-outline btn-sm"
                                            >
                                                Déconnexion
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/auth/login" className={styles.navLink}>
                                            Connexion
                                        </Link>
                                        <Link href="/auth/register" className="btn btn-primary btn-sm">
                                            Créer mon compte
                                        </Link>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
