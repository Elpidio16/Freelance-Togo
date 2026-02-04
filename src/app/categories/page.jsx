import Link from 'next/link';
import styles from './categories.module.css';

export const metadata = {
    title: 'Catégories - Freelance Togo',
    description: 'Découvrez toutes les catégories de services freelances disponibles au Togo',
};

export default function CategoriesPage() {
    const categories = [
        {
            id: 'développement-web',
            name: 'Développement Web',
            icon: '💻',
            description: 'Sites web, applications web, e-commerce',
            count: 45,
        },
        {
            id: 'développement-mobile',
            name: 'Développement Mobile',
            icon: '📱',
            description: 'Applications iOS, Android, React Native',
            count: 32,
        },
        {
            id: 'design-graphique',
            name: 'Design Graphique',
            icon: '🎨',
            description: 'Logos, identité visuelle, illustrations',
            count: 28,
        },
        {
            id: 'marketing-digital',
            name: 'Marketing Digital',
            icon: '📈',
            description: 'SEO, publicité en ligne, réseaux sociaux',
            count: 21,
        },
        {
            id: 'rédaction',
            name: 'Rédaction & Traduction',
            icon: '✍️',
            description: 'Articles, contenu web, traduction',
            count: 18,
        },
        {
            id: 'data-science',
            name: 'Data Science & IA',
            icon: '🤖',
            description: 'Machine learning, analyse de données',
            count: 15,
        },
    ];

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
                    <h1>Toutes les catégories</h1>
                    <p>Trouvez le freelance parfait pour votre projet</p>
                </div>

                <div className={styles.grid}>
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/freelances/search?category=${category.id}`}
                            className={styles.card}
                        >
                            <div className={styles.cardIcon}>{category.icon}</div>
                            <h3 className={styles.cardTitle}>{category.name}</h3>
                            <p className={styles.cardDescription}>
                                {category.description}
                            </p>
                            <div className={styles.cardFooter}>
                                <span className={styles.count}>
                                    {category.count} freelances disponibles
                                </span>
                                <span className={styles.arrow}>→</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
