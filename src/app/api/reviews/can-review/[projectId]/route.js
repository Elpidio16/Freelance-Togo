import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';
import Project from '@/models/Project';

// GET /api/reviews/can-review/[projectId] - Check if company can review a project
export async function GET(request, { params }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        if (session.user.role !== 'company') {
            return NextResponse.json({ canReview: false }, { status: 200 });
        }

        await connectDB();

        const projectId = params.projectId;

        // Check if project exists
        const project = await Project.findById(projectId);

        if (!project) {
            return NextResponse.json({ canReview: false }, { status: 200 });
        }

        // Check if company owns project
        if (project.companyId.toString() !== session.user.id) {
            return NextResponse.json({ canReview: false }, { status: 200 });
        }

        // Check if project is completed
        if (project.status !== 'completed') {
            return NextResponse.json({
                canReview: false,
                reason: 'Le projet doit être terminé',
            }, { status: 200 });
        }

        // Check if review already exists
        const existingReview = await Review.findOne({ projectId });

        if (existingReview) {
            return NextResponse.json({
                canReview: false,
                reason: 'Vous avez déjà évalué ce projet',
            }, { status: 200 });
        }

        return NextResponse.json({
            canReview: true,
            project: {
                id: project._id,
                title: project.title,
                freelanceId: project.acceptedFreelanceId,
            },
        }, { status: 200 });

    } catch (error) {
        console.error('Erreur GET /api/reviews/can-review:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la vérification' },
            { status: 500 }
        );
    }
}
