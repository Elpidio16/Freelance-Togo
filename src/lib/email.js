import { Resend } from 'resend';
import emailTemplates from './email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.EMAIL_FROM || 'IngeniHub <noreply@ingenihub.com>';

/**
 * Generic email sending function with error handling and logging
 */
export async function sendEmail({ to, subject, html, replyTo }) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
      ...(replyTo && { replyTo }),
    });

    if (error) {
      console.error('❌ Erreur Resend:', error);
      return false;
    }

    console.log('✅ Email envoyé avec succès:', { to, subject, id: data?.id });
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
    return false;
  }
}

/**
 * Send verification email using template
 */
export async function sendVerificationEmail(email, token, userName = 'Utilisateur') {
  const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`;

  const html = emailTemplates.emailVerificationTemplate({
    userName,
    verificationLink,
  });

  return sendEmail({
    to: email,
    subject: '✅ Vérifiez votre adresse email - IngeniHub',
    html,
  });
}

/**
 * Send welcome email after verification
 */
export async function sendWelcomeEmail(email, userName, userRole) {
  const dashboardLink = `${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL}/dashboard`;

  const html = emailTemplates.welcomeTemplate({
    userName,
    userRole,
    dashboardLink,
  });

  return sendEmail({
    to: email,
    subject: '🎉 Bienvenue sur IngeniHub !',
    html,
  });
}

/**
 * Send new application notification to company
 */
export async function sendNewApplicationEmail({
  companyEmail,
  companyName,
  freelanceName,
  projectTitle,
  applicationId,
  freelanceProfile
}) {
  const applicationLink = `${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL}/projects?applicationId=${applicationId}`;

  const html = emailTemplates.newApplicationTemplate({
    companyName,
    freelanceName,
    projectTitle,
    applicationLink,
    freelanceProfile,
  });

  return sendEmail({
    to: companyEmail,
    subject: `📬 Nouvelle candidature pour "${projectTitle}"`,
    html,
  });
}

/**
 * Send application accepted notification to freelance
 */
export async function sendApplicationAcceptedEmail({
  freelanceEmail,
  freelanceName,
  projectTitle,
  companyName,
  projectId,
}) {
  const projectLink = `${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL}/projects/${projectId}`;

  const html = emailTemplates.applicationAcceptedTemplate({
    freelanceName,
    projectTitle,
    companyName,
    projectLink,
  });

  return sendEmail({
    to: freelanceEmail,
    subject: `🎉 Candidature acceptée - ${projectTitle}`,
    html,
  });
}

/**
 * Send application rejected notification to freelance
 */
export async function sendApplicationRejectedEmail({
  freelanceEmail,
  freelanceName,
  projectTitle,
  companyName,
}) {
  const html = emailTemplates.applicationRejectedTemplate({
    freelanceName,
    projectTitle,
    companyName,
  });

  return sendEmail({
    to: freelanceEmail,
    subject: `Mise à jour de votre candidature - ${projectTitle}`,
    html,
  });
}

/**
 * Send new message notification
 */
export async function sendNewMessageEmail({
  recipientEmail,
  recipientName,
  senderName,
  messagePreview,
  conversationId,
}) {
  const conversationLink = `${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL}/messages?conversation=${conversationId}`;

  const html = emailTemplates.newMessageTemplate({
    recipientName,
    senderName,
    messagePreview,
    conversationLink,
  });

  return sendEmail({
    to: recipientEmail,
    subject: `💬 Nouveau message de ${senderName}`,
    html,
  });
}

/**
 * Send new matching project notification to freelance
 */
export async function sendNewMatchingProjectEmail({
  freelanceEmail,
  freelanceName,
  projectTitle,
  projectDescription,
  skills,
  budget,
  projectId,
}) {
  const projectLink = `${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL}/projects/${projectId}`;

  const html = emailTemplates.newMatchingProjectTemplate({
    freelanceName,
    projectTitle,
    projectDescription,
    skills,
    budget: `${budget.min} - ${budget.max} ${budget.currency || 'FCFA'}`,
    projectLink,
  });

  return sendEmail({
    to: freelanceEmail,
    subject: `🎯 Nouveau projet : ${projectTitle}`,
    html,
  });
}

/**
 * Send review request email
 */
export async function sendReviewRequestEmail({
  clientEmail,
  clientName,
  freelanceName,
  projectTitle,
  projectId,
}) {
  const reviewLink = `${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL}/reviews/submit?project=${projectId}`;

  const html = emailTemplates.reviewRequestTemplate({
    clientName,
    freelanceName,
    projectTitle,
    reviewLink,
  });

  return sendEmail({
    to: clientEmail,
    subject: `⭐ Laissez un avis pour ${freelanceName}`,
    html,
  });
}

/**
 * Send contact form email (existing function, kept for compatibility)
 */
export async function sendContactEmail({ from, to, subject, message }) {
  const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6;
                color: #2c2c2c;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .container {
                background: #ffffff;
                border-radius: 12px;
                padding: 40px;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
              }
              .header {
                background: linear-gradient(135deg, #2563eb, #1d4ed8);
                color: white;
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 30px;
              }
              .info-block {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 8px;
                margin: 20px 0;
              }
              .message-box {
                background: #eff6ff;
                border-left: 4px solid #2563eb;
                padding: 20px;
                margin: 20px 0;
                border-radius: 4px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">📧 Nouveau message de contact</h1>
                <p style="margin: 10px 0 0; opacity: 0.9;">Pour le freelance : ${to}</p>
              </div>
              
              <div class="info-block">
                <p><strong>De :</strong> ${from.name}</p>
                <p><strong>Email :</strong> <a href="mailto:${from.email}">${from.email}</a></p>
                ${from.phone ? `<p><strong>Téléphone :</strong> ${from.phone}</p>` : ''}
                <p><strong>Sujet :</strong> ${subject}</p>
              </div>
              
              <div class="message-box">
                <h3 style="margin-top: 0;">Message :</h3>
                <p style="white-space: pre-wrap;">${message}</p>
              </div>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e8eaed; text-align: center; font-size: 14px; color: #5a6c7d;">
                <p>Ce message a été envoyé via le formulaire de contact de Freelance Togo.</p>
                <p>Vous pouvez répondre directement à cet email pour contacter ${from.name}.</p>
              </div>
            </div>
          </body>
        </html>
    `;

  return sendEmail({
    to: process.env.CONTACT_EMAIL || FROM_EMAIL,
    subject: `[Contact] ${subject} - de ${from.name}`,
    html,
    replyTo: from.email,
  });
}

/**
 * Send generic notification email
 */
export async function sendGenericNotificationEmail({
  to,
  userName,
  title,
  message,
  actionText,
  actionLink,
}) {
  const html = emailTemplates.genericNotificationTemplate({
    userName,
    title,
    message,
    actionText,
    actionLink,
  });

  return sendEmail({
    to,
    subject: title,
    html,
  });
}



