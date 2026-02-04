import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Favorite from '@/models/Favorite';

// DELETE /api/favorites/[id] - Remove from favorites
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

        const favoriteId = params.id;

        // Find and verify ownership
        const favorite = await Favorite.findById(favoriteId);

        if (!favorite) {
            return NextResponse.json(
                { error: 'Favori non trouvé' },
                { status: 404 }
            );
        }

        if (favorite.companyId.toString() !== session.user.id) {
            return NextResponse.json(
                { error: 'Accès refusé' },
                { status: 403 }
            );
        }

        await Favorite.findByIdAndDelete(favoriteId);

        return NextResponse.json(
            {
                success: true,
                message: 'Retiré des favoris',
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Erreur DELETE /api/favorites/[id]:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la suppression' },
            { status: 500 }
        );
    }
}

// PUT /api/favorites/[id] - Update favorite (pool or notes)
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

        const favoriteId = params.id;
        const body = await request.json();
        const { poolName, notes } = body;

        // Find and verify ownership
        const favorite = await Favorite.findById(favoriteId);

        if (!favorite) {
            return NextResponse.json(
                { error: 'Favori non trouvé' },
                { status: 404 }
            );
        }

        if (favorite.companyId.toString() !== session.user.id) {
            return NextResponse.json(
                { error: 'Accès refusé' },
                { status: 403 }
            );
        }

        // Update
        if (poolName !== undefined) favorite.poolName = poolName;
        if (notes !== undefined) favorite.notes = notes;

        await favorite.save();

        return NextResponse.json(
            {
                success: true,
                message: 'Favori mis à jour',
                favorite,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Erreur PUT /api/favorites/[id]:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la mise à jour' },
            { status: 500 }
        );
    }
}
