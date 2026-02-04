import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Notification from '@/models/Notification';

// PUT /api/notifications/[id]/read - Mark notification as read
export async function PUT(request, { params }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        await connectDB();

        const notificationId = params.id;

        // Find and verify ownership
        const notification = await Notification.findById(notificationId);

        if (!notification) {
            return NextResponse.json(
                { error: 'Notification non trouvée' },
                { status: 404 }
            );
        }

        if (notification.userId.toString() !== session.user.id) {
            return NextResponse.json(
                { error: 'Accès refusé' },
                { status: 403 }
            );
        }

        // Mark as read
        notification.read = true;
        notification.readAt = new Date();
        await notification.save();

        return NextResponse.json(
            {
                success: true,
                notification,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Erreur PUT /api/notifications/[id]/read:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la mise à jour' },
            { status: 500 }
        );
    }
}
