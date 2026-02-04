import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Conversation from '@/models/Conversation';
import User from '@/models/User';

// GET /api/conversations - Get all user's conversations
export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        await connectDB();

        const conversations = await Conversation.find({
            participants: session.user.id,
        })
            .populate('participants', 'firstName lastName email role')
            .populate('projectId', 'title')
            .sort({ lastMessageAt: -1 });

        const conversationsWithDetails = conversations.map((conv) => {
            // Get the other participant
            const otherParticipant = conv.participants.find(
                (p) => p._id.toString() !== session.user.id
            );

            return {
                _id: conv._id,
                otherUser: {
                    id: otherParticipant._id,
                    name: `${otherParticipant.firstName} ${otherParticipant.lastName}`,
                    email: otherParticipant.email,
                    role: otherParticipant.role,
                },
                project: conv.projectId ? {
                    id: conv.projectId._id,
                    title: conv.projectId.title,
                } : null,
                lastMessage: conv.lastMessage,
                lastMessageAt: conv.lastMessageAt,
                unreadCount: conv.getUnreadCount(session.user.id),
            };
        });

        return NextResponse.json({ conversations: conversationsWithDetails }, { status: 200 });

    } catch (error) {
        console.error('Erreur GET /api/conversations:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des conversations' },
            { status: 500 }
        );
    }
}

// POST /api/conversations - Create or get conversation
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        await connectDB();

        const body = await request.json();
        const { otherUserId, projectId } = body;

        if (!otherUserId) {
            return NextResponse.json(
                { error: 'otherUserId est requis' },
                { status: 400 }
            );
        }

        // Check if conversation already exists
        const existingConversation = await Conversation.findOne({
            participants: { $all: [session.user.id, otherUserId] },
        });

        if (existingConversation) {
            return NextResponse.json(
                { conversation: existingConversation },
                { status: 200 }
            );
        }

        // Create new conversation
        const conversation = await Conversation.create({
            participants: [session.user.id, otherUserId],
            projectId: projectId || null,
            unreadCount: new Map([
                [session.user.id, 0],
                [otherUserId, 0],
            ]),
        });

        return NextResponse.json(
            {
                success: true,
                message: 'Conversation créée',
                conversation,
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Erreur POST /api/conversations:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la création de la conversation' },
            { status: 500 }
        );
    }
}
