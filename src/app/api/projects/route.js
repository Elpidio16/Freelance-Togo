import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

// GET /api/projects - List all projects with filters
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const skills = searchParams.get('skills')?.split(',').filter(Boolean);
        const minBudget = searchParams.get('minBudget');
        const maxBudget = searchParams.get('maxBudget');
        const location = searchParams.get('location');
        const projectType = searchParams.get('projectType');
        const status = searchParams.get('status') || 'open';
        const search = searchParams.get('search');

        // Build query
        const where = {};

        if (status) {
            where.status = status;
        }

        if (skills && skills.length > 0) {
            where.skills = { hasSome: skills };
        }

        // Budget filtering
        // The logic seems to be: Project's min budget >= filter min budget
        // Project's max budget <= filter max budget
        if (minBudget || maxBudget) {
            if (minBudget) where.minBudget = { gte: parseFloat(minBudget) };
            if (maxBudget) where.maxBudget = { lte: parseFloat(maxBudget) };
        }

        if (location && location !== 'all') {
            where.location = location;
        }

        if (projectType) {
            where.projectType = projectType;
        }

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { skills: { has: search } }
            ];
        }

        const projects = await prisma.project.findMany({
            where,
            include: {
                company: {
                    select: {
                        firstName: true,
                        lastName: true,
                        companyProfile: {
                            select: {
                                companyName: true,
                                location: true,
                                logo: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 50
        });

        // Format response to match expected frontend structure if needed, 
        // or just return projects. The frontend expects 'company' object with name/location.
        const formattedProjects = projects.map(project => ({
            _id: project.id, // Keep _id for compatibility if frontend uses it, otherwise migrate frontend to id
            id: project.id,
            title: project.title,
            description: project.description,
            skills: project.skills,
            budget: {
                min: project.minBudget,
                max: project.maxBudget,
                currency: project.currency
            },
            projectType: project.projectType,
            deadline: project.deadline,
            status: project.status,
            location: project.location,
            experienceLevel: project.experienceLevel,
            createdAt: project.createdAt,
            company: {
                name: project.company.companyProfile?.companyName || 'Entreprise',
                location: project.company.companyProfile?.location || project.company.companyProfile?.location, // fallback?
                logo: project.company.companyProfile?.logo
            },
        }));

        return NextResponse.json({ projects: formattedProjects }, { status: 200 });

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

        // Check verification? session.user.role comes from token.
        // We can double check DB if critical.
        if (session.user.role !== 'company') {
            return NextResponse.json(
                { error: 'Seules les entreprises peuvent créer des projets' },
                { status: 403 }
            );
        }

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
        const project = await prisma.project.create({
            data: {
                companyId: session.user.id,
                title,
                description,
                skills,
                minBudget: parseFloat(budget.min),
                maxBudget: parseFloat(budget.max),
                currency: budget.currency || 'FCFA',
                projectType,
                deadline: new Date(deadline),
                location: location || 'Remote',
                experienceLevel: experienceLevel || 'any',
                status: 'open',
            }
        });

        // Format response
        const formattedProject = {
            ...project,
            budget: {
                min: project.minBudget,
                max: project.maxBudget,
                currency: project.currency
            }
        };

        return NextResponse.json(
            {
                success: true,
                message: 'Projet créé avec succès',
                project: formattedProject,
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
