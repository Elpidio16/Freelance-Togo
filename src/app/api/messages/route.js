import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Message from '@/models/Message';
import Conversation from '@/models/Conversation';

// POST /api/messages - Send a message
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        await connectDB();

        const body = await request.json();
        const { conversationId, receiverId, content } = body;

        if (!conversationId || !receiverId || !content) {
            return NextResponse.json(
                { error: 'Tous les champs sont requis' },
                { status: 400 }
            );
        }

        // Verify conversation exists and user is participant
        const conversation = await Conversation.findById(conversationId);

        if (!conversation) {
            return NextResponse.json(
                { error: 'Conversation non trouvée' },
                { status: 404 }
            );
        }

        const isParticipant = conversation.participants.some(
            (p) => p.toString() === session.user.id
        );

        if (!isParticipant) {
            return NextResponse.json(
                { error: 'Accès refusé' },
                { status: 403 }
            );
        }

        // Create message
        const message = await Message.create({
            conversationId,
            senderId: session.user.id,
            receiverId,
            content: content.trim(),
        });

        // Update conversation
        conversation.lastMessage = content.substring(0, 100);
        conversation.lastMessageAt = new Date();
        conversation.incrementUnread(receiverId);
        await conversation.save();

        // Populate sender info
        await message.populate('senderId', 'firstName lastName');

        return NextResponse.json(
            {
                success: true,
                message: {
                    _id: message._id,
                    content: message.content,
                    senderId: message.senderId._id,
                    senderName: `${message.senderId.firstName} ${message.senderId.lastName}`,
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
