/**
 * Templates d'emails HTML professionnels pour Freelance-Togo
 * Tous les templates sont responsive et compatibles avec les principaux clients email
 */

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const APP_NAME = 'IngeniHub';
const PRIMARY_COLOR = '#2563eb';
const SUPPORT_EMAIL = 'support@freelance-togo.com';

/**
 * Template de base pour tous les emails
 */
function baseTemplate(content, preheader = '') {
    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>${APP_NAME}</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #f3f4f6;
            color: #1f2937;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }
        .header {
            background: linear-gradient(135deg, ${PRIMARY_COLOR} 0%, #1d4ed8 100%);
            padding: 30px 20px;
            text-align: center;
        }
        .logo {
            font-size: 28px;
            font-weight: 700;
            color: #ffffff;
            text-decoration: none;
        }
        .content {
            padding: 40px 30px;
        }
        .button {
            display: inline-block;
            padding: 14px 32px;
            background-color: ${PRIMARY_COLOR};
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 20px 0;
        }
        .footer {
            background-color: #f9fafb;
            padding: 30px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
        }
        .divider {
            height: 1px;
            background-color: #e5e7eb;
            margin: 30px 0;
        }
        @media only screen and (max-width: 600px) {
            .content {
                padding: 30px 20px;
            }
        }
    </style>
</head>
<body>
    <div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
        ${preheader}
    </div>
    <div class="container">
        <div class="header">
            <a href="${APP_URL}" class="logo">${APP_NAME}</a>
        </div>
        <div class="content">
            ${content}
        </div>
        <div class="footer">
            <p><strong>${APP_NAME}</strong> - Plateforme de mise en relation au Togo 🇹🇬</p>
            <p>
                <a href="${APP_URL}" style="color: ${PRIMARY_COLOR}; text-decoration: none;">Accueil</a> •
                <a href="${APP_URL}/legal/terms" style="color: ${PRIMARY_COLOR}; text-decoration: none;">CGU</a> •
                <a href="${APP_URL}/legal/privacy" style="color: ${PRIMARY_COLOR}; text-decoration: none;">Confidentialité</a>
            </p>
            <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.<br>
            Pour toute question, contactez-nous à <a href="mailto:${SUPPORT_EMAIL}" style="color: ${PRIMARY_COLOR};">${SUPPORT_EMAIL}</a></p>
        </div>
    </div>
</body>
</html>
    `.trim();
}

/**
 * Email de vérification de compte
 */
export function emailVerificationTemplate({ userName, verificationLink }) {
    const content = `
        <h2 style="color: #1f2937; margin-bottom: 20px;">Bienvenue sur ${APP_NAME} ! 🎉</h2>
        
        <p>Bonjour <strong>${userName}</strong>,</p>
        
        <p>Merci de vous être inscrit sur ${APP_NAME}, la plateforme qui connecte les meilleurs freelances avec les entreprises au Togo.</p>
        
        <p>Pour commencer à utiliser votre compte, veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous :</p>
        
        <div style="text-align: center;">
            <a href="${verificationLink}" class="button">Vérifier mon email</a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px;">Ou copiez ce lien dans votre navigateur :<br>
        <a href="${verificationLink}" style="color: ${PRIMARY_COLOR}; word-break: break-all;">${verificationLink}</a></p>
        
        <div class="divider"></div>
        
        <p><strong>Ce lien expire dans 24 heures.</strong></p>
        
        <p>Si vous n'avez pas créé de compte sur ${APP_NAME}, ignorez cet email.</p>
    `;

    return baseTemplate(content, 'Vérifiez votre email pour activer votre compte');
}

/**
 * Email de nouvelle candidature (pour l'entreprise)
 */
export function newApplicationTemplate({ companyName, freelanceName, projectTitle, applicationLink, freelanceProfile }) {
    const content = `
        <h2 style="color: #1f2937; margin-bottom: 20px;">Nouvelle candidature reçue ! 📬</h2>
        
        <p>Bonjour <strong>${companyName}</strong>,</p>
        
        <p>Bonne nouvelle ! <strong>${freelanceName}</strong> a postulé à votre projet :</p>
        
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: ${PRIMARY_COLOR};">📁 ${projectTitle}</h3>
            <p style="margin: 0; color: #6b7280;">Candidat : ${freelanceName}</p>
            ${freelanceProfile?.title ? `<p style="margin: 5px 0 0 0; color: #6b7280;">${freelanceProfile.title}</p>` : ''}
        </div>
        
        <p>Consultez la candidature et le profil du freelance pour décider de la suite :</p>
        
        <div style="text-align: center;">
            <a href="${applicationLink}" class="button">Voir la candidature</a>
        </div>
        
        <div class="divider"></div>
        
        <p style="font-size: 14px; color: #6b7280;">
            💡 <strong>Conseil :</strong> Répondez rapidement aux candidatures pour ne pas manquer les meilleurs talents !
        </p>
    `;

    return baseTemplate(content, `${freelanceName} a postulé à votre projet ${projectTitle}`);
}

/**
 * Email de candidature acceptée (pour le freelance)
 */
export function applicationAcceptedTemplate({ freelanceName, projectTitle, companyName, projectLink }) {
    const content = `
        <h2 style="color: #10b981; margin-bottom: 20px;">🎉 Félicitations ! Votre candidature a été acceptée</h2>
        
        <p>Bonjour <strong>${freelanceName}</strong>,</p>
        
        <p>Excellente nouvelle ! <strong>${companyName}</strong> a accepté votre candidature pour le projet :</p>
        
        <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
            <h3 style="margin: 0 0 10px 0; color: #065f46;">✅ ${projectTitle}</h3>
            <p style="margin: 0; color: #047857;">Client : ${companyName}</p>
        </div>
        
        <p><strong>Prochaines étapes :</strong></p>
        <ol style="line-height: 1.8;">
            <li>Contactez le client via la messagerie pour discuter des détails</li>
            <li>Clarifiez les attentes et le calendrier</li>
            <li>Commencez le travail une fois tous les détails confirmés</li>
        </ol>
        
        <div style="text-align: center;">
            <a href="${projectLink}" class="button">Voir le projet</a>
        </div>
        
        <div class="divider"></div>
        
        <p style="font-size: 14px; color: #6b7280;">
            💼 Bon travail ! N'oubliez pas de livrer un travail de qualité pour obtenir de bons avis.
        </p>
    `;

    return baseTemplate(content, `Votre candidature pour ${projectTitle} a été acceptée !`);
}

/**
 * Email de candidature rejetée (pour le freelance)
 */
export function applicationRejectedTemplate({ freelanceName, projectTitle, companyName }) {
    const content = `
        <h2 style="color: #1f2937; margin-bottom: 20px;">Mise à jour de votre candidature</h2>
        
        <p>Bonjour <strong>${freelanceName}</strong>,</p>
        
        <p>Nous vous informons que <strong>${companyName}</strong> a choisi un autre candidat pour le projet <strong>${projectTitle}</strong>.</p>
        
        <p>Ne vous découragez pas ! De nouvelles opportunités sont publiées chaque jour sur ${APP_NAME}.</p>
        
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-weight: 600;">💡 Conseils pour augmenter vos chances :</p>
            <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                <li>Personnalisez vos lettres de motivation</li>
                <li>Mettez à jour votre portfolio régulièrement</li>
                <li>Répondez rapidement aux nouvelles offres</li>
                <li>Demandez des avis à vos clients précédents</li>
            </ul>
        </div>
        
        <div style="text-align: center;">
            <a href="${APP_URL}/projects/browse" class="button">Parcourir les projets</a>
        </div>
    `;

    return baseTemplate(content, `Mise à jour de votre candidature pour ${projectTitle}`);
}

/**
 * Email de nouveau message (notification)
 */
export function newMessageTemplate({ recipientName, senderName, messagePreview, conversationLink }) {
    const content = `
        <h2 style="color: #1f2937; margin-bottom: 20px;">💬 Nouveau message reçu</h2>
        
        <p>Bonjour <strong>${recipientName}</strong>,</p>
        
        <p><strong>${senderName}</strong> vous a envoyé un message :</p>
        
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${PRIMARY_COLOR};">
            <p style="margin: 0; font-style: italic; color: #4b5563;">"${messagePreview}"</p>
        </div>
        
        <div style="text-align: center;">
            <a href="${conversationLink}" class="button">Répondre au message</a>
        </div>
        
        <div class="divider"></div>
        
        <p style="font-size: 14px; color: #6b7280;">
            Vous pouvez gérer vos préférences de notifications dans vos <a href="${APP_URL}/settings" style="color: ${PRIMARY_COLOR};">paramètres</a>.
        </p>
    `;

    return baseTemplate(content, `${senderName} vous a envoyé un message`);
}

/**
 * Email de nouveau projet correspondant aux compétences (pour freelance)
 */
export function newMatchingProjectTemplate({ freelanceName, projectTitle, projectDescription, skills, budget, projectLink }) {
    const content = `
        <h2 style="color: #1f2937; margin-bottom: 20px;">🎯 Nouveau projet qui pourrait vous intéresser</h2>
        
        <p>Bonjour <strong>${freelanceName}</strong>,</p>
        
        <p>Un nouveau projet correspondant à vos compétences vient d'être publié :</p>
        
        <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${PRIMARY_COLOR};">
            <h3 style="margin: 0 0 10px 0; color: ${PRIMARY_COLOR};">${projectTitle}</h3>
            <p style="margin: 10px 0; color: #4b5563;">${projectDescription.substring(0, 150)}${projectDescription.length > 150 ? '...' : ''}</p>
            <p style="margin: 10px 0 0 0;">
                <strong>Compétences :</strong> ${skills.join(', ')}<br>
                <strong>Budget :</strong> ${budget}
            </p>
        </div>
        
        <p>Soyez parmi les premiers à postuler pour maximiser vos chances !</p>
        
        <div style="text-align: center;">
            <a href="${projectLink}" class="button">Voir le projet et postuler</a>
        </div>
    `;

    return baseTemplate(content, `Nouveau projet : ${projectTitle}`);
}

/**
 * Email de demande d'avis (après projet complété)
 */
export function reviewRequestTemplate({ clientName, freelanceName, projectTitle, reviewLink }) {
    const content = `
        <h2 style="color: #1f2937; margin-bottom: 20px;">⭐ Votre avis compte !</h2>
        
        <p>Bonjour <strong>${clientName}</strong>,</p>
        
        <p>Votre projet <strong>${projectTitle}</strong> avec <strong>${freelanceName}</strong> est maintenant terminé.</p>
        
        <p>Nous aimerions connaître votre expérience ! Votre avis aide les autres entreprises à trouver les meilleurs freelances et encourage les professionnels de qualité.</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <p style="margin-bottom: 15px;">Comment évaluez-vous cette collaboration ?</p>
            <div style="font-size: 32px; margin: 10px 0;">⭐⭐⭐⭐⭐</div>
        </div>
        
        <div style="text-align: center;">
            <a href="${reviewLink}" class="button">Laisser un avis</a>
        </div>
        
        <div class="divider"></div>
        
        <p style="font-size: 14px; color: #6b7280;">
            Cela ne prend que 2 minutes et aide énormément notre communauté !
        </p>
    `;

    return baseTemplate(content, `Laissez un avis pour ${freelanceName}`);
}

/**
 * Email de bienvenue après vérification
 */
export function welcomeTemplate({ userName, userRole, dashboardLink }) {
    const isFreelance = userRole === 'freelance';

    const content = `
        <h2 style="color: #1f2937; margin-bottom: 20px;">🎉 Bienvenue sur ${APP_NAME} !</h2>
        
        <p>Bonjour <strong>${userName}</strong>,</p>
        
        <p>Votre compte est maintenant activé ! Vous faites désormais partie de la communauté ${APP_NAME}.</p>
        
        ${isFreelance ? `
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0; font-weight: 600;">🚀 Pour bien démarrer :</p>
            <ol style="margin: 10px 0 0 0; padding-left: 20px; line-height: 1.8;">
                <li>Complétez votre profil professionnel</li>
                <li>Ajoutez vos compétences et expériences</li>
                <li>Créez votre portfolio</li>
                <li>Parcourez les projets disponibles</li>
                <li>Postulez à vos premiers projets !</li>
            </ol>
        </div>
        ` : `
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0; font-weight: 600;">🚀 Pour bien démarrer :</p>
            <ol style="margin: 10px 0 0 0; padding-left: 20px; line-height: 1.8;">
                <li>Complétez le profil de votre entreprise</li>
                <li>Publiez votre premier projet</li>
                <li>Parcourez les profils de freelances</li>
                <li>Recevez des candidatures qualifiées</li>
                <li>Trouvez le talent parfait !</li>
            </ol>
        </div>
        `}
        
        <div style="text-align: center;">
            <a href="${dashboardLink}" class="button">Accéder à mon tableau de bord</a>
        </div>
        
        <div class="divider"></div>
        
        <p>Besoin d'aide ? Notre équipe est là pour vous accompagner à <a href="mailto:${SUPPORT_EMAIL}" style="color: ${PRIMARY_COLOR};">${SUPPORT_EMAIL}</a></p>
    `;

    return baseTemplate(content, 'Bienvenue sur Freelance Togo !');
}

/**
 * Email de notification générique
 */
export function genericNotificationTemplate({ userName, title, message, actionText, actionLink }) {
    const content = `
        <h2 style="color: #1f2937; margin-bottom: 20px;">${title}</h2>
        
        <p>Bonjour <strong>${userName}</strong>,</p>
        
        <p>${message}</p>
        
        ${actionLink ? `
        <div style="text-align: center;">
            <a href="${actionLink}" class="button">${actionText || 'Voir plus'}</a>
        </div>
        ` : ''}
    `;

    return baseTemplate(content, title);
}

export default {
    emailVerificationTemplate,
    newApplicationTemplate,
    applicationAcceptedTemplate,
    applicationRejectedTemplate,
    newMessageTemplate,
    newMatchingProjectTemplate,
    reviewRequestTemplate,
    welcomeTemplate,
    genericNotificationTemplate,
};
