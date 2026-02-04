import mongoose from 'mongoose';

const ConversationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }],
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
    },
    lastMessage: {
        type: String,
    },
    lastMessageAt: {
        type: Date,
        default: Date.now,
    },
    unreadCount: {
        type: Map,
        of: Number,
        default: {},
    },
}, {
    timestamps: true,
});

// Ensure unique conversation between two participants
ConversationSchema.index({ participants: 1 });

// Helper method to get unread count for a user
ConversationSchema.methods.getUnreadCount = function (userId) {
    return this.unreadCount.get(userId.toString()) || 0;
};

// Helper method to increment unread count
ConversationSchema.methods.incrementUnread = function (userId) {
    const currentCount = this.unreadCount.get(userId.toString()) || 0;
    this.unreadCount.set(userId.toString(), currentCount + 1);
};

// Helper method to reset unread count
ConversationSchema.methods.resetUnread = function (userId) {
    this.unreadCount.set(userId.toString(), 0);
};

export default mongoose.models.Conversation || mongoose.model('Conversation', ConversationSchema);
