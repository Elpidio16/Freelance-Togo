import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';
import ProjectApplication from '@/models/ProjectApplication';
import FreelanceProfile from '@/models/FreelanceProfile';
import User from '@/models/User';

// GET /api/projects/[id]/applications - Get all applications for a project (company only)
export async function GET(request, { params }) {
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

        const projectId = params.id;
        const project = await Project.findById(projectId);

        if (!project) {
            return NextResponse.json(
                { error: 'Projet non trouvé' },
                { status: 404 }
            );
        }

        // Verify ownership
        if (project.companyId.toString() !== session.user.id) {
            return NextResponse.json(
                { error: 'Vous n\'êtes pas autorisé à voir ces candidatures' },
                { status: 403 }
            );
        }

        // Get applications with freelance details
        const applications = await ProjectApplication.find({ projectId })
            .populate('freelanceId', 'firstName lastName email')
            .sort({ appliedAt: -1 });

        const applicationsWithProfiles = await Promise.all(
            applications.map(async (app) => {
                const freelanceProfile = await FreelanceProfile.findOne({
                    userId: app.freelanceId._id,
                });

                return {
                    _id: app._id,
                    coverLetter: app.coverLetter,
                    proposedRate: app.proposedRate,
                    estimatedDuration: app.estimatedDuration,
                    status: app.status,
                    appliedAt: app.appliedAt,
                    respondedAt: app.respondedAt,
                    freelance: {
                        id: app.freelanceId._id,
                        name: `${app.freelanceId.firstName} ${app.freelanceId.lastName}`,
                        email: app.freelanceId.email,
                        title: freelanceProfile?.title || 'Freelance',
                        skills: freelanceProfile?.skills || [],
                        hourlyRate: freelanceProfile?.hourlyRate,
                        city: freelanceProfile?.city,
                        rating: freelanceProfile?.rating,
                    },
                };
            })
        );

        return NextResponse.json(
            { applications: applicationsWithProfiles },
            { status: 200 }
        );

    } catch (error) {
        console.error('Erreur GET /api/projects/[id]/applications:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des candidatures' },
            { status: 500 }
        );
    }
}
