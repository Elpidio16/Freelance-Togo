'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './CookieConsent.module.css';

export default function CookieConsent() {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        // Check if user has already accepted cookies
        const hasAccepted = localStorage.getItem('cookieConsent');
        if (!hasAccepted) {
            // Show banner after a short delay
            setTimeout(() => setShowBanner(true), 1000);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem('cookieConsent', 'accepted');
        setShowBanner(false);
    };

    const declineCookies = () => {
        localStorage.setItem('cookieConsent', 'declined');
        setShowBanner(false);
    };

    if (!showBanner) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.banner}>
                <div className={styles.content}>
                    <div className={styles.icon}>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9c.83 0 1.5-.67 1.5-1.5S7.83 8 7 8s-1.5.67-1.5 1.5S6.17 11 7 11zm5-4c.83 0 1.5-.67 1.5-1.5S12.83 4 12 4s-1.5.67-1.5 1.5S11.17 7 12 7zm5 4c.83 0 1.5-.67 1.5-1.5S17.83 8 17 8s-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm-5 4c.83 0 1.5-.67 1.5-1.5S12.83 12 12 12s-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm-3 4c.83 0 1.5-.67 1.5-1.5S9.83 16 9 16s-1.5.67-1.5 1.5S8.17 19 9 19z" fill="currentColor" />
                        </svg>
                    </div>
                    <div className={styles.text}>
                        <h3>Nous utilisons des cookies 🍪</h3>
                        <p>
                            Nous utilisons des cookies pour améliorer votre expérience sur notre plateforme,
                            analyser le trafic et personnaliser le contenu. En cliquant sur "Accepter", vous
                            consentez à l'utilisation de tous les cookies.{' '}
                            <Link href="/legal/privacy">En savoir plus</Link>
                        </p>
                    </div>
                </div>
                <div className={styles.actions}>
                    <button onClick={declineCookies} className={styles.btnDecline}>
                        Refuser
                    </button>
                    <button onClick={acceptCookies} className={styles.btnAccept}>
                        Accepter
                    </button>
                </div>
            </div>
        </div>
    );
}
