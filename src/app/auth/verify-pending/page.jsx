'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from './pending.module.css';

export default function VerifyPendingPage() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email');

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles.emailIcon}>📧</div>

                    <h1 className={styles.title}>Vérifiez votre email</h1>

                    <p className={styles.message}>
                        Nous avons envoyé un email de vérification à<br />
                        <strong>{email || 'votre adresse email'}</strong>
                    </p>

                    <div className={styles.instructions}>
                        <h2>Prochaines étapes :</h2>
                        <ol>
                            <li>Ouvrez votre boîte de réception</li>
                            <li>Recherchez l'email de <strong>Freelance Togo</strong></li>
                            <li>Cliquez sur le lien de vérification</li>
                            <li>Connectez-vous à votre compte !</li>
                        </ol>
                    </div>

                    <div className={styles.note}>
                        <p>
                            <strong>💡 Astuce</strong> : Si vous ne voyez pas l'email, vérifiez votre dossier spam ou courrier indésirable.
                        </p>
                        <p className={styles.expiry}>
                            ⏰ Le lien expire dans 24 heures
                        </p>
                    </div>

                    <div className={styles.actions}>
                        <Link href="/auth/login" className="btn btn-outline">
                            Retour à la connexion
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
