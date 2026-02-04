import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';
import Project from '@/models/Project';
import FreelanceProfile from '@/models/FreelanceProfile';

// POST /api/reviews - Create a review (company only, after project completion)
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        if (session.user.role !== 'company') {
            return NextResponse.json(
                { error: 'Seules les entreprises peuvent laisser des avis' },
                { status: 403 }
            );
        }

        await connectDB();

        const body = await request.json();
        const {
            projectId,
            freelanceId,
            rating,
            comment,
            skillsRating,
            wouldRecommend,
        } = body;

        // Validation
        if (!projectId || !freelanceId || !rating || !comment) {
            return NextResponse.json(
                { error: 'Tous les champs requis doivent être remplis' },
                { status: 400 }
            );
        }

        if (rating < 1 || rating > 5) {
            return NextResponse.json(
                { error: 'La note doit être entre 1 et 5' },
                { status: 400 }
            );
        }

        // Verify project exists and is completed
        const project = await Project.findById(projectId);

        if (!project) {
            return NextResponse.json(
                { error: 'Projet non trouvé' },
                { status: 404 }
            );
        }

        // Verify company owns the project
        if (project.companyId.toString() !== session.user.id) {
            return NextResponse.json(
                { error: 'Vous ne pouvez pas évaluer ce projet' },
                { status: 403 }
            );
        }

        // Verify project is completed
        if (project.status !== 'completed') {
            return NextResponse.json(
                { error: 'Le projet doit être terminé pour laisser un avis' },
                { status: 400 }
            );
        }

        // Check if review already exists
        const existingReview = await Review.findOne({ projectId });

        if (existingReview) {
            return NextResponse.json(
                { error: 'Vous avez déjà évalué ce projet' },
                { status: 400 }
            );
        }

        // Create review
        const review = await Review.create({
            projectId,
            freelanceId,
            companyId: session.user.id,
            rating,
            comment: comment.trim(),
            skillsRating: skillsRating || {},
            wouldRecommend: wouldRecommend !== undefined ? wouldRecommend : true,
        });

        // Update freelance profile rating
        const reviews = await Review.find({ freelanceId });
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

        await FreelanceProfile.findOneAndUpdate(
            { userId: freelanceId },
            {
                rating: Math.round(avgRating * 10) / 10, // Round to 1 decimal
                reviewCount: reviews.length,
            }
        );

        return NextResponse.json(
            {
                success: true,
                message: 'Avis publié avec succès',
                review,
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Erreur POST /api/reviews:', error);

        if (error.code === 11000) {
            return NextResponse.json(
                { error: 'Vous avez déjà évalué ce projet' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Erreur lors de la création de l\'avis' },
            { status: 500 }
        );
    }
}
