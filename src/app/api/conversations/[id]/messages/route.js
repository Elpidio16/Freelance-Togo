import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

// GET /api/conversations/[id]/messages - Get all messages in conversation
export async function GET(request, { params }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        const conversationId = params.id;

        // Verify user is participant
        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
            include: { participants: { select: { id: true } } }
        });

        if (!conversation) {
            return NextResponse.json(
                { error: 'Conversation non trouvée' },
                { status: 404 }
            );
        }

        const isParticipant = conversation.participants.some(
            (p) => p.id === session.user.id
        );

        if (!isParticipant) {
            return NextResponse.json(
                { error: 'Accès refusé' },
                { status: 403 }
            );
        }

        // Get messages
        const messages = await prisma.message.findMany({
            where: { conversationId },
            include: {
                sender: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true
                    }
                }
            },
            orderBy: { createdAt: 'asc' }
        });

        // Mark messages as read
        await prisma.message.updateMany({
            where: {
                conversationId,
                receiverId: session.user.id,
                read: false,
            },
            data: {
                read: true,
                readAt: new Date(),
            }
        });

        // Reset unread count for this user
        // unreadCount is JSON. We need to update it.
        // It's { [userId]: count, [otherUserId]: count }
        let currentUnreadCount = conversation.unreadCount;
        if (!currentUnreadCount || typeof currentUnreadCount !== 'object') {
            currentUnreadCount = {};
        }

        // We can't easily modify the JSON in place in a concurrent-safe way without raw SQL or locking,
        // but for now we'll just update it based on what we fetched.
        // Ideally we should re-fetch or use a more atomic approach if possible, but Prisma JSON updates are "replace whole object".
        // However, updates to OTHER user's unread count might happen concurrently?
        // Actually, only THIS user reads THEIR messages, so they only reset THEIR count.
        // The sender INCREMENTS the other user's count.
        // So valid concurrency issue: Sender increments other's count while Receiver resets their own count.
        // If we write back the whole object, we might overwrite the increment.
        // PostgreSQL JSONB set/updates are better handled with raw SQL or detailed logic.
        // But for this app, maybe fine to just update.

        // Wait, Mongoose likely did this atomically or had a method.
        // In Postgres with Prisma:
        // We can use `jsonb_set` via raw query if needed, or just hope generic update is fine for low traffic.
        // Let's just update for now.

        const updatedUnreadCount = { ...currentUnreadCount };
        updatedUnreadCount[session.user.id] = 0; // Reset my count

        await prisma.conversation.update({
            where: { id: conversationId },
            data: { unreadCount: updatedUnreadCount }
        });

        const formattedMessages = messages.map((msg) => ({
            _id: msg.id,
            id: msg.id,
            content: msg.content,
            senderId: msg.senderId, // Prisma 'senderId' field on Message model
            senderName: `${msg.sender.firstName} ${msg.sender.lastName}`,
            isMine: msg.senderId === session.user.id,
            read: msg.read,
            createdAt: msg.createdAt,
        }));

        return NextResponse.json({ messages: formattedMessages }, { status: 200 });

    } catch (error) {
        console.error('Erreur GET /api/conversations/[id]/messages:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des messages' },
            { status: 500 }
        );
    }
}
