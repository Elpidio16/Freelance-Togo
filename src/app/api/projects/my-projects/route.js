import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

// GET /api/projects/my-projects - Get company's own projects
export async function GET(request) {
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

        const projects = await prisma.project.findMany({
            where: { companyId: session.user.id },
            orderBy: { createdAt: 'desc' }
        });

        // Format if necessary (e.g. reconstruct budget object)
        const formattedProjects = projects.map(p => ({
            ...p,
            budget: {
                min: p.minBudget,
                max: p.maxBudget,
                currency: p.currency
            }
        }));

        return NextResponse.json({ projects: formattedProjects }, { status: 200 });

    } catch (error) {
        console.error('Erreur GET /api/projects/my-projects:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des projets' },
            { status: 500 }
        );
    }
}
