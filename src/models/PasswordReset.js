import mongoose from 'mongoose';

const PasswordResetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    token: {
        type: String,
        required: true,
        unique: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
    used: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Index pour nettoyer automatiquement les tokens expirés (TTL index)
PasswordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Index pour recherche rapide par token
PasswordResetSchema.index({ token: 1 });

export default mongoose.models.PasswordReset ||
    mongoose.model('PasswordReset', PasswordResetSchema);
