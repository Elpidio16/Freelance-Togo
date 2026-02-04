'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import styles from './page.module.css';

export default function Home() {
    const { data: session, status } = useSession();
    const isLoading = status === 'loading';

    return (
        <div className={styles.page}>
            {/* Navigation */}
            <nav className={styles.nav}>
                <div className="container">
                    <div className="flex items-center justify-between">
                        <div className={styles.logo}>
                            <Link href="/">
                                <span className={styles.logoText}>Freelance</span>
                                <span className={styles.logoAccent}>Togo</span>
                            </Link>
                        </div>

                        <div className="flex items-center gap-md">
                            <Link href="/categories" className="btn-ghost">
                                Catégories
                            </Link>
                            <Link href="/freelances/search" className="btn-ghost">
                                Trouver un freelance
                            </Link>

                            {!isLoading && (
                                <>
                                    {session ? (
                                        <>
                                            <Link href="/dashboard" className="btn-ghost">
                                                Tableau de bord
                                            </Link>
                                            <div className={styles.userMenu}>
                                                <span className={styles.userName}>
                                                    👋 {session.user.firstName}
                                                </span>
                                                <button
                                                    onClick={() => signOut({ callbackUrl: '/' })}
                                                    className="btn btn-outline"
                                                >
                                                    Déconnexion
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <Link href="/auth/login" className="btn-ghost">
                                                Connexion
                                            </Link>
                                            <Link href="/auth/register" className="btn btn-primary">
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

            {/* Hero Section */}
            <section className={styles.hero}>
                <div className="container">
                    <div className={styles.heroContent}>
                        <h1 className={styles.heroTitle}>
                            Trouvez les meilleurs <br />
                            <span className={styles.gradient}>ingénieurs freelances</span> <br />
                            au Togo
                        </h1>

                        <p className={styles.heroDescription}>
                            Connectez-vous avec des experts vérifiés en génie civil, informatique,
                            électrique et bien plus. Des milliers de projets réalisés avec succès.
                        </p>

                        {/* Search Bar */}
                        <div className={styles.searchContainer}>
                            <div className={styles.searchBox}>
                                <div className={styles.searchInput}>
                                    <svg className={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Recherchez un métier, une compétence..."
                                        className={styles.input}
                                    />
                                </div>

                                <div className={styles.searchDivider}></div>

                                <div className={styles.searchInput}>
                                    <svg className={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Ville au Togo"
                                        className={styles.input}
                                    />
                                </div>

                                <button className="btn btn-primary btn-lg">
                                    Rechercher
                                </button>
                            </div>
                        </div>

                        {/* Trust Indicators */}
                        <div className={styles.trustIndicators}>
                            <div className={styles.trustItem}>
                                <svg className={styles.trustIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <span>Profils vérifiés</span>
                            </div>

                            <div className={styles.trustItem}>
                                <svg className={styles.trustIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <span>Paiements sécurisés</span>
                            </div>

                            <div className={styles.trustItem}>
                                <svg className={styles.trustIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                                <span>Plus de 1000 projets réussis</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className={styles.categoriesSection}>
                <div className="container">
                    <h2 className="text-center mb-5">Explorez les catégories d'ingénieurs</h2>

                    <div className="grid grid-cols-3">
                        {categories.map((category, index) => (
                            <Link href={`/freelances/search?category=${category.slug}`} key={index}>
                                <div className="card">
                                    <div className={styles.categoryIcon}>{category.icon}</div>
                                    <h3 className="card-title">{category.name}</h3>
                                    <p className="card-description">{category.description}</p>
                                    <span className="badge badge-primary">{category.count} experts</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className={styles.ctaSection}>
                <div className="container">
                    <div className={styles.ctaCard}>
                        <h2>Prêt à démarrer votre projet ?</h2>
                        <p>Rejoignez des centaines d'entreprises qui font confiance à Freelance Togo</p>
                        <div className="flex gap-md items-center justify-center mt-4">
                            <Link href="/auth/register?type=company" className="btn btn-primary btn-lg">
                                Je cherche un freelance
                            </Link>
                            <Link href="/auth/register?type=freelance" className="btn btn-outline btn-lg">
                                Je suis freelance
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className={styles.footer}>
                <div className="container">
                    <div className="text-center">
                        <p>&copy; 2026 Freelance Togo. Tous droits réservés.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

const categories = [
    {
        name: 'Génie Informatique',
        slug: 'genie-informatique',
        description: 'Développeurs, Data Scientists, DevOps',
        icon: '💻',
        count: 245
    },
    {
        name: 'Génie Civil',
        slug: 'genie-civil',
        description: 'BTP, Construction, Urbanisme',
        icon: '🏗️',
        count: 189
    },
    {
        name: 'Génie Électrique',
        slug: 'genie-electrique',
        description: 'Électricité, Automatisme, Énergie',
        icon: '⚡',
        count: 156
    },
    {
        name: 'Génie Mécanique',
        slug: 'genie-mecanique',
        description: 'CAO, Maintenance, Production',
        icon: '⚙️',
        count: 134
    },
    {
        name: 'Télécommunications',
        slug: 'telecommunications',
        description: 'Réseaux, Systèmes, Infrastructure',
        icon: '📡',
        count: 98
    },
    {
        name: 'Génie Industriel',
        slug: 'genie-industriel',
        description: 'Process, Qualité, Logistique',
        icon: '🏭',
        count: 87
    },
];
