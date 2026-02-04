import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';
import ProjectApplication from '@/models/ProjectApplication';
import CompanyProfile from '@/models/CompanyProfile';

export async function GET(request, { params }) {
    try {
        await connectDB();

        const projectId = params.id;

        const project = await Project.findById(projectId)
            .populate('companyId', 'firstName lastName email');

        if (!project) {
            return NextResponse.json(
                { error: 'Projet non trouvé' },
                { status: 404 }
            );
        }

        // Get company profile
        const companyProfile = await CompanyProfile.findOne({
            userId: project.companyId._id
        });

        // Count applications
        const applicationCount = await ProjectApplication.countDocuments({
            projectId: project._id,
        });

        const projectData = {
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
            applicationCount,
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
                { error: 'Vous n\'êtes pas autorisé à modifier ce projet' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const updates = {};

        // Only allow certain fields to be updated
        const allowedFields = ['title', 'description', 'skills', 'budget', 'deadline', 'location', 'experienceLevel', 'status'];

        for (const field of allowedFields) {
            if (body[field] !== undefined) {
                updates[field] = body[field];
            }
        }

        const updatedProject = await Project.findByIdAndUpdate(
            projectId,
            updates,
            { new: true }
        );

        return NextResponse.json(
            {
                success: true,
                message: 'Projet mis à jour',
                project: updatedProject,
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
                { error: 'Vous n\'êtes pas autorisé à supprimer ce projet' },
                { status: 403 }
            );
        }

        // Delete project and all applications
        await ProjectApplication.deleteMany({ projectId: project._id });
        await Project.findByIdAndDelete(projectId);

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
