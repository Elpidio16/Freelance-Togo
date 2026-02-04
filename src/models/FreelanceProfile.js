import mongoose from 'mongoose';

const FreelanceProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
        maxlength: 1000,
    },
    skills: [{
        type: String,
    }],
    hourlyRate: {
        type: Number,
        min: 0,
    },
    dailyRate: {
        type: Number,
        min: 0,
    },
    availability: {
        type: String,
        enum: ['disponible', 'occupé', 'bientôt disponible'],
        default: 'disponible',
    },
    portfolio: [{
        title: String,
        description: String,
        image: String,
        link: String,
        technologies: [String],
    }],
    experience: [{
        company: String,
        role: String,
        duration: String,
        description: String,
        startDate: Date,
        endDate: Date,
        current: Boolean,
    }],
    certifications: [{
        name: { type: String, required: true },
        issuer: { type: String, required: true },
        date: { type: String },
        credentialId: { type: String },
        url: { type: String },
    }],
    socialLinks: {
        linkedin: { type: String },
        github: { type: String },
        portfolio: { type: String },
        twitter: { type: String },
        other: { type: String },
    },
    education: [{
        school: String,
        degree: String,
        field: String,
        year: String,
    }],
    languages: [{
        name: String,
        level: String, // débutant, intermédiaire, avancé, natif
    }],
    profileImage: {
        type: String,
        default: null,
    },
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    totalReviews: {
        type: Number,
        default: 0,
    },
    completedProjects: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Index pour recherche
FreelanceProfileSchema.index({ skills: 1 });
FreelanceProfileSchema.index({ averageRating: -1 });
FreelanceProfileSchema.index({ hourlyRate: 1 });

export default mongoose.models.FreelanceProfile ||
    mongoose.model('FreelanceProfile', FreelanceProfileSchema);
