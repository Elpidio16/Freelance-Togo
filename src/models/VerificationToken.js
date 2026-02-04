import mongoose from 'mongoose';

const VerificationTokenSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    token: {
        type: String,
        required: true,
        unique: true,
    },
    expires: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 heures
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400, // Document auto-supprimé après 24h
    },
});

// Index pour performance
VerificationTokenSchema.index({ email: 1 });
VerificationTokenSchema.index({ token: 1 });
VerificationTokenSchema.index({ expires: 1 });

export default mongoose.models.VerificationToken ||
    mongoose.model('VerificationToken', VerificationTokenSchema);
