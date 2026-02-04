import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';

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

        await connectDB();

        const projects = await Project.find({ companyId: session.user.id })
            .sort({ createdAt: -1 });

        return NextResponse.json({ projects }, { status: 200 });

    } catch (error) {
        console.error('Erreur GET /api/projects/my-projects:', error);
        return NextResponse.json(
            { error: 'Erreur lordella récupération des projets' },
            { status: 500 }
        );
    }
}
