import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Notification from '@/models/Notification';

// GET /api/notifications - Get user's notifications
export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        await connectDB();

        const { searchParams } = new URL(request.url);
        const unreadOnly = searchParams.get('unreadOnly') === 'true';
        const limit = parseInt(searchParams.get('limit') || '50');

        const query = { userId: session.user.id };
        if (unreadOnly) {
            query.read = false;
        }

        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .limit(limit);

        const unreadCount = await Notification.countDocuments({
            userId: session.user.id,
            read: false,
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

        await connectDB();

        const body = await request.json();
        const { userId, type, title, message, link, metadata } = body;

        if (!userId || !type || !title || !message) {
            return NextResponse.json(
                { error: 'Champs requis manquants' },
                { status: 400 }
            );
        }

        const notification = await Notification.create({
            userId,
            type,
            title,
            message,
            link: link || '',
            metadata: metadata || {},
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
