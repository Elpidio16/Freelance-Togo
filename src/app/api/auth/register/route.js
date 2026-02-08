import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request) {
    try {
        const body = await request.json();
        const {
            email,
            password,
            role,
            firstName,
            lastName,
            phone,
            city,
            // Company specific fields
            companyName,
            sector,
            companySize,
            website,
        } = body;

        if (!email || !password || !role || !firstName || !lastName) {
            return NextResponse.json(
                { error: 'Champs obligatoires manquants' },
                { status: 400 }
            );
        }

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'Un compte avec cet email existe déjà' },
                { status: 400 }
            );
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Préparer les données de l'utilisateur
        const userData = {
            email: email.toLowerCase(),
            password: hashedPassword,
            role,
            firstName,
            lastName,
            phone,
            city,
            isVerified: false,
            emailVerified: null,
            // Créer le profil entreprise directement si nécessaire
            ...(role === 'company' && companyName ? {
                companyProfile: {
                    create: {
                        companyName,
                        sector,
                        size: companySize,
                        website: website || '',
                        location: city,
                        description: '',
                    }
                }
            } : {})
        };

        // Créer l'utilisateur (et le profil entreprise via nested write)
        const user = await prisma.user.create({
            data: userData,
        });

        // Générer un token de vérification
        const verificationToken = uuidv4();
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

        // Sauvegarder le token en base
        await prisma.verificationToken.create({
            data: {
                identifier: email.toLowerCase(),
                token: verificationToken,
                expires: expires,
            }
        });

        // Envoyer l'email de vérification
        const emailResult = await sendVerificationEmail(email, verificationToken);

        if (!emailResult.success) {
            console.error('Erreur envoi email:', emailResult.error);
            // On ne bloque pas l'inscription, mais on log l'erreur
        }

        return NextResponse.json(
            {
                message: 'Compte créé ! Veuillez vérifier votre email pour activer votre compte.',
                requiresVerification: true,
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Erreur lors de la création du compte:', error);
        return NextResponse.json(
            { error: 'Une erreur est survenue lors de la création du compte' },
            { status: 500 }
        );
    }
}
