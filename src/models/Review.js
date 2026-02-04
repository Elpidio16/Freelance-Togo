import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
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
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        required: true,
        trim: true,
    },
    skillsRating: {
        technical: { type: Number, min: 1, max: 5 },
        communication: { type: Number, min: 1, max: 5 },
        deadline: { type: Number, min: 1, max: 5 },
        quality: { type: Number, min: 1, max: 5 },
    },
    wouldRecommend: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

// One review per project
ReviewSchema.index({ projectId: 1 }, { unique: true });
ReviewSchema.index({ freelanceId: 1 });
ReviewSchema.index({ companyId: 1 });

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);
