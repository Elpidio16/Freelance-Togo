import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from 'bcryptjs';

console.log("🔍 AUTH DEBUG: NEXTAUTH_SECRET is defined:", !!process.env.NEXTAUTH_SECRET);
console.log("🔍 AUTH DEBUG: NODE_ENV:", process.env.NODE_ENV);

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    if (!credentials?.email || !credentials?.password) {
                        throw new Error('Email et mot de passe requis');
                    }

                    // Trouver l'utilisateur
                    const user = await prisma.user.findUnique({
                        where: {
                            email: credentials.email.toLowerCase()
                        }
                    });

                    if (!user) {
                        throw new Error('Email ou mot de passe incorrect');
                    }

                    // Vérifier si l'utilisateur a un mot de passe (cas login social)
                    if (!user.password) {
                        throw new Error('Veuillez vous connecter avec Google');
                    }

                    // Vérifier le mot de passe
                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

                    if (!isPasswordValid) {
                        throw new Error('Email ou mot de passe incorrect');
                    }

                    // Retourner l'utilisateur (sans le mot de passe)
                    return {
                        id: user.id,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        role: user.role,
                        isVerified: user.isVerified,
                    };

                } catch (error) {
                    console.error('Erreur d\'authentification:', error);
                    throw error;
                }
            }
        })
    ],

    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 jours
    },

    pages: {
        signIn: '/auth/login',
        newUser: '/auth/register',
    },

    callbacks: {
        async jwt({ token, user }) {
            // Ajouter les infos utilisateur au token lors de la connexion
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.firstName = user.firstName;
                token.lastName = user.lastName;
                token.role = user.role;
                token.isVerified = user.isVerified;
            }
            return token;
        },

        async session({ session, token }) {
            // Ajouter les infos du token à la session
            if (token) {
                session.user.id = token.id;
                session.user.firstName = token.firstName;
                session.user.lastName = token.lastName;
                session.user.role = token.role;
                session.user.isVerified = token.isVerified;
            }
            return session;
        },
    },

    secret: process.env.NEXTAUTH_SECRET,

    debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
