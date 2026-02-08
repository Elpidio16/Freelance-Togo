import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

// GET /api/conversations - Get all user's conversations
export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        const conversations = await prisma.conversation.findMany({
            where: {
                participants: {
                    some: {
                        id: session.user.id
                    }
                }
            },
            include: {
                participants: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        role: true,
                        image: true
                    }
                },
                project: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            },
            orderBy: {
                lastMessageAt: 'desc'
            }
        });

        const conversationsWithDetails = conversations.map((conv) => {
            // Get the other participant
            const otherParticipant = conv.participants.find(
                (p) => p.id !== session.user.id
            );

            // Handle unreadCount (JSON)
            let unread = 0;
            if (conv.unreadCount && typeof conv.unreadCount === 'object') {
                unread = conv.unreadCount[session.user.id] || 0;
            }

            return {
                _id: conv.id,
                id: conv.id,
                otherUser: otherParticipant ? {
                    id: otherParticipant.id,
                    name: `${otherParticipant.firstName} ${otherParticipant.lastName}`,
                    email: otherParticipant.email,
                    role: otherParticipant.role,
                    image: otherParticipant.image
                } : null,
                project: conv.project ? {
                    id: conv.project.id,
                    title: conv.project.title,
                } : null,
                lastMessage: conv.lastMessage,
                lastMessageAt: conv.lastMessageAt,
                unreadCount: unread,
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

        const body = await request.json();
        const { otherUserId, projectId } = body;

        if (!otherUserId) {
            return NextResponse.json(
                { error: 'otherUserId est requis' },
                { status: 400 }
            );
        }

        // Check if conversation already exists between these two users
        // Prisma: findFirst where participants has every [session.user.id, otherUserId]
        // This is tricky in Prisma many-to-many.
        // Alternative: Find conversations where user 1 is participant AND user 2 is participant.
        const existingConversation = await prisma.conversation.findFirst({
            where: {
                AND: [
                    { participants: { some: { id: session.user.id } } },
                    { participants: { some: { id: otherUserId } } }
                ]
            }
        });

        if (existingConversation) {
            // If projecId is provided and different? Usually conversation is unique per pair regardless of project, 
            // but schema has projectId. If existing conversation has different project, do we create new?
            // Mongoose logic: `participants: { $all: ... }` implies finding ONE convo with these participants.
            // It ignored projectId for uniqueness check in original code, just returned if found.
            return NextResponse.json(
                { conversation: { ...existingConversation, _id: existingConversation.id, id: existingConversation.id } },
                { status: 200 }
            );
        }

        // Create new conversation
        const conversation = await prisma.conversation.create({
            data: {
                participants: {
                    connect: [
                        { id: session.user.id },
                        { id: otherUserId }
                    ]
                },
                projectId: projectId || null,
                unreadCount: {
                    [session.user.id]: 0,
                    [otherUserId]: 0
                },
                lastMessage: '',
                lastMessageAt: new Date() // Default
            }
        });

        return NextResponse.json(
            {
                success: true,
                message: 'Conversation créée',
                conversation: { ...conversation, _id: conversation.id, id: conversation.id },
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
