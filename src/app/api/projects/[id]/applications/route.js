import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

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

        // Verify ownership
        if (project.companyId !== session.user.id) {
            return NextResponse.json(
                { error: 'Vous n\'êtes pas autorisé à voir ces candidatures' },
                { status: 403 }
            );
        }

        // Get applications with freelance details
        const applications = await prisma.projectApplication.findMany({
            where: { projectId },
            include: {
                freelance: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        freelanceProfile: true
                    }
                }
            },
            orderBy: { appliedAt: 'desc' }
        });

        const applicationsWithProfiles = applications.map((app) => {
            const freelance = app.freelance;
            const freelanceProfile = freelance.freelanceProfile;

            return {
                _id: app.id,
                id: app.id,
                coverLetter: app.coverLetter,
                proposedRate: app.proposedRate,
                estimatedDuration: app.estimatedDuration,
                status: app.status,
                appliedAt: app.appliedAt,
                respondedAt: app.respondedAt,
                freelance: {
                    id: freelance.id,
                    name: `${freelance.firstName} ${freelance.lastName}`,
                    email: freelance.email,
                    title: freelanceProfile?.title || 'Freelance',
                    skills: freelanceProfile?.skills || [],
                    hourlyRate: freelanceProfile?.hourlyRate,
                    city: freelanceProfile?.city,
                    rating: freelanceProfile?.averageRating, // Correct field name
                },
            };
        });

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
