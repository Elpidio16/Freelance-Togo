import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import FreelanceProfile from '@/models/FreelanceProfile';

export async function GET() {
    try {
        await connectDB();

        // Agregation pour compter les profils par catégorie
        const stats = await FreelanceProfile.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Convertir en objet pour un accès facile { "Génie Civil": 12, ... }
        const counts = {};
        stats.forEach(item => {
            if (item._id) {
                counts[item._id] = item.count;
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
