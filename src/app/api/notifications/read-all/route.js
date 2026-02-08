import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

// PUT /api/notifications/read-all - Mark all notifications as read
export async function PUT(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        await prisma.notification.updateMany({
            where: {
                userId: session.user.id,
                read: false,
            },
            data: {
                read: true,
                readAt: new Date(),
            }
        });

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
