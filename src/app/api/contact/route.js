import { NextResponse } from 'next/server';
import { sendContactEmail } from '@/lib/email';

export async function POST(request) {
    try {
        const body = await request.json();
        const {
            name,
            email,
            phone,
            subject,
            message,
            freelanceId,
            freelanceName,
        } = body;

        // Validation
        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { error: 'Tous les champs requis doivent être remplis' },
                { status: 400 }
            );
        }

        // Validation email basique
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Email invalide' },
                { status: 400 }
            );
        }

        // Envoyer l'email au freelance
        const emailResult = await sendContactEmail({
            from: {
                name,
                email,
                phone,
            },
            to: freelanceName,
            subject,
            message,
        });

        if (!emailResult.success) {
            console.error('Erreur envoi email:', emailResult.error);
            return NextResponse.json(
                { error: 'Erreur lors de l\'envoi du message' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Message envoyé avec succès !',
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Erreur API contact:', error);
        return NextResponse.json(
            { error: 'Une erreur est survenue' },
            { status: 500 }
        );
    }
}
