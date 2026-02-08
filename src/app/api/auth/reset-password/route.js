import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import PasswordReset from '@/models/PasswordReset';

// POST /api/auth/reset-password
export async function POST(request) {
    try {
        await connectDB();

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
        const resetEntry = await PasswordReset.findOne({
            token,
            used: false,
        });

        if (!resetEntry) {
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
        const user = await User.findById(resetEntry.userId);

        if (!user) {
            return NextResponse.json(
                { error: 'Utilisateur non trouvé' },
                { status: 404 }
            );
        }

        // Hasher le nouveau mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Mettre à jour le mot de passe
        user.password = hashedPassword;
        user.loginAttempts = 0; // Réinitialiser les tentatives de connexion
        user.lockUntil = undefined; // Débloquer le compte si bloqué
        await user.save();

        // Marquer le token comme utilisé
        resetEntry.used = true;
        await resetEntry.save();

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
