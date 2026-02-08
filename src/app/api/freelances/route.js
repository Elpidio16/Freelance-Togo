import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import FreelanceProfile from '@/models/FreelanceProfile';
import User from '@/models/User';

export async function GET(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const city = searchParams.get('city');
        const availability = searchParams.get('availability');
        const minRate = searchParams.get('minRate');
        const maxRate = searchParams.get('maxRate');
        const search = searchParams.get('search');
        const skills = searchParams.get('skills');
        const category = searchParams.get('category');

        // Construire les filtres
        let filters = {};

        if (availability) {
            filters.availability = availability;
        }

        if (minRate || maxRate) {
            filters.hourlyRate = {};
            if (minRate) filters.hourlyRate.$gte = parseInt(minRate);
            if (maxRate) filters.hourlyRate.$lte = parseInt(maxRate);
        }

        if (skills) {
            const skillsArray = skills.split(',').map(s => s.trim());
            filters.skills = { $in: skillsArray };
        }

        // Filtre par catégorie
        if (category) {
            filters.category = category;
        }

        // Recherche textuelle sur title, bio, skills
        if (search) {
            filters.$or = [
                { title: { $regex: search, $options: 'i' } },
                { bio: { $regex: search, $options: 'i' } },
                { skills: { $elemMatch: { $regex: search, $options: 'i' } } },
            ];
        }

        // Récupérer les profils avec les données utilisateur
        const profiles = await FreelanceProfile.find(filters)
            .populate('userId', 'firstName lastName city email')
            .sort({ averageRating: -1 })
            .limit(50);

        // Filtrer par ville si spécifié (sur l'utilisateur, pas le profil)
        let freelances = profiles.map(profile => ({
            id: profile._id.toString(),
            name: `${profile.userId.firstName} ${profile.userId.lastName}`,
            title: profile.title,
            bio: profile.bio,
            category: profile.category || 'Autre',
            image: profile.profileImage || null,
            rating: profile.averageRating || 0,
            reviews: profile.totalReviews || 0,
            hourlyRate: profile.hourlyRate || 0,
            dailyRate: profile.dailyRate || 0,
            city: profile.userId.city,
            skills: profile.skills || [],
            availability: profile.availability || 'disponible',
            completedProjects: profile.completedProjects || 0,
        }));

        // Filtrer par ville après la récupération
        if (city && city !== 'Toutes les villes') {
            freelances = freelances.filter(f => f.city === city);
        }

        return NextResponse.json({ freelances }, { status: 200 });

    } catch (error) {
        console.error('Erreur lors de la récupération des freelances:', error);
        return NextResponse.json(
            { error: 'Une erreur est survenue' },
            { status: 500 }
        );
    }
}
