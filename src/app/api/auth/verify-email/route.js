import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import VerificationToken from '@/models/VerificationToken';
import { sendWelcomeEmail } from '@/lib/email';

export async function GET(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const token = searchParams.get('token');

        if (!token) {
            return NextResponse.json(
                { error: 'Token manquant' },
                { status: 400 }
            );
        }

        // Trouver le token de vérification
        const verificationToken = await VerificationToken.findOne({ token });

        if (!verificationToken) {
            return NextResponse.json(
                { error: 'Token invalide ou expiré' },
                { status: 400 }
            );
        }

        // Vérifier si le token n'a pas expiré
        if (new Date() > verificationToken.expires) {
            await VerificationToken.deleteOne({ _id: verificationToken._id });
            return NextResponse.json(
                { error: 'Token expiré. Veuillez demander un nouveau lien de vérification.' },
                { status: 400 }
            );
        }

        // Trouver et mettre à jour l'utilisateur
        const user = await User.findOne({ email: verificationToken.email });

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
        user.isVerified = true;
        user.emailVerified = new Date();
        await user.save();

        // Supprimer le token utilisé
        await VerificationToken.deleteOne({ _id: verificationToken._id });

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
