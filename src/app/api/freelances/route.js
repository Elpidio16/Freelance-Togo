import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const city = searchParams.get('city');
        const availability = searchParams.get('availability');
        const minRate = searchParams.get('minRate');
        const maxRate = searchParams.get('maxRate');
        const search = searchParams.get('search');
        const skills = searchParams.get('skills');
        const category = searchParams.get('category');

        // Construire les filtres Prisma
        let where = {};

        if (availability) {
            where.availability = availability;
        }

        if (minRate || maxRate) {
            where.hourlyRate = {};
            if (minRate) where.hourlyRate.gte = parseFloat(minRate);
            if (maxRate) where.hourlyRate.lte = parseFloat(maxRate);
        }

        if (skills) {
            const skillsArray = skills.split(',').map(s => s.trim());
            // hasSome: trouve les profils qui ont au moins une des compétences listées
            where.skills = { hasSome: skillsArray };
        }

        // Filtre par catégorie
        if (category) {
            where.category = category;
        }

        // Filtre par ville (sur la relation user)
        if (city && city !== 'Toutes les villes') {
            where.user = {
                city: city
            };
        } else if (city === 'Toutes les villes') {
            // No filter
        }

        // Recherche textuelle sur title, bio, skills
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { bio: { contains: search, mode: 'insensitive' } },
                // Pour les tableaux de strings, 'has' cherche une correspondance exacte d'un élément
                // Pour une recherche partielle dans les skills, c'est plus complexe avec Prisma.
                // On se contente de title/bio et exact skill match pour l'instant.
                { skills: { has: search } }
            ];
        }

        // Récupérer les profils avec les données utilisateur
        const profiles = await prisma.freelanceProfile.findMany({
            where: where,
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        city: true,
                        email: true,
                        image: true,
                    }
                }
            },
            orderBy: {
                averageRating: 'desc',
            },
            take: 50,
        });

        // Formater pour le frontend
        const freelances = profiles.map(profile => ({
            id: profile.id,
            userId: profile.userId,
            name: `${profile.user.firstName} ${profile.user.lastName}`,
            title: profile.title,
            bio: profile.bio,
            category: profile.category || 'Autre',
            image: profile.profileImage || profile.user.image || null,
            rating: profile.averageRating || 0,
            reviews: profile.totalReviews || 0,
            hourlyRate: profile.hourlyRate || 0,
            dailyRate: profile.dailyRate || 0,
            city: profile.user.city,
            skills: profile.skills || [],
            availability: profile.availability || 'disponible',
            completedProjects: profile.completedProjects || 0,
        }));

        return NextResponse.json({ freelances }, { status: 200 });

    } catch (error) {
        console.error('Erreur lors de la récupération des freelances:', error);
        return NextResponse.json(
            { error: 'Une erreur est survenue' },
            { status: 500 }
        );
    }
}
