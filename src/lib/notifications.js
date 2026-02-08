import prisma from '@/lib/prisma';
import * as emailService from './email';

/**
 * Check if user wants email notifications for a specific type
 */
async function shouldSendEmail(userId, notificationType) {
    try {
        const preferences = await prisma.notificationPreference.findUnique({
            where: { userId }
        });

        // If no preferences set, default to true
        if (!preferences || !preferences.emailNotifications) {
            return preferences?.emailNotifications !== false;
        }

        // Check specific preference
        const typeMap = {
            message: 'messages',
            application: 'applications',
            project: 'projects',
            review: 'reviews',
        };

        const prefKey = typeMap[notificationType];
        // emailPreferences is JSON in Prisma
        // We need to check if it exists and access the key.
        if (prefKey && preferences.emailPreferences && typeof preferences.emailPreferences === 'object') {
            const val = preferences.emailPreferences[prefKey];
            return val !== false;
        }
        return true;

    } catch (error) {
        console.error('Error checking email preferences:', error);
        return true; // Default to sending if error
    }
}

/**
 * Create notification and optionally send email
 */
export async function createNotification({
    userId,
    type,
    title,
    message,
    link,
    metadata = {},
    emailData = null // Optional: data for email notification
}) {
    try {
        // Create in-app notification
        const notification = await prisma.notification.create({
            data: {
                userId,
                type,
                title,
                message,
                link: link || '',
                metadata: metadata || {},
                // category: type, // Schema does not have category? Mongoose model did? Let's assume type is enough or metadata.
                // Schema has 'type' String.
                read: false
            }
        });

        // Check if we should send email
        if (emailData && await shouldSendEmail(userId, type)) {
            const user = await prisma.user.findUnique({ where: { id: userId } });

            if (user?.email) {
                let emailSent = false;

                // Send appropriate email based on type
                switch (type) {
                    case 'message':
                        emailSent = await emailService.sendNewMessageEmail({
                            recipientEmail: user.email,
                            ...emailData,
                        });
                        break;

                    case 'application':
                        if (emailData.status === 'accepted') {
                            emailSent = await emailService.sendApplicationAcceptedEmail({
                                freelanceEmail: user.email,
                                ...emailData,
                            });
                        } else if (emailData.status === 'rejected') {
                            emailSent = await emailService.sendApplicationRejectedEmail({
                                freelanceEmail: user.email,
                                ...emailData,
                            });
                        } else if (emailData.status === 'new') {
                            emailSent = await emailService.sendNewApplicationEmail({
                                companyEmail: user.email,
                                ...emailData,
                            });
                        }
                        break;

                    case 'project':
                        emailSent = await emailService.sendNewMatchingProjectEmail({
                            freelanceEmail: user.email,
                            ...emailData,
                        });
                        break;

                    case 'review':
                        emailSent = await emailService.sendReviewRequestEmail({
                            clientEmail: user.email,
                            ...emailData,
                        });
                        break;
                }

                // Update notification with email status
                if (emailSent) {
                    await prisma.notification.update({
                        where: { id: notification.id },
                        data: {
                            emailSent: true,
                            emailSentAt: new Date()
                        }
                    });
                }
            }
        }

        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
        return null;
    }
}

/**
 * Notification type constants
 */
export const NotificationTypes = {
    MESSAGE: 'message',
    APPLICATION: 'application',
    PROJECT: 'project',
    REVIEW: 'review',
    INVITATION: 'invitation',
    SYSTEM: 'system',
};

/**
 * Create message notification with email
 */
export async function createMessageNotification(userId, senderName, senderId, conversationId, messagePreview) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    return createNotification({
        userId,
        type: NotificationTypes.MESSAGE,
        title: 'Nouveau message',
        message: `${senderName} vous a envoyé un message`,
        link: `/messages?conversation=${conversationId}`,
        emailData: {
            recipientName: user?.firstName || 'Utilisateur',
            senderName,
            messagePreview: messagePreview.substring(0, 100),
            conversationId,
        },
    });
}

/**
 * Create application notification with email
 */
export async function createApplicationNotification(userId, projectTitle, status, additionalData = {}) {
    const messages = {
        accepted: `Votre candidature pour "${projectTitle}" a été acceptée ! 🎉`,
        rejected: `Votre candidature pour "${projectTitle}" n'a pas été retenue`,
        new: `Nouvelle candidature reçue pour "${projectTitle}"`,
    };

    const user = await prisma.user.findUnique({ where: { id: userId } });

    return createNotification({
        userId,
        type: NotificationTypes.APPLICATION,
        title: status === 'new' ? 'Nouvelle candidature' : 'Mise à jour candidature',
        message: messages[status] || messages.new,
        link: status === 'new' ? '/projects' : '/applications/my-applications',
        emailData: {
            freelanceName: user?.firstName || 'Utilisateur',
            companyName: additionalData.companyName,
            projectTitle,
            status,
            projectId: additionalData.projectId,
            applicationId: additionalData.applicationId,
            freelanceProfile: additionalData.freelanceProfile,
        },
    });
}

/**
 * Create review notification with email
 */
export async function createReviewNotification(userId, companyName, rating, projectTitle, projectId) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    return createNotification({
        userId,
        type: NotificationTypes.REVIEW,
        title: 'Nouvel avis reçu',
        message: `${companyName} vous a laissé un avis (${rating}★)`,
        link: '/profile',
        emailData: {
            clientName: companyName,
            freelanceName: user?.firstName || 'Utilisateur',
            projectTitle,
            projectId,
        },
    });
}

/**
 * Create project notification with email
 */
export async function createProjectNotification(userId, projectTitle, projectData) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    return createNotification({
        userId,
        type: NotificationTypes.PROJECT,
        title: 'Nouveau projet',
        message: `Un nouveau projet correspond à vos compétences: "${projectTitle}"`,
        link: `/projects/${projectData.projectId}`,
        emailData: {
            freelanceName: user?.firstName || 'Utilisateur',
            projectTitle,
            projectDescription: projectData.description,
            skills: projectData.skills || [],
            budget: projectData.budget,
            projectId: projectData.projectId,
        },
    });
}

/**
 * Get user's notification preferences
 */
export async function getNotificationPreferences(userId) {
    try {
        let preferences = await prisma.notificationPreference.findUnique({
            where: { userId }
        });

        // Create default preferences if none exist
        if (!preferences) {
            preferences = await prisma.notificationPreference.create({
                data: { userId }
            });
        }

        return preferences;
    } catch (error) {
        console.error('Error getting notification preferences:', error);
        return null;
    }
}

/**
 * Update user's notification preferences
 */
export async function updateNotificationPreferences(userId, updates) {
    try {
        // Prisma upsert is clean here
        const preferences = await prisma.notificationPreference.upsert({
            where: { userId },
            update: { ...updates, updatedAt: new Date() },
            create: { userId, ...updates }
        });

        return preferences;
    } catch (error) {
        console.error('Error updating notification preferences:', error);
        return null;
    }
}

