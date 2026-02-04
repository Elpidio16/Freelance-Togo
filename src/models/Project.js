import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    skills: [{
        type: String,
        required: true,
    }],
    budget: {
        min: {
            type: Number,
            required: true,
        },
        max: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            default: 'FCFA',
        },
    },
    projectType: {
        type: String,
        enum: ['fixed', 'hourly'],
        required: true,
    },
    deadline: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['open', 'in-progress', 'completed', 'cancelled'],
        default: 'open',
    },
    location: {
        type: String,
        default: 'Remote',
    },
    experienceLevel: {
        type: String,
        enum: ['junior', 'intermediate', 'senior', 'any'],
        default: 'any',
    },
    acceptedFreelanceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, {
    timestamps: true,
});

// Indexes pour la recherche
ProjectSchema.index({ status: 1 });
ProjectSchema.index({ companyId: 1 });
ProjectSchema.index({ skills: 1 });
ProjectSchema.index({ createdAt: -1 });

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
