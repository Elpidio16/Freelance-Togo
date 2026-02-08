import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'Non authentifié' },
                { status: 401 }
            );
        }

        // Vérifier que l'utilisateur est un freelance
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user || user.role !== 'freelance') {
            return NextResponse.json(
                { error: 'Seuls les freelances peuvent créer un profil freelance' },
                { status: 403 }
            );
        }

        // Vérifier si un profil existe déjà
        const existingProfile = await prisma.freelanceProfile.findUnique({
            where: { userId: user.id }
        });

        if (existingProfile) {
            return NextResponse.json(
                { error: 'Vous avez déjà un profil freelance' },
                { status: 400 }
            );
        }

        const body = await request.json();
        const {
            title,
            bio,
            category,
            skills,
            hourlyRate,
            dailyRate,
            availability,
            experience,
            education,
            languages,
            certifications,
            socialLinks
        } = body;

        // Validation stricte
        if (!title || !bio || !category) {
            return NextResponse.json(
                { error: 'Titre, bio et catégorie requis' },
                { status: 400 }
            );
        }

        // Vérifier qu'il y a au moins une certification
        if (!certifications || certifications.length === 0) {
            return NextResponse.json(
                { error: 'Au moins une certification est requise' },
                { status: 400 }
            );
        }

        // Vérifier qu'il y a au moins un lien social
        const linksToCheck = socialLinks || {};
        const hasAtLeastOneLink = Object.values(linksToCheck).some(link => link && link.trim() !== '');
        if (!hasAtLeastOneLink) {
            return NextResponse.json(
                { error: 'Au moins un lien social est requis' },
                { status: 400 }
            );
        }

        // Créer le profil freelance
        const profile = await prisma.freelanceProfile.create({
            data: {
                userId: user.id,
                title,
                bio,
                category,
                skills: skills || [],
                hourlyRate: parseFloat(hourlyRate) || 0,
                dailyRate: parseFloat(dailyRate) || 0,
                availability: availability || 'disponible',
                certifications: certifications || [],
                socialLinks: socialLinks || {},
                experience: experience || [],
                education: education || [],
                languages: languages || [],
                portfolio: [],
                averageRating: 0,
                totalReviews: 0,
                completedProjects: 0,
            }
        });

        return NextResponse.json(
            {
                message: 'Profil créé avec succès !',
                profile: {
                    id: profile.id,
                    title: profile.title,
                }
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Erreur lors de la création du profil:', error);
        return NextResponse.json(
            { error: 'Une erreur est survenue lors de la création du profil' },
            { status: 500 }
        );
    }
}

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'Non authentifié' },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Utilisateur non trouvé' },
                { status: 404 }
            );
        }

        const profile = await prisma.freelanceProfile.findUnique({
            where: { userId: user.id }
        });

        if (!profile) {
            return NextResponse.json(
                { error: 'Profil non trouvé' },
                { status: 404 }
            );
        }

        return NextResponse.json({ profile }, { status: 200 });

    } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        return NextResponse.json(
            { error: 'Une erreur est survenue' },
            { status: 500 }
        );
    }
}

export async function PUT(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'Non authentifié' },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Utilisateur non trouvé' },
                { status: 404 }
            );
        }

        const body = await request.json();

        // Separate fields to ensure type safety if needed, or spread body if it matches
        // Prisma update matches existing fields.

        // Remove _id or id from body if present to avoid errors
        const { _id, id, userId, createdAt, updatedAt, ...updateData } = body;

        const profile = await prisma.freelanceProfile.update({
            where: { userId: user.id },
            data: updateData,
        });

        return NextResponse.json(
            {
                message: 'Profil mis à jour avec succès !',
                profile
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Erreur lors de la mise à jour du profil:', error);
        return NextResponse.json(
            { error: 'Une erreur est survenue' },
            { status: 500 }
        );
    }
}
