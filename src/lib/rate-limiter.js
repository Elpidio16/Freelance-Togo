/**
 * Rate Limiter Middleware
 * Limite le nombre de requêtes par IP et par route
 */

const rateLimitStore = new Map();

/**
 * Configuration du rate limiter
 */
const defaultConfig = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limite de 5 requêtes
    message: 'Trop de tentatives, veuillez réessayer plus tard',
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
};

/**
 * Nettoie les entrées expirées du store
 */
function cleanupExpiredEntries() {
    const now = Date.now();
    for (const [key, value] of rateLimitStore.entries()) {
        if (now > value.resetTime) {
            rateLimitStore.delete(key);
        }
    }
}

// Nettoyage périodique toutes les 5 minutes
setInterval(cleanupExpiredEntries, 5 * 60 * 1000);

/**
 * Crée un middleware de rate limiting
 * 
 * @param {Object} options - Configuration du rate limiter
 * @param {number} options.windowMs - Fenêtre de temps en ms
 * @param {number} options.max - Nombre maximum de requêtes
 * @param {string} options.message - Message d'erreur
 * @param {boolean} options.skipSuccessfulRequests - Ignorer les requêtes réussies
 * @param {boolean} options.skipFailedRequests - Ignorer les requêtes échouées
 * @returns {Function} Middleware function
 */
export function createRateLimiter(options = {}) {
    const config = { ...defaultConfig, ...options };

    return async function rateLimiter(request) {
        // Obtenir l'IP du client
        const ip = getClientIp(request);
        const key = `${ip}:${request.url}`;
        const now = Date.now();

        // Récupérer ou créer l'entrée
        let entry = rateLimitStore.get(key);

        if (!entry || now > entry.resetTime) {
            // Nouvelle fenêtre de temps
            entry = {
                count: 0,
                resetTime: now + config.windowMs,
            };
            rateLimitStore.set(key, entry);
        }

        // Incrémenter le compteur
        entry.count++;

        // Vérifier la limite
        if (entry.count > config.max) {
            const retryAfter = Math.ceil((entry.resetTime - now) / 1000);

            return {
                limited: true,
                retryAfter,
                message: config.message,
            };
        }

        return {
            limited: false,
            remaining: config.max - entry.count,
            resetTime: entry.resetTime,
        };
    };
}

/**
 * Obtient l'IP du client depuis la requête
 */
function getClientIp(request) {
    // Vérifier les headers de proxy
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }

    const realIp = request.headers.get('x-real-ip');
    if (realIp) {
        return realIp;
    }

    // Fallback
    return 'unknown';
}

/**
 * Rate limiter pour les routes d'authentification
 * 5 tentatives par 15 minutes
 */
export const authRateLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.',
});

/**
 * Rate limiter pour la réinitialisation de mot de passe
 * 3 tentatives par heure
 */
export const passwordResetRateLimiter = createRateLimiter({
    windowMs: 60 * 60 * 1000,
    max: 3,
    message: 'Trop de demandes de réinitialisation. Veuillez réessayer dans 1 heure.',
});

/**
 * Rate limiter pour les routes API générales
 * 100 requêtes par 15 minutes
 */
export const apiRateLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Trop de requêtes. Veuillez ralentir.',
});

/**
 * Helper pour appliquer le rate limiter dans une route API
 * 
 * @example
 * const limiter = createRateLimiter({ max: 5 });
 * const result = await applyRateLimit(request, limiter);
 * if (result.limited) {
 *   return NextResponse.json({ error: result.message }, { 
 *     status: 429,
 *     headers: { 'Retry-After': result.retryAfter }
 *   });
 * }
 */
export async function applyRateLimit(request, limiter) {
    return await limiter(request);
}
