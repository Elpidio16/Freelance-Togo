import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

// POST /api/messages - Send a message
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        const body = await request.json();
        const { conversationId, receiverId, content } = body;

        if (!conversationId || !receiverId || !content) {
            return NextResponse.json(
                { error: 'Tous les champs sont requis' },
                { status: 400 }
            );
        }

        // Verify conversation exists and user is participant
        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
            include: { participants: true } // Need participants to check access
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

        // Create message
        const message = await prisma.message.create({
            data: {
                conversationId,
                senderId: session.user.id,
                receiverId,
                content: content.trim(),
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });

        // Update conversation manually for unreadCount
        // Fetch current unreadCount from conversation
        let newUnreadCount = conversation.unreadCount || {};
        if (typeof newUnreadCount !== 'object') {
            try { newUnreadCount = JSON.parse(newUnreadCount); } catch (e) { }
        }

        // Ensure newUnreadCount is an object
        if (!newUnreadCount || typeof newUnreadCount !== 'object') newUnreadCount = {};

        const currentCount = (newUnreadCount[receiverId] || 0) + 1;
        newUnreadCount[receiverId] = currentCount;

        await prisma.conversation.update({
            where: { id: conversationId },
            data: {
                lastMessage: content.substring(0, 100),
                lastMessageAt: new Date(),
                unreadCount: newUnreadCount
            }
        });

        return NextResponse.json(
            {
                success: true,
                message: {
                    _id: message.id, // Compatibility
                    id: message.id,
                    content: message.content,
                    senderId: message.senderId,
                    senderName: `${message.sender.firstName} ${message.sender.lastName}`,
                    isMine: true,
                    createdAt: message.createdAt,
                },
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Erreur POST /api/messages:', error);
        return NextResponse.json(
            { error: 'Erreur lors de l\'envoi du message' },
            { status: 500 }
        );
    }
}
