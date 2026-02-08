import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

// PUT /api/applications/[id]/status - Update application status (company only)
export async function PUT(request, { params }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        if (session.user.role !== 'company') {
            return NextResponse.json(
                { error: 'Accès refusé' },
                { status: 403 }
            );
        }

        const applicationId = params.id;

        // Find application with project details
        const application = await prisma.projectApplication.findUnique({
            where: { id: applicationId },
            include: { project: true }
        });

        if (!application) {
            return NextResponse.json(
                { error: 'Candidature non trouvée' },
                { status: 404 }
            );
        }

        const project = application.project;

        // Verify ownership
        if (project.companyId !== session.user.id) {
            return NextResponse.json(
                { error: 'Vous n\'êtes pas autorisé à modifier cette candidature' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { status } = body;

        if (!['accepted', 'rejected'].includes(status)) {
            return NextResponse.json(
                { error: 'Statut invalide' },
                { status: 400 }
            );
        }

        // Update application
        // Transaction needed if status is 'accepted' to update project and reject others?
        // Prisma transaction:

        if (status === 'accepted') {
            await prisma.$transaction([
                // Update this application
                prisma.projectApplication.update({
                    where: { id: applicationId },
                    data: {
                        status: 'accepted',
                        respondedAt: new Date()
                    }
                }),
                // Update project
                prisma.project.update({
                    where: { id: project.id },
                    data: {
                        status: 'in-progress',
                        acceptedFreelanceId: application.freelanceId
                    }
                }),
                // Reject others
                prisma.projectApplication.updateMany({
                    where: {
                        projectId: project.id,
                        id: { not: applicationId },
                        status: 'pending'
                    },
                    data: {
                        status: 'rejected',
                        respondedAt: new Date()
                    }
                })
            ]);
        } else {
            // Just reject this one
            await prisma.projectApplication.update({
                where: { id: applicationId },
                data: {
                    status: 'rejected',
                    respondedAt: new Date()
                }
            });
        }

        // Fetch updated application to return? Or just return success message.
        // Frontend might expect updated application object.
        const updatedApplication = await prisma.projectApplication.findUnique({
            where: { id: applicationId }
        });

        return NextResponse.json(
            {
                success: true,
                message: `Candidature ${status === 'accepted' ? 'acceptée' : 'refusée'}`,
                application: updatedApplication,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Erreur PUT /api/applications/[id]/status:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la mise à jour de la candidature' },
            { status: 500 }
        );
    }
}
