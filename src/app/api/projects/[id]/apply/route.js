import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

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

        const projectId = params.id;

        const project = await prisma.project.findUnique({
            where: { id: projectId }
        });

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
        // Prisma doesn't have a direct compound query utility like findOne({ projectId, freelanceId })
        // unless we defined a @@unique([projectId, freelanceId]) in schema.
        // In our schema: @@unique([projectId, freelanceId]) IS defined for ProjectApplication.
        // So we can use findUnique with the compound key, or findFirst.

        const existingApplication = await prisma.projectApplication.findUnique({
            where: {
                projectId_freelanceId: {
                    projectId: projectId,
                    freelanceId: session.user.id
                }
            }
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

        if (parseFloat(proposedRate) <= 0) {
            return NextResponse.json(
                { error: 'Le tarif proposé doit être supérieur à 0' },
                { status: 400 }
            );
        }

        // Create application
        const application = await prisma.projectApplication.create({
            data: {
                projectId,
                freelanceId: session.user.id,
                coverLetter,
                proposedRate: parseFloat(proposedRate),
                estimatedDuration,
                status: 'pending',
            }
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

        if (error.code === 'P2002') { // Unique constraint
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
