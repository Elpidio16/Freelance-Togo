import Link from 'next/link';
import styles from './categories.module.css';
import prisma from '@/lib/prisma';
import { CATEGORIES } from '@/lib/categories';

export const metadata = {
    title: 'Catégories - IngeniHub',
    description: 'Découvrez toutes les catégories de services d\'ingénieurs disponibles au Togo',
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

    // Map categories with their counts from the database
    const categoriesWithCounts = CATEGORIES.map(category => ({
        ...category,
        count: stats[category.name] || 0,
    }));

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Toutes les catégories</h1>
                    <p>Trouvez l'ingénieur parfait pour votre projet</p>
                </div>

                <div className={styles.grid}>
                    {categoriesWithCounts.map((category) => (
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
                                    {category.count} ingénieurs disponibles
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
