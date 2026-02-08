import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
    try {
        const projectId = params.id;

        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: {
                company: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                        companyProfile: true
                    }
                },
                _count: {
                    select: { applications: true }
                }
            }
        });

        if (!project) {
            return NextResponse.json(
                { error: 'Projet non trouvé' },
                { status: 404 }
            );
        }

        const companyProfile = project.company.companyProfile;

        const projectData = {
            _id: project.id,
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
            applicationCount: project._count.applications,
            company: {
                name: companyProfile?.companyName || 'Entreprise',
                description: companyProfile?.description,
                location: companyProfile?.location,
                sector: companyProfile?.sector,
            },
        };

        return NextResponse.json({ project: projectData }, { status: 200 });

    } catch (error) {
        console.error('Erreur GET /api/projects/[id]:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération du projet' },
            { status: 500 }
        );
    }
}

// PUT /api/projects/[id] - Update project (company only)
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
                { error: 'Vous n\'êtes pas autorisé à modifier ce projet' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const updates = {}; // Data object for Prisma update

        // Only allow certain fields to be updated
        const allowedFields = ['title', 'description', 'skills', 'budget', 'deadline', 'location', 'experienceLevel', 'status'];

        for (const field of allowedFields) {
            if (body[field] !== undefined) {
                if (field === 'budget') {
                    updates.minBudget = parseFloat(body.budget.min);
                    updates.maxBudget = parseFloat(body.budget.max);
                    updates.currency = body.budget.currency || 'FCFA';
                } else if (field === 'deadline') {
                    updates.deadline = new Date(body.deadline);
                } else {
                    updates[field] = body[field];
                }
            }
        }

        const updatedProject = await prisma.project.update({
            where: { id: projectId },
            data: updates,
        });

        // Format response
        const formattedProject = {
            ...updatedProject,
            budget: {
                min: updatedProject.minBudget,
                max: updatedProject.maxBudget,
                currency: updatedProject.currency
            }
        };

        return NextResponse.json(
            {
                success: true,
                message: 'Projet mis à jour',
                project: formattedProject,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Erreur PUT /api/projects/[id]:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la mise à jour du projet' },
            { status: 500 }
        );
    }
}

// DELETE /api/projects/[id] - Delete project (company only)
export async function DELETE(request, { params }) {
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
                { error: 'Vous n\'êtes pas autorisé à supprimer ce projet' },
                { status: 403 }
            );
        }

        // Delete project (cascade delete will handle applications and reviews if configured in schema)
        // In our schema: 
        // ProjectApplication -> onDelete: Cascade
        // Review -> onDelete: Cascade
        await prisma.project.delete({
            where: { id: projectId }
        });

        return NextResponse.json(
            {
                success: true,
                message: 'Projet supprimé',
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Erreur DELETE /api/projects/[id]:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la suppression du projet' },
            { status: 500 }
        );
    }
}
