import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import CompanyProfile from '@/models/CompanyProfile';
import VerificationToken from '@/models/VerificationToken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request) {
    try {
        await connectDB();

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

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: 'Un compte avec cet email existe déjà' },
                { status: 400 }
            );
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer l'utilisateur (non vérifié)
        const user = await User.create({
            email,
            password: hashedPassword,
            role,
            firstName,
            lastName,
            phone,
            city,
            isVerified: false,
            emailVerified: null,
        });

        // Si c'est une entreprise, créer le profil entreprise
        if (role === 'company' && companyName) {
            await CompanyProfile.create({
                userId: user._id,
                companyName,
                sector,
                size: companySize,
                website: website || '',
                location: city,
                description: '',
            });
        }

        // Générer un token de vérification
        const verificationToken = uuidv4();

        // Sauvegarder le token en base
        await VerificationToken.create({
            email: user.email,
            token: verificationToken,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
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
