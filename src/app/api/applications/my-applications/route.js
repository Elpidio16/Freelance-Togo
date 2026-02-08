import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

// GET /api/applications/my-applications - Get freelance's applications
export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        // Technically, maybe companies also want to see applications? But route name suggests 'my-applications' for freelance.
        // Or if it handles both? The original code checked for 'freelance' role.
        if (session.user.role !== 'freelance') {
            return NextResponse.json(
                { error: 'Accès refusé' },
                { status: 403 }
            );
        }

        const applications = await prisma.projectApplication.findMany({
            where: {
                freelanceId: session.user.id,
            },
            include: {
                project: true
            },
            orderBy: {
                appliedAt: 'desc'
            }
        });

        const applicationsWithDetails = applications.map((app) => ({
            _id: app.id, // Compatibility
            id: app.id,
            coverLetter: app.coverLetter,
            proposedRate: app.proposedRate,
            estimatedDuration: app.estimatedDuration,
            status: app.status,
            appliedAt: app.appliedAt,
            respondedAt: app.respondedAt,
            project: {
                _id: app.project.id,
                title: app.project.title,
                description: app.project.description,
                // budget in Prisma is fields minBudget, maxBudget. Original returning object? 
                // Mongoose model had budget object. Prisma has flattened.
                // We should reconstruct if frontend expects object.
                budget: {
                    min: app.project.minBudget,
                    max: app.project.maxBudget,
                    currency: app.project.currency
                },
                deadline: app.project.deadline,
                status: app.project.status,
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
