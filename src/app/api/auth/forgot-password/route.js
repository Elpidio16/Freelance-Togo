import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { applyRateLimit, passwordResetRateLimiter } from '@/lib/rate-limiter';

// POST /api/auth/forgot-password
export async function POST(request) {
    try {
        // Rate limiting
        const rateLimit = await applyRateLimit(request, passwordResetRateLimiter);
        if (rateLimit.limited) {
            return NextResponse.json(
                { error: rateLimit.message },
                {
                    status: 429,
                    headers: { 'Retry-After': rateLimit.retryAfter.toString() }
                }
            );
        }

        const body = await request.json();
        const { email } = body;

        // Validation
        if (!email || !email.includes('@')) {
            return NextResponse.json(
                { error: 'Email invalide' },
                { status: 400 }
            );
        }

        // Rechercher l'utilisateur
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Aucun compte n\'est associé à cet email.' },
                { status: 404 }
            );
        }

        // Générer un token unique
        const token = uuidv4();
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 heure

        // Créer l'entrée de réinitialisation
        await prisma.passwordReset.create({
            data: {
                userId: user.id,
                token,
                expiresAt,
            }
        });

        // Créer le lien de réinitialisation
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const resetLink = `${appUrl}/auth/reset-password?token=${token}`;

        // Envoyer l'email
        const emailSent = await sendEmail({
            to: user.email,
            subject: 'Réinitialisation de votre mot de passe - IngeniHub',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2563eb;">Réinitialisation de mot de passe</h2>
                    
                    <p>Bonjour ${user.firstName || 'Utilisateur'},</p>
                    
                    <p>Vous avez demandé la réinitialisation de votre mot de passe sur IngeniHub.</p>
                    
                    <p>Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetLink}" 
                           style="background-color: #2563eb; color: white; padding: 12px 30px; 
                                   text-decoration: none; border-radius: 5px; display: inline-block;">
                            Réinitialiser mon mot de passe
                        </a>
                    </div>
                    
                    <p>Ou copiez ce lien dans votre navigateur :</p>
                    <p style="word-break: break-all; color: #666;">${resetLink}</p>
                    
                    <p><strong>Ce lien expire dans 1 heure.</strong></p>
                    
                    <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
                    
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                    
                    <p style="color: #666; font-size: 12px;">
                        IngeniHub - Plateforme de mise en relation<br>
                        Cet email a été envoyé automatiquement, merci de ne pas y répondre.
                    </p>
                </div>
            `,
        });

        if (!emailSent) {
            console.error('Erreur lors de l\'envoi de l\'email de réinitialisation');
            return NextResponse.json(
                { error: 'Erreur lors de l\'envoi de l\'email' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Un lien de réinitialisation a été envoyé à votre adresse email.',
        });

    } catch (error) {
        console.error('Erreur POST /api/auth/forgot-password:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la demande de réinitialisation' },
            { status: 500 }
        );
    }
}
