import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

// GET /api/notifications - Get user's notifications
export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const unreadOnly = searchParams.get('unreadOnly') === 'true';
        const limit = parseInt(searchParams.get('limit') || '50');

        const where = { userId: session.user.id };
        if (unreadOnly) {
            where.read = false;
        }

        const notifications = await prisma.notification.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: limit
        });

        const unreadCount = await prisma.notification.count({
            where: {
                userId: session.user.id,
                read: false,
            }
        });

        return NextResponse.json({
            notifications,
            unreadCount,
        }, { status: 200 });

    } catch (error) {
        console.error('Erreur GET /api/notifications:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des notifications' },
            { status: 500 }
        );
    }
}

// POST /api/notifications - Create a notification
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        const body = await request.json();
        const { userId, type, title, message, link, metadata } = body;

        if (!userId || !type || !title || !message) {
            return NextResponse.json(
                { error: 'Champs requis manquants' },
                { status: 400 }
            );
        }

        const notification = await prisma.notification.create({
            data: {
                userId,
                type,
                title,
                message,
                link: link || '',
                metadata: metadata || {}, // Prisma handles JSON automatically
                read: false
            }
        });

        return NextResponse.json(
            {
                success: true,
                notification,
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Erreur POST /api/notifications:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la création de la notification' },
            { status: 500 }
        );
    }
}
