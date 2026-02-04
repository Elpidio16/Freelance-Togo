import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import ProjectApplication from '@/models/ProjectApplication';
import Project from '@/models/Project';
import FreelanceProfile from '@/models/FreelanceProfile';

// GET /api/applications/my-applications - Get freelance's applications
export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        if (session.user.role !== 'freelance') {
            return NextResponse.json(
                { error: 'Accès refusé' },
                { status: 403 }
            );
        }

        await connectDB();

        const applications = await ProjectApplication.find({
            freelanceId: session.user.id,
        })
            .populate('projectId')
            .sort({ appliedAt: -1 });

        const applicationsWithDetails = applications.map((app) => ({
            _id: app._id,
            coverLetter: app.coverLetter,
            proposedRate: app.proposedRate,
            estimatedDuration: app.estimatedDuration,
            status: app.status,
            appliedAt: app.appliedAt,
            respondedAt: app.respondedAt,
            project: {
                _id: app.projectId._id,
                title: app.projectId.title,
                description: app.projectId.description,
                budget: app.projectId.budget,
                deadline: app.projectId.deadline,
                status: app.projectId.status,
            },
        }));

        return NextResponse.json(
            { applications: applicationsWithDetails },
            { status: 200 }
        );

    } catch (error) {
        console.error('Erreur GET /api/applications/my-applications:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des candidatures' },
            { status: 500 }
        );
    }
}
