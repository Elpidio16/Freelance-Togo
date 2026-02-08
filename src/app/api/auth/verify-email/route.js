import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendWelcomeEmail } from '@/lib/email';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get('token');

        if (!token) {
            return NextResponse.json(
                { error: 'Token manquant' },
                { status: 400 }
            );
        }

        // Trouver le token de vérification
        const verificationToken = await prisma.verificationToken.findUnique({
            where: { token }
        });

        if (!verificationToken) {
            return NextResponse.json(
                { error: 'Token invalide ou expiré' },
                { status: 400 }
            );
        }

        // Vérifier si le token n'a pas expiré
        if (new Date() > verificationToken.expires) {
            await prisma.verificationToken.delete({
                where: { token }
            });
            return NextResponse.json(
                { error: 'Token expiré. Veuillez demander un nouveau lien de vérification.' },
                { status: 400 }
            );
        }

        // Trouver et mettre à jour l'utilisateur
        // Note: verificationToken stores 'identifier' as email
        const user = await prisma.user.findUnique({
            where: { email: verificationToken.identifier }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Utilisateur introuvable' },
                { status: 404 }
            );
        }

        if (user.isVerified) {
            return NextResponse.json(
                { message: 'Email déjà vérifié. Vous pouvez vous connecter.' },
                { status: 200 }
            );
        }

        // Activer le compte
        await prisma.user.update({
            where: { id: user.id },
            data: {
                isVerified: true,
                emailVerified: new Date(),
            }
        });

        // Supprimer le token utilisé
        await prisma.verificationToken.delete({
            where: { token }
        });

        // Envoyer l'email de bienvenue
        await sendWelcomeEmail(user.email, user.firstName);

        return NextResponse.json(
            {
                success: true,
                message: '✅ Email vérifié avec succès ! Vous pouvez maintenant vous connecter.',
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Erreur lors de la vérification:', error);
        return NextResponse.json(
            { error: 'Une erreur est survenue lors de la vérification' },
            { status: 500 }
        );
    }
}
