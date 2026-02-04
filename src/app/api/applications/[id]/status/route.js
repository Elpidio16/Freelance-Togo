import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import ProjectApplication from '@/models/ProjectApplication';
import Project from '@/models/Project';

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

        await connectDB();

        const applicationId = params.id;
        const application = await ProjectApplication.findById(applicationId)
            .populate('projectId');

        if (!application) {
            return NextResponse.json(
                { error: 'Candidature non trouvée' },
                { status: 404 }
            );
        }

        const project = application.projectId;

        // Verify ownership
        if (project.companyId.toString() !== session.user.id) {
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
        application.status = status;
        application.respondedAt = new Date();
        await application.save();

        // If accepted, update project status and reject other applications
        if (status === 'accepted') {
            await Project.findByIdAndUpdate(project._id, {
                status: 'in-progress',
                acceptedFreelanceId: application.freelanceId,
            });

            // Reject all other pending applications
            await ProjectApplication.updateMany(
                {
                    projectId: project._id,
                    _id: { $ne: applicationId },
                    status: 'pending',
                },
                {
                    status: 'rejected',
                    respondedAt: new Date(),
                }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: `Candidature ${status === 'accepted' ? 'acceptée' : 'refusée'}`,
                application,
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
