import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import { getNotificationPreferences, updateNotificationPreferences } from '@/lib/notifications';

// GET /api/notifications/preferences
export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Non authentifié' },
                { status: 401 }
            );
        }

        await connectDB();

        const preferences = await getNotificationPreferences(session.user.id);

        if (!preferences) {
            return NextResponse.json(
                { error: 'Préférences non trouvées' },
                { status: 404 }
            );
        }

        return NextResponse.json({ preferences });

    } catch (error) {
        console.error('Erreur GET /api/notifications/preferences:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

// PUT /api/notifications/preferences
export async function PUT(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Non authentifié' },
                { status: 401 }
            );
        }

        await connectDB();

        const body = await request.json();
        const { emailNotifications, emailPreferences, inAppNotifications, emailDigest } = body;

        const updates = {};
        if (typeof emailNotifications === 'boolean') {
            updates.emailNotifications = emailNotifications;
        }
        if (emailPreferences) {
            updates.emailPreferences = emailPreferences;
        }
        if (typeof inAppNotifications === 'boolean') {
            updates.inAppNotifications = inAppNotifications;
        }
        if (emailDigest) {
            updates.emailDigest = emailDigest;
        }

        const preferences = await updateNotificationPreferences(session.user.id, updates);

        if (!preferences) {
            return NextResponse.json(
                { error: 'Erreur lors de la mise à jour' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            preferences,
        });

    } catch (error) {
        console.error('Erreur PUT /api/notifications/preferences:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}
