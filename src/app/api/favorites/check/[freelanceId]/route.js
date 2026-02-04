import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Favorite from '@/models/Favorite';

// GET /api/favorites/check/[freelanceId] - Check if freelancer is in favorites
export async function GET(request, { params }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ isFavorite: false }, { status: 200 });
        }

        if (session.user.role !== 'company') {
            return NextResponse.json({ isFavorite: false }, { status: 200 });
        }

        await connectDB();

        const freelanceId = params.freelanceId;

        const favorite = await Favorite.findOne({
            companyId: session.user.id,
            freelanceId,
        });

        return NextResponse.json({
            isFavorite: !!favorite,
            favoriteId: favorite?._id,
        }, { status: 200 });

    } catch (error) {
        console.error('Erreur GET /api/favorites/check:', error);
        return NextResponse.json(
            { isFavorite: false },
            { status: 200 }
        );
    }
}
