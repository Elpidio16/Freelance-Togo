import Link from 'next/link';
import styles from './page.module.css';

export const metadata = {
    title: 'Inscription - Freelance Togo',
    description: 'Créez votre compte sur Freelance Togo',
};

export default function RegisterPage() {
    return (
        <div className={styles.page}>
            <nav className={styles.nav}>
                <div className="container">
                    <div className="flex items-center justify-between">
                        <Link href="/" className={styles.logo}>
                            <span className={styles.logoText}>Freelance</span>
                            <span className={styles.logoAccent}>Togo</span>
                        </Link>

                        <Link href="/auth/login" className="btn-ghost">
                            Connexion
                        </Link>
                    </div>
                </div>
            </nav>

            <div className={styles.container}>
                <div className={styles.header}>
                    <span className={styles.badge}>Bonjour</span>
                    <h1 className={styles.title}>Quel type de compte souhaitez-vous créer ?</h1>
                </div>

                <div className={styles.choiceContainer}>
                    <Link href="/auth/register/company" className={styles.choiceCard}>
                        <div className={styles.illustration}>
                            <div className={styles.companyIllustration}>
                                {/* Company illustration with simple CSS shapes */}
                                <div className={styles.person}>
                                    <div className={styles.head}></div>
                                    <div className={styles.body}></div>
                                    <div className={styles.glasses}></div>
                                </div>
                            </div>
                        </div>
                        <h2 className={styles.choiceTitle}>Entreprise</h2>
                        <p className={styles.choiceDescription}>Je cherche des freelances</p>
                    </Link>

                    <Link href="/auth/register/freelance" className={styles.choiceCard}>
                        <div className={styles.illustration}>
                            <div className={styles.freelanceIllustration}>
                                {/* Freelance illustration with simple CSS shapes */}
                                <div className={styles.laptop}>
                                    <div className={styles.screen}></div>
                                    <div className={styles.keyboard}></div>
                                </div>
                                <div className={styles.personSmall}>
                                    <div className={styles.headSmall}></div>
                                    <div className={styles.bodySmall}></div>
                                </div>
                            </div>
                        </div>
                        <h2 className={styles.choiceTitle}>Freelance</h2>
                        <p className={styles.choiceDescription}>Je crée mon profil de freelance</p>
                    </Link>
                </div>

                <div className={styles.footer}>
                    <p>
                        <span>✍️ Vous êtes consultant ou manager de transition ?</span>{' '}
                        <Link href="#" className={styles.link}>Découvrez Malt Strategy</Link>
                    </p>
                    <p className={styles.footerNote}>
                        Voir aussi <Link href="#" className={styles.link}>mon compte</Link> | <Link href="#" className={styles.link}>Connexion</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
