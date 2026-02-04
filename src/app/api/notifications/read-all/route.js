import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Notification from '@/models/Notification';

// PUT /api/notifications/read-all - Mark all notifications as read
export async function PUT(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        await connectDB();

        await Notification.updateMany(
            {
                userId: session.user.id,
                read: false,
            },
            {
                read: true,
                readAt: new Date(),
            }
        );

        return NextResponse.json(
            {
                success: true,
                message: 'Toutes les notifications marquées comme lues',
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Erreur PUT /api/notifications/read-all:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la mise à jour' },
            { status: 500 }
        );
    }
}
