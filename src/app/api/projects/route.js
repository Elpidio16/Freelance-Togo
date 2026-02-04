import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';
import CompanyProfile from '@/models/CompanyProfile';

// GET /api/projects - List all projects with filters
export async function GET(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const skills = searchParams.get('skills')?.split(',').filter(Boolean);
        const minBudget = searchParams.get('minBudget');
        const maxBudget = searchParams.get('maxBudget');
        const location = searchParams.get('location');
        const projectType = searchParams.get('projectType');
        const status = searchParams.get('status') || 'open';
        const search = searchParams.get('search');

        // Build query
        const query = {};

        if (status) {
            query.status = status;
        }

        if (skills && skills.length > 0) {
            query.skills = { $in: skills };
        }

        if (minBudget || maxBudget) {
            query['budget.min'] = {};
            if (minBudget) query['budget.min'].$gte = parseInt(minBudget);
            if (maxBudget) query['budget.max'] = { $lte: parseInt(maxBudget) };
        }

        if (location && location !== 'all') {
            query.location = location;
        }

        if (projectType) {
            query.projectType = projectType;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        const projects = await Project.find(query)
            .populate('companyId', 'firstName lastName')
            .sort({ createdAt: -1 })
            .limit(50);

        // Get company profiles for each project
        const projectsWithCompany = await Promise.all(
            projects.map(async (project) => {
                const companyProfile = await CompanyProfile.findOne({
                    userId: project.companyId._id
                });

                return {
                    _id: project._id,
                    title: project.title,
                    description: project.description,
                    skills: project.skills,
                    budget: project.budget,
                    projectType: project.projectType,
                    deadline: project.deadline,
                    status: project.status,
                    location: project.location,
                    experienceLevel: project.experienceLevel,
                    createdAt: project.createdAt,
                    company: {
                        name: companyProfile?.companyName || 'Entreprise',
                        location: companyProfile?.location,
                    },
                };
            })
        );

        return NextResponse.json({ projects: projectsWithCompany }, { status: 200 });

    } catch (error) {
        console.error('Erreur GET /api/projects:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des projets' },
            { status: 500 }
        );
    }
}

// POST /api/projects - Create new project (company only)
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        if (session.user.role !== 'company') {
            return NextResponse.json(
                { error: 'Seules les entreprises peuvent créer des projets' },
                { status: 403 }
            );
        }

        await connectDB();

        const body = await request.json();
        const {
            title,
            description,
            skills,
            budget,
            projectType,
            deadline,
            location,
            experienceLevel,
        } = body;

        // Validation
        if (!title || !description || !skills || !budget || !projectType || !deadline) {
            return NextResponse.json(
                { error: 'Tous les champs requis doivent être remplis' },
                { status: 400 }
            );
        }

        if (skills.length === 0) {
            return NextResponse.json(
                { error: 'Au moins une compétence est requise' },
                { status: 400 }
            );
        }

        if (budget.min <= 0 || budget.max <= 0 || budget.min > budget.max) {
            return NextResponse.json(
                { error: 'Budget invalide' },
                { status: 400 }
            );
        }

        // Create project
        const project = await Project.create({
            companyId: session.user.id,
            title,
            description,
            skills,
            budget,
            projectType,
            deadline: new Date(deadline),
            location: location || 'Remote',
            experienceLevel: experienceLevel || 'any',
            status: 'open',
        });

        return NextResponse.json(
            {
                success: true,
                message: 'Projet créé avec succès',
                project,
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Erreur POST /api/projects:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la création du projet' },
            { status: 500 }
        );
    }
}
