import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import FreelanceProfile from '@/models/FreelanceProfile';
import User from '@/models/User';

export async function POST(request) {
    try {
        const session = await getServerSession();

        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'Non authentifié' },
                { status: 401 }
            );
        }

        await connectDB();

        // Vérifier que l'utilisateur est un freelance
        const user = await User.findOne({ email: session.user.email });
        if (!user || user.role !== 'freelance') {
            return NextResponse.json(
                { error: 'Seuls les freelances peuvent créer un profil freelance' },
                { status: 403 }
            );
        }

        // Vérifier si un profil existe déjà
        const existingProfile = await FreelanceProfile.findOne({ userId: user._id });
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
            skills,
            hourlyRate,
            dailyRate,
            availability,
            experience,
            education,
            languages,
        } = body;

        // Validation stricte
        if (!title || !bio) {
            return NextResponse.json(
                { error: 'Titre et bio requis' },
                { status: 400 }
            );
        }

        // Vérifier qu'il y a au moins une certification
        if (!body.certifications || body.certifications.length === 0) {
            return NextResponse.json(
                { error: 'Au moins une certification est requise' },
                { status: 400 }
            );
        }

        // Vérifier qu'il y a au moins un lien social
        const socialLinks = body.socialLinks || {};
        const hasAtLeastOneLink = Object.values(socialLinks).some(link => link && link.trim() !== '');
        if (!hasAtLeastOneLink) {
            return NextResponse.json(
                { error: 'Au moins un lien social est requis' },
                { status: 400 }
            );
        }

        // Créer le profil freelance
        const profile = await FreelanceProfile.create({
            userId: user._id,
            title,
            bio,
            skills: skills || [],
            hourlyRate: hourlyRate || 0,
            dailyRate: dailyRate || 0,
            availability: availability || 'disponible',
            certifications: body.certifications || [],
            socialLinks: socialLinks,
            experience: experience || [],
            education: education || [],
            languages: languages || [],
            portfolio: [],
            averageRating: 0,
            totalReviews: 0,
            completedProjects: 0,
        });

        return NextResponse.json(
            {
                message: 'Profil créé avec succès !',
                profile: {
                    id: profile._id,
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
        const session = await getServerSession();

        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'Non authentifié' },
                { status: 401 }
            );
        }

        await connectDB();

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json(
                { error: 'Utilisateur non trouvé' },
                { status: 404 }
            );
        }

        const profile = await FreelanceProfile.findOne({ userId: user._id });

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
        const session = await getServerSession();

        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'Non authentifié' },
                { status: 401 }
            );
        }

        await connectDB();

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json(
                { error: 'Utilisateur non trouvé' },
                { status: 404 }
            );
        }

        const body = await request.json();

        const profile = await FreelanceProfile.findOneAndUpdate(
            { userId: user._id },
            { ...body, updatedAt: new Date() },
            { new: true }
        );

        if (!profile) {
            return NextResponse.json(
                { error: 'Profil non trouvé' },
                { status: 404 }
            );
        }

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
