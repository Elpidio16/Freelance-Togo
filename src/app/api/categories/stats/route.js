import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        // Agregation pour compter les profils par catégorie
        // Prisma groupBy
        const stats = await prisma.freelanceProfile.groupBy({
            by: ['category'],
            _count: {
                category: true
            }
        });

        // Convertir en objet pour un accès facile { "Génie Civil": 12, ... }
        const counts = {};
        stats.forEach(item => {
            if (item.category) {
                counts[item.category] = item._count.category;
            }
        });

        return NextResponse.json({ counts }, { status: 200 });
    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
        return NextResponse.json(
            { error: 'Une erreur est survenue' },
            { status: 500 }
        );
    }
}
