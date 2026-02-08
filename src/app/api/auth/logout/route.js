import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function POST() {
    try {
        const session = await getServerSession(authOptions);

        if (session && session.user && session.user.email) {
            // Mettre à jour lastLogout pour invalider les tokens précédents
            await prisma.user.update({
                where: { email: session.user.email },
                data: { lastLogout: new Date() }
            });
            console.log(`🔒 Session invalidée pour ${session.user.email}`);
        }

        return NextResponse.json({ message: 'Déconnexion réussie' });
    } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
        return NextResponse.json({ error: 'Erreur technique' }, { status: 500 });
    }
}
