import Link from 'next/link';
import styles from './categories.module.css';
import prisma from '@/lib/prisma';

export const metadata = {
    title: 'Catégories - IngeniHub',
    description: 'Découvrez toutes les catégories de services freelances disponibles au Togo',
};

async function getCategoryStats() {
    try {
        const stats = await prisma.freelanceProfile.groupBy({
            by: ['category'],
            _count: {
                category: true
            }
        });

        const statsMap = {};
        stats.forEach(item => {
            if (item.category) {
                statsMap[item.category] = item._count.category;
            }
        });
        return statsMap;
    } catch (error) {
        console.error('Error fetching category stats:', error);
        return {};
    }
}

export default async function CategoriesPage() {
    const stats = await getCategoryStats();

    const categories = [
        {
            id: 'développement-web',
            name: 'Développement Web',
            icon: '💻',
            description: 'Sites web, applications web, e-commerce',
            count: stats['Développement Web'] || 0,
        },
        {
            id: 'développement-mobile',
            name: 'Développement Mobile',
            icon: '📱',
            description: 'Applications iOS, Android, React Native',
            count: stats['Développement Mobile'] || 0,
        },
        {
            id: 'design-graphique',
            name: 'Design Graphique',
            icon: '🎨',
            description: 'Logos, identité visuelle, illustrations',
            count: stats['Design Graphique'] || 0,
        },
        {
            id: 'marketing-digital',
            name: 'Marketing Digital',
            icon: '📈',
            description: 'SEO, publicité en ligne, réseaux sociaux',
            count: stats['Marketing Digital'] || 0,
        },
        {
            id: 'rédaction',
            name: 'Rédaction & Traduction',
            icon: '✍️',
            description: 'Articles, contenu web, traduction',
            count: stats['Rédaction & Traduction'] || 0,
        },
        {
            id: 'data-science',
            name: 'Data Science & IA',
            icon: '🤖',
            description: 'Machine learning, analyse de données',
            count: stats['Data Science & IA'] || 0,
        },
    ];

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Toutes les catégories</h1>
                    <p>Trouvez le freelance parfait pour votre projet</p>
                </div>

                <div className={styles.grid}>
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/freelances/search?category=${encodeURIComponent(category.name)}`}
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
