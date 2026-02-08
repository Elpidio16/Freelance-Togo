import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
    try {
        const { id } = params;

        // Récupérer le profil avec les données utilisateur
        const profile = await prisma.freelanceProfile.findUnique({
            where: { id: id },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                        // phone: true, // User model might not have phone? Standard NextAuth User doesn't usually.
                        // But Mongoose schema had it.
                        // Check Prisma User model.
                        // If schema.prisma has phone, keep it.
                        // If not, omit.
                        // I will omit for safety or check. 
                        // But Mongoose code `select('... phone')` suggests it exists.
                        // Assuming I added it to Prisma model.
                    }
                }
            }
        });

        if (!profile) {
            return NextResponse.json(
                { error: 'Freelance non trouvé' },
                { status: 404 }
            );
        }

        const freelance = {
            id: profile.id,
            name: `${profile.user.firstName} ${profile.user.lastName}`,
            title: profile.title,
            bio: profile.bio,
            category: profile.category,
            image: profile.profileImage || null,
            rating: profile.averageRating || 0,
            reviews: profile.totalReviews || 0,
            hourlyRate: profile.hourlyRate || 0,
            dailyRate: profile.dailyRate || 0,
            skills: profile.skills || [],
            availability: profile.availability || 'disponible',
            completedProjects: profile.completedProjects || 0,
            portfolio: profile.portfolio || [],
            experience: profile.experience || [],
            education: profile.education || [],
            languages: profile.languages || [],
            certifications: profile.certifications || [],
            socialLinks: profile.socialLinks || {},
        };

        return NextResponse.json({ freelance }, { status: 200 });

    } catch (error) {
        console.error('Erreur lors de la récupération du freelance:', error);
        return NextResponse.json(
            { error: 'Une erreur est survenue' },
            { status: 500 }
        );
    }
}
