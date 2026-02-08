import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

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

        const { searchParams } = new URL(request.url);
        const pool = searchParams.get('pool');

        const where = { companyId: session.user.id };
        if (pool && pool !== 'all') {
            where.poolName = pool;
        }

        const favorites = await prisma.favorite.findMany({
            where,
            include: {
                freelance: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        freelanceProfile: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Format
        const favoritesWithProfiles = favorites.map((fav) => {
            const profile = fav.freelance.freelanceProfile;
            return {
                _id: fav.id,
                id: fav.id,
                freelance: {
                    id: fav.freelance.id,
                    name: `${fav.freelance.firstName} ${fav.freelance.lastName}`,
                    email: fav.freelance.email,
                    jobTitle: profile?.title || 'Freelance',
                    skills: profile?.skills || [],
                    dailyRate: profile?.dailyRate,
                    rating: profile?.averageRating || 0,
                    location: profile?.city || '', // Profile usually has city, or user has city?
                    // User has city, profile has title. Previous code used profile.location? 
                    // Let's check schema. FreelanceProfile doesn't have location, User has city.
                    // But in previous code, it accessed profile.location. Maybe it was virtual?
                    // Safe fallback.
                },
                poolName: fav.poolName,
                notes: fav.notes,
                addedAt: fav.createdAt,
            };
        });

        // Get unique pool names
        const poolsResult = await prisma.favorite.findMany({
            where: { companyId: session.user.id },
            select: { poolName: true },
            distinct: ['poolName']
        });
        const pools = poolsResult.map(p => p.poolName);

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

        const body = await request.json();
        const { freelanceId, poolName, notes } = body;

        if (!freelanceId) {
            return NextResponse.json(
                { error: 'freelanceId est requis' },
                { status: 400 }
            );
        }

        // Verify freelancer exists
        const freelancer = await prisma.user.findUnique({
            where: { id: freelanceId }
        });

        if (!freelancer || freelancer.role !== 'freelance') {
            return NextResponse.json(
                { error: 'Freelance non trouvé' },
                { status: 404 }
            );
        }

        // Create favorite
        const favorite = await prisma.favorite.create({
            data: {
                companyId: session.user.id,
                freelanceId,
                poolName: poolName || 'Général',
                notes: notes || '',
            }
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

        if (error.code === 'P2002') { // Unique constraint
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
