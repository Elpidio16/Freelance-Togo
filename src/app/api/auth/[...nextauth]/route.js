import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    await connectDB();

                    if (!credentials?.email || !credentials?.password) {
                        throw new Error('Email et mot de passe requis');
                    }

                    // Trouver l'utilisateur
                    const user = await User.findOne({ email: credentials.email.toLowerCase() });

                    if (!user) {
                        throw new Error('Email ou mot de passe incorrect');
                    }

                    // Vérifier le mot de passe
                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

                    if (!isPasswordValid) {
                        throw new Error('Email ou mot de passe incorrect');
                    }

                    // Vérifier si l'email est vérifié
                    if (!user.isVerified) {
                        throw new Error('Veuillez vérifier votre email avant de vous connecter. Consultez votre boîte de réception.');
                    }

                    // Retourner l'utilisateur (sans le mot de passe)
                    return {
                        id: user._id.toString(),
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
