import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email, token) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Freelance Togo <noreply@freelance-togo.com>',
      to: email,
      subject: '✅ Vérifiez votre adresse email - Freelance Togo',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
                text-align: center;
                margin-bottom: 30px;
              }
              .logo {
                font-size: 28px;
                font-weight: 800;
                color: #e67e50;
              }
              h1 {
                color: #2c2c2c;
                font-size: 24px;
                margin: 30px 0 20px;
              }
              .button {
                display: inline-block;
                background: linear-gradient(135deg, #e67e50, #e89a5d);
                color: white;
                text-decoration: none;
                padding: 14px 32px;
                border-radius: 8px;
                font-weight: 600;
                margin: 24px 0;
                box-shadow: 0 4px 15px rgba(230, 126, 80, 0.25);
              }
              .footer {
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #e8eaed;
                font-size: 14px;
                color: #5a6c7d;
                text-align: center;
              }
              .warning {
                background: #fef5f1;
                border-left: 4px solid #e67e50;
                padding: 12px 16px;
                margin: 20px 0;
                border-radius: 4px;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">Freelance<span style="color: #5ba3b8;">Togo</span></div>
              </div>
              
              <h1>🎉 Bienvenue sur Freelance Togo !</h1>
              
              <p>Merci de vous être inscrit. Pour activer votre compte et commencer à utiliser notre plateforme, veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous :</p>
              
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">
                  Vérifier mon email
                </a>
              </div>
              
              <div class="warning">
                ⏰ <strong>Important :</strong> Ce lien expire dans 24 heures.
              </div>
              
              <p>Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :</p>
              <p style="word-break: break-all; color: #5ba3b8; font-size: 14px;">
                ${verificationUrl}
              </p>
              
              <div class="footer">
                <p>Vous n'avez pas créé de compte ? Ignorez cet email.</p>
                <p style="margin-top: 10px;">
                  © ${new Date().getFullYear()} Freelance Togo. Tous droits réservés.
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Erreur Resend:', error);
      return { success: false, error };
    }

    console.log('Email envoyé avec succès:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return { success: false, error: error.message };
  }
}

export async function sendWelcomeEmail(email, firstName) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Freelance Togo <noreply@freelance-togo.com>',
      to: email,
      subject: '🎊 Bienvenue sur Freelance Togo !',
      html: `
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
            </style>
          </head>
          <body>
            <div class="container">
              <h1>🎊 Félicitations ${firstName} !</h1>
              <p>Votre compte est maintenant activé et vous pouvez profiter de toutes les fonctionnalités de Freelance Togo.</p>
              <p>Commencez dès maintenant à explorer notre plateforme et à vous connecter avec les meilleurs talents du Togo.</p>
              <p>À bientôt,<br>L'équipe Freelance Togo</p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Erreur lors de l\'envoi du welcome email:', error);
    }

    return { success: !error, data, error };
  } catch (error) {
    console.error('Erreur welcome email:', error);
    return { success: false, error: error.message };
  }
}

export async function sendContactEmail({ from, to, subject, message }) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Freelance Togo <noreply@freelance-togo.com>',
      to: process.env.CONTACT_EMAIL || process.env.EMAIL_FROM || 'contact@freelance-togo.com',
      replyTo: from.email,
      subject: `[Contact] ${subject} - de ${from.name}`,
      html: `
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
                background: linear-gradient(135deg, #e67e50, #e89a5d);
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
              .info-block strong {
                color: #e67e50;
              }
              .message-box {
                background: #fef5f1;
                border-left: 4px solid #e67e50;
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
      `,
    });

    if (error) {
      console.error('Erreur lors de l\'envoi du contact email:', error);
      return { success: false, error };
    }

    console.log('Email de contact envoyé avec succès:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Erreur contact email:', error);
    return { success: false, error: error.message };
  }
}
