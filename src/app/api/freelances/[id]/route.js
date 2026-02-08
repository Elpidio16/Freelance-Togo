import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
    try {
        // Next.js 15: params is a Promise, must await it
        const { id } = await params;
        console.log('[API] Fetching profile for ID:', id);

        // Récupérer le profil avec les données utilisateur
        const profile = await prisma.freelanceProfile.findUnique({
            where: { id: id },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                    }
                }
            }
        });

        console.log('[API] Profile found:', !!profile);

        if (!profile) {
            return NextResponse.json(
                { error: 'Ingénieur non trouvé' },
                { status: 404 }
            );
        }

        // Helper function to safely parse JSON fields
        const safeParseJSON = (field, fieldName = 'unknown') => {
            if (!field) return null;
            if (typeof field === 'string') {
                try {
                    return JSON.parse(field);
                } catch (e) {
                    console.error(`[API] JSON parse error for ${fieldName}:`, e.message);
                    return null;
                }
            }
            return field;
        };

        // Safely handle skills array - could be array or string
        let skills = [];
        try {
            if (Array.isArray(profile.skills)) {
                skills = profile.skills;
            } else if (typeof profile.skills === 'string') {
                // Try to parse if it's a JSON string
                try {
                    const parsed = JSON.parse(profile.skills);
                    skills = Array.isArray(parsed) ? parsed : [profile.skills];
                } catch {
                    // If not JSON, treat as comma-separated or single value
                    skills = profile.skills.includes(',')
                        ? profile.skills.split(',').map(s => s.trim())
                        : [profile.skills];
                }
            } else if (profile.skills) {
                skills = [String(profile.skills)];
            }
        } catch (e) {
            console.error('[API] Error processing skills:', e.message);
            skills = [];
        }

        const freelance = {
            id: profile.id,
            name: `${profile.user.firstName} ${profile.user.lastName}`,
            title: profile.title || '',
            bio: profile.bio || '',
            category: profile.category || '',
            image: profile.profileImage || null,
            rating: profile.averageRating || 0,
            reviews: profile.totalReviews || 0,
            hourlyRate: profile.hourlyRate || 0,
            dailyRate: profile.dailyRate || 0,
            skills: skills,
            availability: profile.availability || 'disponible',
            completedProjects: profile.completedProjects || 0,
            portfolio: safeParseJSON(profile.portfolio, 'portfolio') || [],
            experience: safeParseJSON(profile.experience, 'experience') || [],
            education: safeParseJSON(profile.education, 'education') || [],
            languages: safeParseJSON(profile.languages, 'languages') || [],
            certifications: safeParseJSON(profile.certifications, 'certifications') || [],
            socialLinks: safeParseJSON(profile.socialLinks, 'socialLinks') || {},
        };

        console.log('[API] Successfully prepared freelance data');
        return NextResponse.json({ freelance }, { status: 200 });

    } catch (error) {
        console.error('[API] Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        return NextResponse.json(
            {
                error: 'Une erreur est survenue',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            },
            { status: 500 }
        );
    }
}
