import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

// POST /api/auth/reset-password
export async function POST(request) {
    try {
        const body = await request.json();
        const { token, password } = body;

        // Validation
        if (!token || !password) {
            return NextResponse.json(
                { error: 'Token et mot de passe requis' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Le mot de passe doit contenir au moins 6 caractères' },
                { status: 400 }
            );
        }

        // Rechercher le token de réinitialisation
        // Note: findUnique can only be used on unique fields. 'token' is unique in schema.
        const resetEntry = await prisma.passwordReset.findUnique({
            where: { token }
        });

        if (!resetEntry || resetEntry.used) {
            return NextResponse.json(
                { error: 'Token invalide ou déjà utilisé' },
                { status: 400 }
            );
        }

        // Vérifier l'expiration
        if (new Date() > resetEntry.expiresAt) {
            return NextResponse.json(
                { error: 'Ce lien a expiré. Veuillez faire une nouvelle demande.' },
                { status: 400 }
            );
        }

        // Rechercher l'utilisateur
        const user = await prisma.user.findUnique({
            where: { id: resetEntry.userId }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Utilisateur non trouvé' },
                { status: 404 }
            );
        }

        // Hasher le nouveau mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Mettre à jour le mot de passe
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                loginAttempts: 0,
                lockUntil: null, // Prisma uses null for undefined/null
            }
        });

        // Marquer le token comme utilisé
        await prisma.passwordReset.update({
            where: { id: resetEntry.id },
            data: { used: true }
        });

        // Optionnel: Envoyer un email de confirmation
        // await sendEmail({ ... });

        return NextResponse.json({
            success: true,
            message: 'Mot de passe réinitialisé avec succès',
        });

    } catch (error) {
        console.error('Erreur POST /api/auth/reset-password:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la réinitialisation du mot de passe' },
            { status: 500 }
        );
    }
}
