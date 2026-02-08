import { z } from 'zod';

/**
 * Schema de validation pour les variables d'environnement
 * Utilise Zod pour valider que toutes les variables requises sont présentes
 */
const envSchema = z.object({
    // Database
    MONGODB_URI: z.string().min(1, 'MONGODB_URI est requis'),

    // NextAuth
    NEXTAUTH_URL: z.string().url('NEXTAUTH_URL doit être une URL valide'),
    NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET doit faire au moins 32 caractères'),

    // Cloudinary
    CLOUDINARY_CLOUD_NAME: z.string().min(1, 'CLOUDINARY_CLOUD_NAME est requis'),
    CLOUDINARY_API_KEY: z.string().min(1, 'CLOUDINARY_API_KEY est requis'),
    CLOUDINARY_API_SECRET: z.string().min(1, 'CLOUDINARY_API_SECRET est requis'),

    // Email
    RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY est requis').optional(),
    EMAIL_FROM: z.string().email('EMAIL_FROM doit être un email valide').optional(),

    // Application
    NEXT_PUBLIC_APP_URL: z.string().url('NEXT_PUBLIC_APP_URL doit être une URL valide').optional(),

    // Optionnel - Monitoring
    NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
    SENTRY_AUTH_TOKEN: z.string().optional(),

    // Optionnel - Rate Limiting
    REDIS_URL: z.string().url().optional(),
});

/**
 * Valide les variables d'environnement au démarrage de l'application
 * Lance une erreur si des variables requises sont manquantes ou invalides
 */
export function validateEnv() {
    try {
        const env = {
            MONGODB_URI: process.env.MONGODB_URI,
            NEXTAUTH_URL: process.env.NEXTAUTH_URL,
            NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
            CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
            CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
            CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
            RESEND_API_KEY: process.env.RESEND_API_KEY,
            EMAIL_FROM: process.env.EMAIL_FROM,
            NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
            NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
            SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
            REDIS_URL: process.env.REDIS_URL,
        };

        envSchema.parse(env);

        console.log('✅ Variables d\'environnement validées avec succès');
        return env;
    } catch (error) {
        console.error('❌ Erreur de validation des variables d\'environnement:');

        if (error instanceof z.ZodError) {
            error.errors.forEach((err) => {
                console.error(`  - ${err.path.join('.')}: ${err.message}`);
            });
        } else {
            console.error(error);
        }

        console.error('\n📝 Vérifiez votre fichier .env.local');
        console.error('📄 Consultez .env.example pour un exemple de configuration\n');

        // En développement, on peut être plus permissif
        if (process.env.NODE_ENV === 'production') {
            throw new Error('Variables d\'environnement invalides en production');
        } else {
            console.warn('⚠️  Mode développement: l\'application continue malgré les erreurs\n');
        }
    }
}

/**
 * Retourne une variable d'environnement avec une valeur par défaut
 */
export function getEnvVar(key, defaultValue = '') {
    return process.env[key] || defaultValue;
}

/**
 * Vérifie si l'application est en mode production
 */
export function isProduction() {
    return process.env.NODE_ENV === 'production';
}

/**
 * Vérifie si l'application est en mode développement
 */
export function isDevelopment() {
    return process.env.NODE_ENV === 'development';
}
