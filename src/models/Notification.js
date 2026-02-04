import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['message', 'application', 'project', 'review', 'invitation', 'system'],
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    message: {
        type: String,
        required: true,
        trim: true,
    },
    link: {
        type: String,
        trim: true,
    },
    read: {
        type: Boolean,
        default: false,
    },
    readAt: {
        type: Date,
    },
    metadata: {
        type: Map,
        of: String,
    },
}, {
    timestamps: true,
});

// Indexes for efficient queries
NotificationSchema.index({ userId: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, read: 1 });

export default mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
