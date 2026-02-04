// Helper function to create notifications
export async function createNotification({ userId, type, title, message, link, metadata = {} }) {
    try {
        const response = await fetch('/api/notifications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId,
                type,
                title,
                message,
                link,
                metadata,
            }),
        });

        if (!response.ok) {
            console.error('Failed to create notification');
            return null;
        }

        const data = await response.json();
        return data.notification;
    } catch (error) {
        console.error('Error creating notification:', error);
        return null;
    }
}

// Notification type helpers
export const NotificationTypes = {
    MESSAGE: 'message',
    APPLICATION: 'application',
    PROJECT: 'project',
    REVIEW: 'review',
    INVITATION: 'invitation',
    SYSTEM: 'system',
};

// Pre-defined notification templates
export const createMessageNotification = async (userId, senderName) => {
    return createNotification({
        userId,
        type: NotificationTypes.MESSAGE,
        title: 'Nouveau message',
        message: `${senderName} vous a envoyé un message`,
        link: '/messages',
    });
};

export const createApplicationNotification = async (userId, projectTitle, status) => {
    const messages = {
        accepted: `Votre candidature pour "${projectTitle}" a été acceptée ! 🎉`,
        rejected: `Votre candidature pour "${projectTitle}" n'a pas été retenue`,
        new: `Nouvelle candidature reçue pour "${projectTitle}"`,
    };

    return createNotification({
        userId,
        type: NotificationTypes.APPLICATION,
        title: status === 'new' ? 'Nouvelle candidature' : 'Mise à jour candidature',
        message: messages[status] || messages.new,
        link: status === 'new' ? '/projects' : '/applications/my-applications',
    });
};

export const createReviewNotification = async (userId, companyName, rating) => {
    return createNotification({
        userId,
        type: NotificationTypes.REVIEW,
        title: 'Nouvel avis reçu',
        message: `${companyName} vous a laissé un avis (${rating}★)`,
        link: '/profile',
    });
};

export const createProjectNotification = async (userId, projectTitle) => {
    return createNotification({
        userId,
        type: NotificationTypes.PROJECT,
        title: 'Nouveau projet',
        message: `Un nouveau projet correspond à vos compétences: "${projectTitle}"`,
        link: '/projects/browse',
    });
};
