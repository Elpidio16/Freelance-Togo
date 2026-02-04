import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import FreelanceProfile from '@/models/FreelanceProfile';
import User from '@/models/User';

export async function GET(request, { params }) {
    try {
        await connectDB();

        const { id } = params;

        // Récupérer le profil avec les données utilisateur
        const profile = await FreelanceProfile.findById(id)
            .populate('userId', 'firstName lastName city email phone');

        if (!profile) {
            return NextResponse.json(
                { error: 'Freelance non trouvé' },
                { status: 404 }
            );
        }

        const freelance = {
            id: profile._id.toString(),
            name: `${profile.userId.firstName} ${profile.userId.lastName}`,
            title: profile.title,
            bio: profile.bio,
            image: profile.profileImage || null,
            rating: profile.averageRating || 0,
            reviews: profile.totalReviews || 0,
            hourlyRate: profile.hourlyRate || 0,
            dailyRate: profile.dailyRate || 0,
            city: profile.userId.city,
            skills: profile.skills || [],
            availability: profile.availability || 'disponible',
            completedProjects: profile.completedProjects || 0,
            portfolio: profile.portfolio || [],
            experience: profile.experience || [],
            education: profile.education || [],
            languages: profile.languages || [],
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
