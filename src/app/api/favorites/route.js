import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Favorite from '@/models/Favorite';
import User from '@/models/User';
import FreelanceProfile from '@/models/FreelanceProfile';

// GET /api/favorites - Get company's favorite freelancers
export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        if (session.user.role !== 'company') {
            return NextResponse.json(
                { error: 'Accès refusé' },
                { status: 403 }
            );
        }

        await connectDB();

        const { searchParams } = new URL(request.url);
        const pool = searchParams.get('pool');

        const query = { companyId: session.user.id };
        if (pool && pool !== 'all') {
            query.poolName = pool;
        }

        const favorites = await Favorite.find(query)
            .populate('freelanceId', 'firstName lastName email')
            .sort({ createdAt: -1 });

        // Get freelance profiles
        const favoritesWithProfiles = await Promise.all(
            favorites.map(async (fav) => {
                const profile = await FreelanceProfile.findOne({
                    userId: fav.freelanceId._id,
                });

                return {
                    _id: fav._id,
                    freelance: {
                        id: fav.freelanceId._id,
                        name: `${fav.freelanceId.firstName} ${fav.freelanceId.lastName}`,
                        email: fav.freelanceId.email,
                        jobTitle: profile?.jobTitle || 'Freelance',
                        skills: profile?.skills || [],
                        dailyRate: profile?.dailyRate,
                        rating: profile?.rating || 0,
                        location: profile?.location,
                    },
                    poolName: fav.poolName,
                    notes: fav.notes,
                    addedAt: fav.createdAt,
                };
            })
        );

        // Get unique pool names
        const pools = await Favorite.distinct('poolName', { companyId: session.user.id });

        return NextResponse.json({
            favorites: favoritesWithProfiles,
            pools,
        }, { status: 200 });

    } catch (error) {
        console.error('Erreur GET /api/favorites:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des favoris' },
            { status: 500 }
        );
    }
}

// POST /api/favorites - Add freelancer to favorites
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        if (session.user.role !== 'company') {
            return NextResponse.json(
                { error: 'Seules les entreprises peuvent ajouter des favoris' },
                { status: 403 }
            );
        }

        await connectDB();

        const body = await request.json();
        const { freelanceId, poolName, notes } = body;

        if (!freelanceId) {
            return NextResponse.json(
                { error: 'freelanceId est requis' },
                { status: 400 }
            );
        }

        // Verify freelancer exists
        const freelancer = await User.findById(freelanceId);

        if (!freelancer || freelancer.role !== 'freelance') {
            return NextResponse.json(
                { error: 'Freelance non trouvé' },
                { status: 404 }
            );
        }

        // Create favorite
        const favorite = await Favorite.create({
            companyId: session.user.id,
            freelanceId,
            poolName: poolName || 'Général',
            notes: notes || '',
        });

        return NextResponse.json(
            {
                success: true,
                message: 'Ajouté aux favoris',
                favorite,
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Erreur POST /api/favorites:', error);

        if (error.code === 11000) {
            return NextResponse.json(
                { error: 'Ce freelance est déjà dans vos favoris' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Erreur lors de l\'ajout aux favoris' },
            { status: 500 }
        );
    }
}
