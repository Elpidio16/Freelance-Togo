'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import styles from './MobileMenu.module.css';

export default function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const { data: session } = useSession();

    // Close menu when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleSignOut = async () => {
        await signOut({ callbackUrl: '/' });
    };

    const isActive = (path) => {
        return pathname === path || pathname?.startsWith(path + '/');
    };

    return (
        <>
            {/* Hamburger Button */}
            <button
                className={`${styles.hamburger} ${isOpen ? styles.open : ''}`}
                onClick={toggleMenu}
                aria-label="Menu"
                aria-expanded={isOpen}
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className={styles.overlay}
                    onClick={() => setIsOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Mobile Menu */}
            <nav className={`${styles.menu} ${isOpen ? styles.menuOpen : ''}`}>
                <div className={styles.menuHeader}>
                    <Link href="/" className={styles.logo} onClick={() => setIsOpen(false)}>
                        <span className={styles.logoText}>Ingeni</span>
                        <span className={styles.logoAccent}>Hub</span>
                    </Link>
                </div>

                <div className={styles.menuContent}>
                    {session ? (
                        <>
                            {/* User Info */}
                            <div className={styles.userInfo}>
                                <div className={styles.avatar}>
                                    {session.user.firstName?.[0] || session.user.email?.[0] || 'U'}
                                </div>
                                <div className={styles.userDetails}>
                                    <p className={styles.userName}>
                                        {session.user.firstName} {session.user.lastName}
                                    </p>
                                    <p className={styles.userEmail}>{session.user.email}</p>
                                </div>
                            </div>

                            {/* Navigation Links */}
                            <div className={styles.navSection}>
                                <Link
                                    href="/dashboard"
                                    className={`${styles.navLink} ${isActive('/dashboard') ? styles.active : ''}`}
                                >
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" fill="currentColor" />
                                    </svg>
                                    Tableau de bord
                                </Link>

                                <Link
                                    href="/profile"
                                    className={`${styles.navLink} ${isActive('/profile') ? styles.active : ''}`}
                                >
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor" />
                                    </svg>
                                    Mon profil
                                </Link>

                                <Link
                                    href="/projects/browse"
                                    className={`${styles.navLink} ${isActive('/projects') ? styles.active : ''}`}
                                >
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z" fill="currentColor" />
                                    </svg>
                                    Projets
                                </Link>

                                <Link
                                    href="/messages"
                                    className={`${styles.navLink} ${isActive('/messages') ? styles.active : ''}`}
                                >
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" fill="currentColor" />
                                    </svg>
                                    Messages
                                </Link>

                                {session.user.role === 'freelance' && (
                                    <Link
                                        href="/applications/my-applications"
                                        className={`${styles.navLink} ${isActive('/applications') ? styles.active : ''}`}
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" fill="currentColor" />
                                        </svg>
                                        Mes candidatures
                                    </Link>
                                )}
                            </div>

                            {/* Settings & Logout */}
                            <div className={styles.menuFooter}>
                                <Link
                                    href="/settings"
                                    className={`${styles.navLink} ${isActive('/settings') ? styles.active : ''}`}
                                >
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" fill="currentColor" />
                                    </svg>
                                    Paramètres
                                </Link>

                                <button onClick={handleSignOut} className={styles.logoutBtn}>
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" fill="currentColor" />
                                    </svg>
                                    Déconnexion
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Guest Navigation */}
                            <div className={styles.navSection}>
                                <Link href="/" className={`${styles.navLink} ${isActive('/') && pathname === '/' ? styles.active : ''}`}>
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="currentColor" />
                                    </svg>
                                    Accueil
                                </Link>

                                <Link href="/projects/browse" className={`${styles.navLink} ${isActive('/projects') ? styles.active : ''}`}>
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z" fill="currentColor" />
                                    </svg>
                                    Parcourir les projets
                                </Link>

                                <Link href="/freelances/search" className={`${styles.navLink} ${isActive('/freelances') ? styles.active : ''}`}>
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="currentColor" />
                                    </svg>
                                    Trouver des freelances
                                </Link>
                            </div>

                            {/* Auth Buttons */}
                            <div className={styles.authButtons}>
                                <Link href="/auth/login" className="btn btn-outline btn-lg">
                                    Se connecter
                                </Link>
                                <Link href="/auth/register" className="btn btn-primary btn-lg">
                                    S'inscrire
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </nav>
        </>
    );
}
