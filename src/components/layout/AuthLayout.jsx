'use client';

import Link from 'next/link';
import styles from './auth-layout.module.css';

export default function AuthLayout({ children }) {
    return (
        <div className={styles.page}>
            {/* Main Content */}
            <main className={styles.main}>
                {children}
            </main>
        </div>
    );
}
