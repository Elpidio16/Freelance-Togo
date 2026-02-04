import mongoose from 'mongoose';

const ProjectApplicationSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
    freelanceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    coverLetter: {
        type: String,
        required: true,
    },
    proposedRate: {
        type: Number,
        required: true,
    },
    estimatedDuration: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
    },
    appliedAt: {
        type: Date,
        default: Date.now,
    },
    respondedAt: {
        type: Date,
    },
}, {
    timestamps: true,
});

// Index composé pour éviter les doublons
ProjectApplicationSchema.index({ projectId: 1, freelanceId: 1 }, { unique: true });
ProjectApplicationSchema.index({ freelanceId: 1 });
ProjectApplicationSchema.index({ projectId: 1 });

export default mongoose.models.ProjectApplication ||
    mongoose.model('ProjectApplication', ProjectApplicationSchema);
