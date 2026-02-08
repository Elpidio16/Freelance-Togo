import mongoose from 'mongoose';

const NotificationPreferenceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    // Email preferences
    emailNotifications: {
        type: Boolean,
        default: true,
    },
    emailPreferences: {
        messages: {
            type: Boolean,
            default: true,
        },
        applications: {
            type: Boolean,
            default: true,
        },
        projects: {
            type: Boolean,
            default: true,
        },
        reviews: {
            type: Boolean,
            default: true,
        },
        marketing: {
            type: Boolean,
            default: false,
        },
    },
    // In-app preferences
    inAppNotifications: {
        type: Boolean,
        default: true,
    },
    // Frequency settings
    emailDigest: {
        type: String,
        enum: ['instant', 'daily', 'weekly', 'never'],
        default: 'instant',
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

export default mongoose.models.NotificationPreference ||
    mongoose.model('NotificationPreference', NotificationPreferenceSchema);
