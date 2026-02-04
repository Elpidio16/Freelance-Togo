import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Message from '@/models/Message';
import Conversation from '@/models/Conversation';

// GET /api/conversations/[id]/messages - Get all messages in conversation
export async function GET(request, { params }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        await connectDB();

        const conversationId = params.id;

        // Verify user is participant
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

        // Get messages
        const messages = await Message.find({ conversationId })
            .populate('senderId', 'firstName lastName')
            .sort({ createdAt: 1 });

        // Mark messages as read
        await Message.updateMany(
            {
                conversationId,
                receiverId: session.user.id,
                read: false,
            },
            {
                read: true,
                readAt: new Date(),
            }
        );

        // Reset unread count
        conversation.resetUnread(session.user.id);
        await conversation.save();

        const formattedMessages = messages.map((msg) => ({
            _id: msg._id,
            content: msg.content,
            senderId: msg.senderId._id,
            senderName: `${msg.senderId.firstName} ${msg.senderId.lastName}`,
            isMine: msg.senderId._id.toString() === session.user.id,
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
