import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';
import ProjectApplication from '@/models/ProjectApplication';
import FreelanceProfile from '@/models/FreelanceProfile';

// POST /api/projects/[id]/apply - Apply to project (freelance only)
export async function POST(request, { params }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        if (session.user.role !== 'freelance') {
            return NextResponse.json(
                { error: 'Seuls les freelances peuvent postuler' },
                { status: 403 }
            );
        }

        await connectDB();

        const projectId = params.id;
        const project = await Project.findById(projectId);

        if (!project) {
            return NextResponse.json(
                { error: 'Projet non trouvé' },
                { status: 404 }
            );
        }

        if (project.status !== 'open') {
            return NextResponse.json(
                { error: 'Ce projet n\'accepte plus de candidatures' },
                { status: 400 }
            );
        }

        // Check if already applied
        const existingApplication = await ProjectApplication.findOne({
            projectId,
            freelanceId: session.user.id,
        });

        if (existingApplication) {
            return NextResponse.json(
                { error: 'Vous avez déjà postulé à ce projet' },
                { status: 400 }
            );
        }

        const body = await request.json();
        const { coverLetter, proposedRate, estimatedDuration } = body;

        // Validation
        if (!coverLetter || !proposedRate || !estimatedDuration) {
            return NextResponse.json(
                { error: 'Tous les champs sont requis' },
                { status: 400 }
            );
        }

        if (proposedRate <= 0) {
            return NextResponse.json(
                { error: 'Le tarif proposé doit être supérieur à 0' },
                { status: 400 }
            );
        }

        // Create application
        const application = await ProjectApplication.create({
            projectId,
            freelanceId: session.user.id,
            coverLetter,
            proposedRate,
            estimatedDuration,
            status: 'pending',
        });

        return NextResponse.json(
            {
                success: true,
                message: 'Candidature envoyée avec succès',
                application,
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Erreur POST /api/projects/[id]/apply:', error);

        if (error.code === 11000) {
            return NextResponse.json(
                { error: 'Vous avez déjà postulé à ce projet' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Erreur lors de l\'envoi de la candidature' },
            { status: 500 }
        );
    }
}
