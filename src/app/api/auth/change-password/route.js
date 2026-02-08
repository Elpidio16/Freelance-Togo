import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import bcrypt from 'bcryptjs';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// POST /api/auth/change-password
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Non authentifié' },
                { status: 401 }
            );
        }

        await connectDB();

        const body = await request.json();
        const { currentPassword, newPassword } = body;

        // Validation
        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { error: 'Tous les champs sont requis' },
                { status: 400 }
            );
        }

        if (newPassword.length < 6) {
            return NextResponse.json(
                { error: 'Le nouveau mot de passe doit contenir au moins 6 caractères' },
                { status: 400 }
            );
        }

        // Récupérer l'utilisateur
        const user = await User.findById(session.user.id);

        if (!user) {
            return NextResponse.json(
                { error: 'Utilisateur non trouvé' },
                { status: 404 }
            );
        }

        // Vérifier le mot de passe actuel
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: 'Mot de passe actuel incorrect' },
                { status: 400 }
            );
        }

        // Hasher le nouveau mot de passe
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Mettre à jour le mot de passe
        user.password = hashedPassword;
        await user.save();

        return NextResponse.json({
            success: true,
            message: 'Mot de passe modifié avec succès',
        });

    } catch (error) {
        console.error('Erreur POST /api/auth/change-password:', error);
        return NextResponse.json(
            { error: 'Erreur lors du changement de mot de passe' },
            { status: 500 }
        );
    }
}
